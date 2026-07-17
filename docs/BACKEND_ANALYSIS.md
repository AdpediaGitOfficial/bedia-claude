# Bedia Privé — Backend & Database Analysis Report

**Scope:** `Backend/` (Node.js + TypeScript + Express + Mongoose) and the MongoDB dump `bediaprive_db` (mongodump, server 8.0.16).
**Nature:** Read-only analysis. No application code was modified.
**Product:** "Bedia Privé / Bediapottery" — a pottery‑workshop booking + e‑commerce and marketing/CMS platform (workshops, cart/checkout via Stripe, gift vouchers, blogs, careers, community/real‑estate listings, lead capture, Google reviews).

> ⚠️ **Read this first — two issues dominate everything else:**
> 1. **Payments are broken in production.** `STRIPE_SECRET_KEY` in `.env` is set to a **publishable** key (`pk_live_…`), not a secret key (`sk_…`). Every server‑side `stripe.checkout.sessions.create` fails, so **no order can be completed**. The DB confirms it: **41 / 41 orders are `paymentStatus: "pending"`**, and 73 / 77 bookings are `pending`.
> 2. **Broad broken access control.** "Admin" write/delete endpoints are guarded by `userAuthMiddleware`, which only checks that *some* valid JWT exists — **any logged‑in user can create/update/delete workshops, blogs, categories, etc.** Worse, `POST /user/login` mints a **role:`admin`** token for *any* valid credential, `POST /user/register-admin` is **public**, and much of the cart/checkout surface has **no auth at all**.
>
> **Live secrets are committed in `.env`** (Stripe keys, AWS/DigitalOcean Spaces key+secret, Gmail app password, a 16‑char JWT secret, Google API key). These must be **rotated and revoked** regardless of any other fix.

---

## 1. Application Overview & Architecture

### 1.1 Tech stack
| Concern | Choice |
|---|---|
| Runtime / language | Node.js, TypeScript 5.4 (`strict: true`, target ES2020) |
| Web framework | Express 4 |
| Data layer | MongoDB 8 via Mongoose 8 |
| Auth | JWT (`jsonwebtoken`), bcryptjs |
| Payments | Stripe (`stripe` v20) — Checkout Sessions + `payment_intent.succeeded` webhook |
| File storage | Multer (local disk `uploads/`) + AWS SDK v3 S3 client ("DO Spaces" naming, actually AWS `me-central-1`), `sharp` for image processing |
| PDF | `pdf-lib` + `@pdf-lib/fontkit` (gift vouchers) |
| Mail / SMS | Nodemailer (Gmail transport) + a stray Twilio service |
| Validation | Two systems: `ajv` (JSON Schema) **and** `express-validator` |
| Sanitization | `sanitize-html` |
| Docs | `swagger-jsdoc` + `swagger-ui-express` (basic‑auth gated) |
| Misc | `slugify`, `xml2js` (blog XML import), `express-rate-limit`, Winston logger |

### 1.2 Layered module pattern
Almost every domain is a self‑contained vertical slice:

```
<module>/
  routes/          Express Router — wires middleware + validators to controllers
  controllers/     thin HTTP layer (express-async-handler), shapes the response
  useCases/        business logic / orchestration
  repos/           Mongoose data-access
  models/          Mongoose schema
  routevalidators/ ajv JSON schemas for body/query
../types/          shared TS interfaces (one file per domain)
```

Cross‑cutting: `config/` (db, logger, stripe, localization), `middleware/` (auth ×2, validate, sanitize, rate‑limit, multer, error handler), `common/` (`AppError`, `HttpStatus` enum), `services/` (mail, workshop mail, twilio, google‑review fetch), `utils/` (uploaders, gift voucher/PDF, objectId, deriveClayType).

**Assessment:** The layering is clean, consistent, and readable where followed — a genuine strength. But the pattern is applied unevenly: `community` uses `communityRepository`/`usecases` (lowercase, different naming), `customLeads` has no repo layer, `dashboard` skips `models`, and the `user` module uses an entirely different auth/validation stack than everything else (see §5).

