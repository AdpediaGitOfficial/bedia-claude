import express from 'express';
import logger from './config/logger';
import cors, { CorsOptions } from 'cors';
import path from 'path';
import connectToDatabase from './config/connectToDatabase';
import errorHandleMiddleware from './middleware/errorHandleMiddleware';
import configKeys from './configKeys';
import setupSwagger from './swaggerdocs/swaggerConfig';
import fileUploadRoute from './fileupload/routes/fileUploadRoute';
import blogRoute from './blog/routes/blogRoute';
import commentRoute from './comment/routes/commentRoute';
import testimonialRoute from './testimonial/routes/testimonialRoute';
import partnerRoute from './partner/routes/partnerRoute';
import reportRoute from './report/routes/reportRoute';
import categoryRoute from './category/routes/categoryRoute';
import workshopRoute from './workshop/routes/workshopRoute';

import authRoute from './auth/routes/authRoute';
import careersRoute from './careers/routes/careerRoute';
import careerFooterRoute from './careerfooter/routes/careerFooterRoute';
import metaDataRoute from './pageMeta/routes/pageMetaRoute';
import customLeadRoute from './customLeads/routes/customLeadRoute';
import communityRoute from './community/routes/communityroute';
import cookieParser from 'cookie-parser';
import brochureRoute from './brochure/routes/brochureRoute';
import googleReviewRoute from './googleReview/routes/googleReviewRoute';
import galleryRoute from './gallery/routes/galleryRoute';
import faqRoute from './faq/routes/faqRoute';
import userRoute from './user/routes/userRoutes';
import clayTypeRoute from './clayType/routes/clayTypeRoute';
import termsAndConditionsRoute from './termsAndConditions/routes/termsAndConditionRoute';
import openingHoursRoute from './openingHours/routes/openingHoursRoute';
import dashboardRoute from './dashboard/routes/dashboardRoute';
import {
  stripeWebhookController,
  testBookingEmail,
} from './workshop/controllers/workshopController';

const app = express();

// Fail fast on a missing JWT secret. Without it, jsonwebtoken throws the opaque
// "secretOrPrivateKey must have a value" only when a token is first signed
// (e.g. during registration/login) — catch it at boot with a clear message.
if (!configKeys.JWT_SECRET) {
  logger.error(
    'JWT_SECRET is not set. Set a strong value in the environment (see .env.example) before starting the server.',
  );
  process.exit(1);
}

connectToDatabase();

app.use('/uploads', express.static(path.join(__dirname, './uploads')));

// Allowed browser origins from CORS_URLS (JSON array). Normalize trailing
// slashes so "https://x.com" and "https://x.com/" both match.
const allowedOrigins: string[] = JSON.parse(configKeys.CORS_URLS);
const normalizeOrigin = (o: string): string => o.replace(/\/+$/, '');
const allowedOriginSet = new Set(allowedOrigins.map(normalizeOrigin));

const corsOptions: CorsOptions = {
  origin(origin, callback) {
    // Allow non-browser clients (curl, server-to-server, same-origin) that send
    // no Origin header, and any explicitly allow-listed browser origin.
    if (!origin || allowedOriginSet.has(normalizeOrigin(origin))) {
      callback(null, true);
    } else {
      logger.warn(
        `CORS blocked origin: ${origin}. Allowed: ${[...allowedOriginSet].join(', ')}`,
      );
      callback(null, false);
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
  credentials: true,
};
app.use(cors(corsOptions));
// Ensure CORS preflight (OPTIONS) is answered for every route.
app.options('*', cors(corsOptions));

// For stripe
app.post(
  '/workshop/stripe-webhook',
  express.raw({ type: 'application/json' }),
  stripeWebhookController,
);

app.get('/test-email', testBookingEmail);

app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Set secure cookie options
app.use((req, res, next) => {
  res.cookie('sessionId', process.env.SESSION_ID as string, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict', // This is the key setting
    path: '/',
    maxAge: 3600000, // 1 hour
  });
  next();
});

app.use('/blog', blogRoute);
app.use('/comment', commentRoute);
app.use('/testimonial', testimonialRoute);
app.use('/partner', partnerRoute);
app.use('/customleads', customLeadRoute);
app.use('/report', reportRoute);
app.use('/category', categoryRoute);
app.use('/workshop', workshopRoute);
app.use('/auth', authRoute);
app.use('/careers', careersRoute);
app.use('/careerfooter', careerFooterRoute);
app.use('/meta-data', metaDataRoute);
app.use('/community', communityRoute);
app.use('/upload', fileUploadRoute);
app.use('/brochure', brochureRoute);
app.use('/reviews', googleReviewRoute);
app.use('/gallery', galleryRoute);
app.use('/faq', faqRoute);
app.use('/user', userRoute);
app.use('/clay-type', clayTypeRoute);
app.use('/terms-and-conditions', termsAndConditionsRoute);
app.use('/opening-hours', openingHoursRoute);
app.use('/dashboard', dashboardRoute);

app.use(errorHandleMiddleware);

app.get('/hello', (req, res) => {
  res.send('hello world');
});

const port = configKeys.PORT;

app.listen(port, () => {
  logger.info(`application is running at port ${port}`);
  setupSwagger(app);
});
