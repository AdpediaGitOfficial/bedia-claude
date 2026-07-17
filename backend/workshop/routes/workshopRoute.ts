import { Router } from 'express';
import {
  createWorkshop,
  deleteWorkshopById,
  updateWorkshopById,
  getAllWorkshops,
  getWorkshopById,
  getAllWorkshopsForAdmin,
  getWorkshopBySlug,
  getHomepageWorkshops,
  getWorkshopsByCategory,
  checkWorkshopAvailability,
  createWorkshopBooking,
  // stripeWebhookController,
  getWorkshopBookings,
  getWorkshopBookingById,
  addToCart,
  getCartController,
  removeCartItem,
  checkoutCart,
  checkPotteryWorkshopAvailability,
  validateGiftVoucher,
  confirmGiftRedemption,
  checkPotteryWorkshopCapacity,
} from '../controllers/workshopController';
import sanitizeBody from '../../middleware/sanitizeMiddleware';
import { validateQuery, validateReqBody } from '../../middleware/validate';
import { getAllWorkshopSchema } from '../routevalidators/getAllWorkshops';
import { JSONSchemaType } from 'ajv';
import { createWorkshopSchema } from '../routevalidators/createWorkshop';
import { userAuthMiddleware } from '../../middleware/auth/authMiddleware';
import { createWorkshopBookingSchema } from '../routevalidators/createWorkshopBooking';
import { addToCartSchema } from '../routevalidators/addToCartSchema';
import { generateGiftVoucher } from '../../utils/generateGiftVoucher';
import { generateCoordGrid } from '../../utils/pdfCoordHelper';
import {
  sendWorkshopBookingConfirmationMail,
  sendGiftVoucherMail,
} from '../../services/workshopBookingMailService';
import { deriveClayType } from '../../utils/deriveClayType';

const router = Router();
router.get('/test-pdf', async (req, res) => {
  const { personalMessage, guests, giftFor, giftValidity, voucherCode, clayType, redeemUrl } =
    req.query as any;

  const pdf = await generateGiftVoucher({
    personalMessage:
      personalMessage ||
      'Happy Birthday, my love. Always be happy and keep creating beautiful things. Wishing you a wonderful day full of joy at the pottery studio.',
    guests: guests || '1',
    giftFor: giftFor || 'Adult',
    giftValidity: giftValidity || '1 May 2027',
    voucherCode: voucherCode || 'GIFT-1781787035375-1234',
    clayType: clayType || 'Terracotta Clay',
    redeemUrl: redeemUrl || `${process.env.FRONTEND_URL}/redeem?ref=test-booking-id`,
  });

  return res.download(pdf.outputPath);
});

router.post('/test-booking-mail', async (req, res) => {
  try {
    const body = req.body;

    // Accept either the real { order, bookingsData } shape or a flat booking
    // object (like the /test-gift-mail payload) and wrap it on the fly.
    const payload = Array.isArray(body.bookingsData)
      ? body
      : {
          order: body.order || {
            orderNumber: body.orderNumber || `TEST-${Date.now()}`,
            grandTotal: body.grandTotal ?? 0,
          },
          bookingsData: [
            {
              booking: body.booking || body,
              workshop: body.workshop || { title: body.items?.[0]?.optionTitle || 'Workshop' },
              slot: body.slot,
            },
          ],
          to: body.to,
          cc: body.cc,
        };

    await sendWorkshopBookingConfirmationMail(payload);
    return res.json({ ok: true, message: 'Mail function executed — check inbox/logs' });
  } catch (err: any) {
    return res.status(500).json({ ok: false, error: err.message });
  }
});