### 1.3 Entry point & request pipeline (`index.ts`)
1. `connectToDatabase()` (retries up to 20× / 3s, then `process.exit(1)`).
2. Static serving of `/uploads`.
3. CORS (`origin` parsed from `CORS_URLS` JSON, `credentials: true`).
4. **Stripe webhook mounted with `express.raw()` before `express.json()`** — correct ordering so signature verification works.
5. `express.json({limit:'30mb'})`, `urlencoded`, `cookieParser`.
6. A middleware that **sets a static `sessionId` cookie from `process.env.SESSION_ID` on every response** (unusual; the value is a fixed secret, not per‑session — see §7).
7. ~25 feature routers mounted.
8. `errorHandleMiddleware` last.
9. Two **unauthenticated debug routes at the app root**: `GET /hello`, `GET /test-email` (the latter actually sends mail).

---

## 2. Module Inventory & API Surface

Public = no auth; **U** = `userAuthMiddleware` (any valid JWT); **A(administrator)** = `adminAuthMiddleware`; **authUser/authAdmin** = the *other* stack (`middleware/authentication.ts`, roles `user`/`admin`).

| Module | Purpose | Notable endpoints (guard) |
|---|---|---|
| **auth** | Admin/staff accounts | `POST /auth/login` (public, rate‑limited); `POST /auth/register` (**public — admin guard commented out**); `GET /auth/user/all` (A); `PUT /auth/change-password` (U); `DELETE /auth/user/:id` (A) |
| **user** | Customer accounts, OTP | `POST /user/register` (public); `POST /user/user-login` (public); OTP send/verify (public); `POST /user/login` (**public → returns admin token**); `POST /user/register-admin` (**public**); `GET /user/all` (authAdmin); profile get/update (authUser, **IDOR**) |
| **dashboard** | Admin stats/charts | `/dashboard/stats`, `/dashboard/chart/new-users` (authAdmin) ✅ correctly admin‑gated |
| **workshop** | Core commerce | CRUD (U); `POST /booking`, `/cart*`, `/cart/checkout`, `/availability` (**public**); gift redeem (public); several **public `/test-*`, `/pdf-grid` debug routes** |
| **category / clayType** | Workshop taxonomy | `GET /all` public; create/update/delete (U) |
| **blog + comment + commentLike** | Blog + threaded comments/likes | blog `GET /all`,`/slug/:slug` public; write (U); `POST /blog/xml` (**public** file import); comments create/like reference customer `Users`. *(comment is the best‑built module — it actually enforces ownership on update/delete with an admin bypass.)* |
| **community** | Real‑estate/community listings | `GET` public; `POST /create` (U); **`PUT /:id` and `DELETE /:id` have NO auth**; `:id` is actually queried as a slug (param/slug mismatch) |
| **termsAndConditions** | T&C content (slug + HTML) | `GET /all` public; write (U); **`POST /terms-and-conditions/xml` public import** |
| **pageMeta** | Per‑URL SEO meta | `GET /adminAll` (U); **`POST /meta-data/page-data` public lookup by body `url` (NoSQL‑injectable)** |
| **customLeads** | Property/contact/consultation/community leads | `POST /:type` (public capture); `GET /all/:type` (U) |
| **careers + jobApplication** | Job posts + applications | posts CRUD (U); `POST /job-application` (public, résumé upload) |
| **report** | File/report upload | both routes (U) |
| **googleReview** | Google reviews sync + manual | `GET /all` public; `POST /sync` (U) calls Google Places API; write (U) |
| **gallery, faq, testimonial, partner, brochure, careerfooter, pageMeta, termsAndConditions, openingHours** | CMS content blocks | `GET /all` public; create/update/delete (U) |
| **fileupload** | Generic media upload | `POST /upload` (U), `DELETE /upload/remove` (U) |

**API flow (typical read):** `GET /x/all` → validator (ajv query) → controller → useCase → repo (`find({isDeleted:false,...})` + pagination) → localized success envelope `{ success, message, ... }`.

**API flow (commerce):** client builds cart → `POST /workshop/cart/checkout` → creates `bookings` + `order` (both `pending`) → creates Stripe Checkout session → returns `checkoutUrl` → Stripe redirects → `payment_intent.succeeded` webhook marks order/bookings paid, emails confirmation, mints gift vouchers, clears cart. **This flow is currently broken at the Stripe‑session step (§3, §6).**

---

## 3. Authentication & Authorization

There are **two parallel, overlapping auth systems** sharing one `JWT_SECRET` and one database but using different collections, role vocabularies, and token shapes:

| | Admin `auth` module | Customer `user` module |
|---|---|---|
| Middleware | `middleware/auth/authMiddleware.ts` → `req.user` | `middleware/authentication.ts` → `res.locals.userId` |
| Roles expected | `administrator` / `user` | `admin` / `user` |
| Token payload | `{ email, role }` (no userId) | `{ role, userId }` (no email) |
| Token lifetime | `JWT_DURATION` (env, `60d`) | `100000d` (~273 years) or `1d` |
| Password | bcrypt rounds 10 | **plaintext on customer register**; bcrypt on admin register |
| Model → collection | model `user` → `users` | model `Users` → `users` (**same collection!**) |

Because both sign with the same secret, tokens are cross‑verifiable; only the role string decides acceptance.