// Mirrors processGiftBooking (workshopController) but stubs the Mongoose
// .save() — generates a real voucher PDF and sends the real gift email so the
// flow can be exercised from Postman with a plain JSON body.
router.post('/test-gift-mail', async (req, res) => {
  try {
    const giftBooking = req.body;

    const clayType = deriveClayType(giftBooking.items?.[0]?.optionTitle);
    const guests = String(giftBooking.totalPeople);
    const voucherCode = `BP${Date.now()}`;

    const voucher = await generateGiftVoucher({
      personalMessage: giftBooking.giftDetails?.personalMessage || '',
      guests,
      giftFor: giftBooking.giftDetails?.giftFor || '',
      voucherCode,
      clayType,
      redeemUrl: `${process.env.FRONTEND_URL}/redeem?ref=${giftBooking._id || 'test-booking-id'}`,
      giftValidity: giftBooking.giftValidity
        ? new Date(giftBooking.giftValidity).toLocaleDateString('en-US', {
            month: 'long',
            day: '2-digit',
            year: 'numeric',
          })
        : '',
    });

    // Mirror what processGiftBooking writes back, but in-memory only.
    if (!giftBooking.giftDetails) giftBooking.giftDetails = {};
    giftBooking.giftDetails.voucherCode = voucherCode;
    giftBooking.giftDetails.voucherPdf = voucher.fileName;

    await sendGiftVoucherMail({
      booking: giftBooking,
      voucherPath: voucher.outputPath,
      voucherCode,
    });

    return res.json({ ok: true, voucherCode, message: 'Gift mail executed — check inbox/logs' });
  } catch (err: any) {
    return res.status(500).json({ ok: false, error: err.message });
  }
});

router.get('/pdf-grid', async (req, res) => {
  const pageIndex = parseInt((req.query.page as string) || '0', 10);
  const outPath = await generateCoordGrid(pageIndex);
  return res.download(outPath);
});

router.get('/all', validateQuery(getAllWorkshopSchema as JSONSchemaType<unknown>), getAllWorkshops);
router.get(
  '/homepage',
  validateQuery(getAllWorkshopSchema as JSONSchemaType<unknown>),
  getHomepageWorkshops,
);

router.get(
  '/byCategory',
  validateQuery(getAllWorkshopSchema as JSONSchemaType<unknown>),
  getWorkshopsByCategory,
);

router.get(
  '/adminAll',
  userAuthMiddleware,
  validateQuery(getAllWorkshopSchema as JSONSchemaType<unknown>),
  getAllWorkshopsForAdmin,
);
router.post(
  '/',
  userAuthMiddleware,
  validateReqBody(createWorkshopSchema as JSONSchemaType<unknown>),
  sanitizeBody,
  createWorkshop,
);
router.put(
  '/:id',
  userAuthMiddleware,
  validateReqBody(createWorkshopSchema as JSONSchemaType<unknown>),
  sanitizeBody,
  updateWorkshopById,
);
router.delete('/:id', userAuthMiddleware, deleteWorkshopById);
router.get('/bySlug/:slug', getWorkshopBySlug);
router.get('/:id', userAuthMiddleware, getWorkshopById);

router.post('/availability', checkWorkshopAvailability);
router.post('/pottery-availability', checkPotteryWorkshopAvailability);
router.post('/pottery-capacity', checkPotteryWorkshopCapacity);

router.post(
  '/booking',
  validateReqBody(createWorkshopBookingSchema as JSONSchemaType<unknown>),
  sanitizeBody,
  createWorkshopBooking,
);

router.get('/bookings/all', userAuthMiddleware, getWorkshopBookings);
router.get('/workshop-booking/:id', userAuthMiddleware, getWorkshopBookingById);

// Cart apis
router.post(
  '/cart',
  validateReqBody(addToCartSchema as JSONSchemaType<unknown>),
  sanitizeBody,
  addToCart,
);

router.get('/cart/:userId', getCartController);
router.delete('/cart/item', removeCartItem);
router.post('/cart/checkout', checkoutCart);

// Gift voucher redemption (public — recipient has the code from email)
router.get('/redeem/validate/:bookingId', validateGiftVoucher);
router.post('/redeem/confirm', confirmGiftRedemption);

export default router;