### 3.1 Critical authz findings
- **Privilege escalation — `POST /user/login` returns an admin token for ANY valid login.** `verifyLogin(email,password)` checks only email+password+`status===1` (never `role`), then unconditionally signs `generateToken({ role:'admin', userId })` with a 273‑year expiry. Any customer (or any account created via the public admin‑register endpoint) gets an `admin` token accepted by every `authenticateAdmin` route (`/user/all`, `/user/:id`, `DELETE /user/:userId`, `/dashboard/*`).
- **Public admin creation.** `POST /user/register-admin` has no middleware and sets `role:'admin'`. `POST /auth/register` is public (its `adminAuthMiddleware` is commented out).
- **"Admin" CRUD guarded only by `userAuthMiddleware`.** Across workshop, blog, category, clayType, career, gallery, faq, testimonial, partner, brochure, careerfooter, pageMeta, termsAndConditions, openingHours, googleReview, community, report, fileupload — create/update/delete require only a valid JWT of *any* role. The real `adminAuthMiddleware` is essentially unused.
- **Fail‑closed role mismatch.** `adminAuthMiddleware` requires `role === 'administrator'`, but the auth module never issues `'administrator'` (default is `'user'`). So `GET /auth/user/all` and `DELETE /auth/user/:id` are unreachable by any legitimately issued token (broken, but fails safe) unless a doc is hand‑edited.
- **IDOR.** `GET/PUT /user/profile/:userId` read `req.params.userId` and never compare to the token identity — any customer can read/modify any profile. `PUT /auth/change-password` targets the user by **body `email`**, not the token. Cart endpoints (`GET /workshop/cart/:userId`, add/remove/checkout) trust `userId` from path/body.
- **Sensitive‑data disclosure.** Customer `getProfile`/`getUsers`/login responses use `.lean()` with no projection, returning `password` hash, `otp`, and `fixedOtp`. (The admin module *does* project these out — inconsistent.)
- **OTP backdoors.** Hardcoded phone numbers accept fixed OTPs (`112233`, and specific numbers → `123456` / `112114`). Permanent account backdoors.
- **Mass assignment.** Customer `createUser`/`updateUser` spread `{...req.body}` directly; only `role` is forced. Clients can set `mobileNumberVerified`, `isActive`, `status`, `avatar`, `fixedOtp`, etc. (The ajv‑validated admin schemas use `additionalProperties:false` — the customer module uses express‑validator, which doesn't strip.)
- **Weak JWT hygiene.** 16‑char secret (`QWljkflgfdp1k72n`), 273‑year tokens, no revocation (logout only flips a `UserAuth.isActive` flag the middleware never checks), role trusted blindly without DB re‑check.

---

## 4. Database Schema & ERD

### 4.1 Collections (from the dump)
25 collections; live data mostly in commerce + a little CMS content:

| Collection | Docs | Notes |
|---|---:|---|
| workshopbookings | 77 | 73 pending / 3 paid; bookingType normal 28, pottery 24, gift 14, none 11 |
| orders | 41 | **all 41 `pending`**; 17 have `userId` (guest checkout) |
| workshops | 13 | embedded `defaultSlots[]`, `options[]`, `images[]` |
| users | 20 | **mixed**: 1 admin + 19 with admin‑shaped fields (`name/password/role/designation`) |
| carts | 7 | one per user (unique `userId`) |
| categories | 10 | self‑referential `parentId` |
| faqs | 6 · googlereviews | 6 · claytypes 3 · terms_and_conditions 2 · opening_hours 1 |
| blogs, comments, commentlikes, communities, *_leads, galleries, partners, testimonials, brochures, careers, jobapplications, page-metas, reports, userauths | 0 | empty in this dump |

### 4.2 Indexes
Unique: `blogs.slug`, `careers.slug`, `categories.slug`, `carts.userId`, `commentlikes.(commentId,userId)`, `communities.slug` + `communities.newLaunchProjects.slug`, `googlereviews.(authorName,reviewTime)`, `orders.orderNumber`, `page-metas.slug`, `workshopbookings.bookingNumber`, `workshops.slug`. Secondary: `comments.postId/userId/parentId`, `googlereviews.placeId`, `workshopbookings.(workshopId,bookingDate,slotId)` & `userId`, `workshops.categoryId` & `isActive`.

### 4.3 Referential integrity — **broken model references** ⚠️
Registered models: `user`, `Users`, `UserAuth`, `workshop`, `cart`, `orders`, `workshopBookings`, `comment`, `commentLike`, `category`, `clayType`, `Community`, `blog`, plus CMS/lead models.

- `cart.userId`, `orders.userId`, `workshopBookings.userId` all use **`ref: 'users'`** — but **no model named `users` is registered** (only `user`, `Users`, `UserAuth`). Any `.populate('userId')` throws Mongoose `MissingSchemaError`.
- `comment.userId`, `commentLike.userId` use `ref: 'Users'` (customer model) — correct.
- **Collection collision:** model `user` (admin) and model `Users` (customer) **both map to the physical `users` collection** (Mongoose lowercases+pluralizes `Users` → `users`). The dump confirms admin and customer documents intermingle in one collection. This is a latent data‑integrity hazard (a customer OTP flow and an admin login operate on the same collection with different schemas).

### 4.4 ERD (logical)

```
                         ┌────────────┐
                         │  category  │ (self-ref parentId → category)
                         └─────┬──────┘
                     categoryId │ 1
                                ▼ *
   ┌──────────┐  workshopId  ┌────────────┐  optionId/slotId (embedded)
   │  cart    │─────────────▶│  workshop  │  defaultSlots[] · options[](clayTypeId→clayType)
   │(1/user)  │              └─────┬──────┘
   └────┬─────┘                    │ workshopId
 userId │ (ref 'users' ✗)          ▼ *
        ▼                    ┌──────────────────┐   bookingId   ┌──────────┐
   ┌─────────┐  userId(✗)   │ workshopBookings │◀──────────────│  orders  │
   │  Users  │◀─────────────│  customer{}, gift │   (order.items[]) userId(✗)
   │(customer)│  (ref 'users')│  paymentStatus   │              └──────────┘
   └────┬────┘              └──────────────────┘
 userId │ (ref 'Users' ✓)
        ▼
   ┌─────────┐  postId → blog     ┌────────┐   ┌─────────────┐
   │ comment │───────────────────▶│  blog  │   │ commentLike │ (commentId→comment, userId→Users)
   │ parentId→comment (self-ref)  └────────┘   └─────────────┘
   └─────────┘

 Standalone (no FKs): faq, testimonial, partner, brochure, gallery, careerFooter,
 pageMeta, termsAndConditions, openingHours, googleReview, career, jobApplication,
 community (embeds newLaunchProjects[]), *_leads (schemaless strict:false),
 report, user(admin), UserAuth.
```
Legend: `✗` = declared `ref:'users'` resolves to a non‑existent model (populate fails); `✓` = valid ref.

---

## 5. Data Flow — Commerce (detailed)

1. **Build order/cart.** Direct (`POST /workshop/booking`) or cart (`POST /workshop/cart/checkout`). Both validate slot/option, run a soft capacity check, then create one `workshopBooking` per group and one `order`, all `paymentStatus:'pending'`.
2. **Capacity check** counts only bookings with `bookingStatus ∈ {confirmed, paid}` — but `'paid'` is not a valid `bookingStatus` value (it's a `paymentStatus`), so effectively only `confirmed` counts, and brand‑new `pending` bookings never count → **overbooking window** during the whole pay period. Uses a hardcoded `12` instead of `slot.capacity`, and the pre‑checkout availability endpoint uses *different* rules than the checkout gate.
3. **Stripe session** (`stripe.checkout.sessions.create`) — **fails today** (publishable key). No DB transaction wraps steps 1–3, so every failed attempt leaves orphaned `pending` bookings/orders (explains 41 stuck orders).
4. **Webhook** (`payment_intent.succeeded` only): marks order+bookings paid, sends confirmation email, generates gift voucher PDFs, clears cart. **Not idempotent** — Stripe re‑delivery re‑mints `voucherCode = BP${Date.now()}` and overwrites the code already emailed, breaking redemption; also re‑sends emails. Concurrent gift bookings in one order can collide on `Date.now()` voucher codes.
5. **Gift redemption** (public): `GET /redeem/validate/:bookingId` (leaks recipient PII with no secret) → `POST /redeem/confirm` with `bookingId`+`voucherCode` sets date/slot and `giftStatus:'redeemed'`. Recipient contact captured at redemption is discarded.

---

## 6. Key Observations — Bugs & Correctness

**Blocking / high‑impact**
1. **Stripe key is publishable, not secret** → all checkouts fail; orders pile up `pending`.
2. **No transactions** around multi‑document booking/order creation → orphaned partial writes.
3. **Overbooking race** — pending bookings excluded from capacity; no locking/atomic guard.
4. **Non‑idempotent webhook** — duplicate delivery invalidates issued gift vouchers and double‑sends mail.
5. **`ref:'users'` populate failures** on cart/order/booking; **user model/collection collision**.

**Medium**
6. `report` controller missing `return` after a 400 → continues and dereferences empty `req.files` → double‑send/crash.
7. Non‑deterministic IDs from `Date.now()` for `orderNumber`/`bookingNumber`/`voucherCode` → duplicate‑key failures under load.
8. `errorHandleMiddleware` calls `next(err)` after sending the response (risk of "headers already sent"); its 404 branch is dead (both branches identical); `success` is always `false`.
9. Create endpoints return `200` instead of `201`; validation failures return `406` instead of `400/422`.
10. `updateUserByIdUseCase` looks up by body `email` but updates by URL `id` (identity confusion).
11. Repos use `findOneAndUpdate` without `{new:true}` yet callers treat the pre‑image as the result.
12. Customer register never hashes the password, but login `bcrypt.compare`s it → self‑registered password login always fails, plaintext stored.
13. Route‑ordering shadowing in `community`: `GET /:slug` is declared before `GET /all-community-projects`, so the latter is unreachable. Also `PUT/DELETE /community/:id` query the DB **by slug**, so a real ObjectId never matches.
14. **Google‑review sync is broken:** `upsertGoogleReview` matches on `{authorName,reviewTime}` and `$set` omits the `required+unique` `reviewId`, so the 2nd+ synced reviews collide on `null reviewId` (E11000) and only the first persists.
15. **`totalCount` vs list‑filter mismatch** (category, clayType, openingHours): the count query omits `isActive` while the list adds `isActive:true` → wrong page counts.
16. **Public endpoints serve deactivated records:** gallery/faq/brochure `getAll` and careers/T&C `getBySlug` don't filter `isActive` (inconsistent with category/clayType which do).
17. `customLeads` all‑types count omits `community` leads; `getLeadCountController` is defined but wired to no route (dead).
18. Careers returns `{ totalCount:0, Careers:[] }` (capital) on empty but `careers` otherwise → client reads `undefined`.
19. `fileupload` splits backends: **upload writes to local disk** but **delete targets DigitalOcean/S3 Spaces**, and a key‑format mismatch (no leading slash on store vs `/uploads` guard on delete) means legit deletes miss.
20. `utils/objectIdParser.ObjectID()` accepts any 12‑byte string as a valid ObjectId, so `if (ObjectID(id))` guards are weaker than they look.
21. `T&C` model has **no `slug` field/unique index** yet the code generates slugs (starting at `-1`) and `bulkInsert` builds them in parallel → duplicate/colliding slugs silently accepted.

**Low**
14. `people` vs `adult+child` never reconciled (cosmetic split, price uses `people`).
15. Unescaped `$regex` from user search input → ReDoS/regex‑injection (string‑coerced, so not NoSQL object injection).
16. Slug pre‑save hooks do sequential `exists()` lookups in a loop (works, but O(n) queries and racy under concurrency; `blog` starts suffix at `-1` so first slug is always `title-1`).

---

## 7. Key Observations — Security

Severity‑ordered:

1. **Committed live secrets (`.env`)** — Stripe key + webhook secret, AWS/DO Spaces access key + secret, Gmail app password (`CLIENT_PASSWORD`), `JWT_SECRET`, Google Places API key, XML feed token, `SWAGGER_PASSWORD`, `SESSION_ID`. `.env` *is* in `.gitignore`, but these values have been shared/exposed and must be **rotated**.
2. **Privilege escalation & public admin creation** (§3.1).
3. **Broken access control on all "admin" writes** — any JWT can mutate content; role never checked.
4. **Unauthenticated commerce surface + cart IDOR** — anyone can create bookings/orders, and read/mutate/checkout *any* user's cart by supplying `userId`.
5. **Public debug/test endpoints** — `/workshop/test-pdf`, `/pdf-grid`, `/test-booking-mail`, `/test-gift-mail`, root `/test-email`. The mail ones **send real email to attacker‑supplied `to`/`cc`** (spam/phishing relay); the PDF ones do heavy sync work and write files on every hit (disk‑fill DoS).
6. **PII exposure** — `GET /workshop/redeem/validate/:bookingId` returns recipient name/message/occasion for any booking id with no secret; customer profile/list responses leak password hashes & OTPs.
7. **Static `sessionId` cookie** set from a fixed `SESSION_ID` env value on every response (`secure` only in prod) — not a real session; misleading and low‑value.
8. **File upload safety** — Multer disk storage, 200 MB limit, filename = `Date.now()-<originalname>` (original name used unsanitized → path/anomaly risk); files served statically from `/uploads`; mime‑type allow‑list only (no content sniffing). Uploads never moved to durable S3 for vouchers.
9. **Rate limiting minimal** — only login (keyed on `req.body.email`, so attackers rotate emails to dodge it) and an XML fetch limiter; no global limiter; booking/OTP/lead endpoints unthrottled.
10. **User enumeration** — login distinguishes "user not found" vs "invalid password".
11. **Schemaless lead intake** (`strict:false`, public `POST /leads/:type`) accepts arbitrary fields → storage abuse. PII from all lead types + job‑application résumés is readable by **any** authenticated user (no admin gate, no field projection).
12. **Arbitrary file delete (IDOR) — `DELETE /upload/remove`.** `location` is fully attacker‑controlled from the query and passed to `deleteFile(location)` behind only a `startsWith('/uploads')` check (bypassable via `/uploads/../…`), with no ownership/DB check → any user can delete any object under the uploads prefix.
13. **Stored XSS via XML import.** Blog/T&C `/xml` routes store `content` HTML **verbatim** — `sanitizeBody` runs on the JSON create/update routes but **not** on the XML paths. Compounded by `/uploads` serving `image/svg+xml` same‑origin (uploaded SVG = stored XSS).
14. **XML import returns `200 success` before it finishes.** `xml2js.parseString(xml, async (err,result)=>{…})` isn't awaited; the controller responds success while parsing/insert is still pending, and a malformed feed becomes an **unhandled promise rejection**. The endpoint is unauthenticated and un‑throttled.
15. **NoSQL injection — `POST /meta-data/page-data`.** `findOne({ url: req.body.url })` with no coercion; `{"url":{"$ne":null}}` matches arbitrary docs.
16. **Mass assignment across all CMS repos** — `findOneAndUpdate(query, req.body)` with no whitelist/`runValidators`, so `PUT {isDeleted:true}` is an alternate delete, `{isActive:false}` hides content, `{slug:…}` overrides the uniqueness‑guarded slug.
17. **Spoofable upload validation** — only `file.mimetype` is checked (client‑controlled; no magic‑byte/size sniffing); multer allows 200 MB while `express.json` allows 30 MB (large‑body DoS).
18. **No `helmet`, no global rate limiter**; `fetchXMLLimiter` is defined but never applied to the XML routes; community/customLeads controllers return raw DB `error.message` to clients (internal info disclosure).
19. **SSRF/exfil surface** — `googleReviewFetch.service` and XML import perform outbound HTTP from server config (URL hardcoded, `place_id`/`key` from env, so low risk as configured; add request timeouts) — worth review.

---

## 8. Performance Observations

1. **Full‑collection workshop scans** in capacity/availability paths (`workshopModel.find({isDeleted,isActive})` with no projection/`.lean()`), executed **once per cart group** inside the checkout loop → N scans + N aggregations for an N‑item cart.
2. **N+1** `getWorkshopByIdRepo` per group (the webhook path was optimized to a single `$in`; the checkout path was not).
3. **Cross‑workshop capacity aggregations omit `workshopId`** (the leading index field) → index unusable → collection scans; booking search sorts on `createdAt` with unindexed `$or` regex.
4. **Synchronous PDF/file work on the event loop** (`fs.readFileSync`/`writeFileSync`, font subsetting) inside the webhook's `Promise.all`; `sharp` CPU work.
5. **`nodemailer.verify()` on every send** (extra SMTP round‑trip) with `logger:true, debug:true` enabled.
6. Many list endpoints paginate, but some admin lists and lead lists lack upper bounds on `limit`.

---

## 9. Dead / Duplicate Code & Consistency

- **Duplicate auth stacks** (`middleware/auth/*` vs `middleware/authentication.ts`) and **duplicate user models/interfaces** (`user`/`Users`, two `IUsers`, two `IUsers`‑shaped types).
- **Duplicate validation stacks** (`ajv` `validate*` vs `express-validator` in the `user` module); `validateBody` vs `validateReqBody` near‑duplicates (only the latter used).
- **Large commented‑out blocks** throughout `workshopUseCase.ts`/`workshopRepo.ts` (old booking/cart/availability implementations, transaction scaffolding), `authUseCase.ts`, `registerUserRepo.ts`, `middleware/multer.ts` (old config), `mailService.ts` (old transport).
- **Defined‑but‑unwired validators:** `checkoutCartSchema`, `workshopCapacitySchema`, `removeCartItem` body — so `/cart/checkout` and `/pottery-capacity` run with **no body validation**.
- **Unused/stray services:** `twilioService.ts` (unrelated "Etern Learning" OTP), unused repo helpers (`checkMobileExist`, `verifyParentDobYear`, `getUserCount`, stubbed `uploadAvatar`).
- **Dead security middleware:** `adminAuthMiddleware` and `authenticateAdmin` are **defined but imported nowhere** for CMS modules; `fetchXMLLimiter` is never applied. (`loginLimiter` *is* used on `/auth/login`.)
- **Dead functions/routes:** `fetchCategoryBySlug`, `clayTypeRepo.populate('parentId')` (no such field), `openingHours.fetchOpeningHoursBySlug` (queries non‑existent fields), googleReview slug/meta helpers (query non‑schema fields), `getCommunitiesCountController`/`getLeadCountController` (not routed), `uploadFileUseCase` DO‑Spaces path (dead for the wired disk route), plus boilerplate `// check for unique value duplications` comments in every create/update useCase.
- **Inconsistent conventions:** `community`/`customLeads` naming & folder shape; mixed `console.log` vs Winston logger; direct `process.env.*` reads bypassing `configKeys` (Stripe/SMTP/BASE_URL/FRONTEND_URL, etc.); mixed 200/201 and error‑envelope shapes.
- **Test coverage:** effectively one unit test (`utils/deriveClayType.test.ts`); Jest configured but no meaningful suite.

---

## 10. Recommended Improvements (prioritized)

### P0 — do immediately
1. **Rotate & revoke every secret** in `.env` (Stripe, AWS/DO Spaces, Gmail app password, JWT secret, Google API key, XML token, Swagger password). Move to a secrets manager; keep only `.env.example` in VCS.
2. **Fix Stripe** — set `STRIPE_SECRET_KEY` to a real `sk_…` secret key; verify checkout end‑to‑end.
3. **Fix authorization** — replace `userAuthMiddleware` with a genuine role‑checking admin guard on all admin writes; make `POST /user/login` derive role from the DB record (never hardcode `admin`); protect/remove `POST /user/register-admin` and `POST /auth/register`; add auth + server‑derived `userId` to all cart/booking/checkout routes.
4. **Remove/guard all `test-*`/`pdf-grid`/`test-email` endpoints** (or gate behind admin + env flag); add auth on `PUT/DELETE /community/:id` and the `/xml` import routes.
5. **Stop leaking secrets in responses** — project out `password`/`otp`/`fixedOtp` everywhere; require a secret to view gift‑voucher details; add an admin gate + projection to lead/job‑application reads.
6. **Fix the arbitrary file‑delete IDOR** (`DELETE /upload/remove`) — validate/normalize the key and enforce ownership; sanitize XML‑imported HTML; block SVG (or serve `/uploads` with `Content-Disposition: attachment`/CSP).

### P1 — correctness & data integrity
6. Wrap booking+order creation in a **Mongoose transaction**; pass the existing optional `session` through.
7. **Fix capacity logic**: count `pending` (with a short TTL/hold) toward capacity, use `slot.capacity`, use a single source of truth for availability, and make the reservation atomic (conditional update / unique hold doc) to prevent overbooking.
8. **Make the webhook idempotent** (short‑circuit if already `paid`), generate collision‑free deterministic IDs (e.g. `uuid`/counter) for order/booking/voucher, and handle `payment_intent.payment_failed`/expired sessions.
9. **Fix model references**: register one canonical user model, correct all `ref:'users'` → the real model name, and **resolve the `user`/`Users` collection collision** (rename one collection or unify).
10. Enforce **token‑identity checks** to close IDOR (profile, cart, change‑password).

### P2 — hardening & quality
11. Consolidate to **one auth system, one validation system, one user model**; unify role vocabulary.
12. Hash customer passwords (bcrypt) or drop the password path entirely if OTP‑only; remove OTP backdoors.
13. Add **global + per‑route rate limiting**; throttle OTP/booking/lead endpoints; key login limiter on IP+email.
14. Escape/limit `$regex` search input; add upper bounds to all `limit` params.
15. Move uploads to durable object storage; sanitize/randomize stored filenames; add content‑type sniffing.
16. Fix `errorHandleMiddleware` (drop `next()`, real 4xx/5xx mapping, correct `success`); standardize 201/response envelopes; centralize config through `configKeys`.
17. Replace `console.log` with the Winston logger; delete dead/commented code; wire the unused validators.
18. Add a real test suite (auth, capacity, webhook idempotency, IDOR) and CI (lint already configured with `eslint-plugin-security`).

---

## Appendix A — Method
- Extracted `Backend.zip` (≈180 `.ts` files) and the `bediaprive_db` mongodump; decoded BSON with the `bson` library to inspect real documents (redacting secrets/PII).
- Read all models, routes, middleware, config, and entry point directly; cross‑checked model registration names vs `ref:` targets; deep‑dived commerce, auth/user, and CMS modules.
- All findings reference concrete files/behaviors; no code was modified.
