/**
 * Seed REAL Google reviews into the googlereviews collection.
 *
 * Use this when the Places API sync is unavailable (e.g. billing not enabled).
 * Copy your ACTUAL reviews from your Google Business listing into the REVIEWS
 * array below — do NOT invent reviews; these are shown publicly as genuine.
 *
 * Run from the Backend directory:
 *   npx ts-node scripts/seedRealGoogleReviews.ts
 *
 * It upserts on { authorName, reviewTime } (the same dedup key as the live
 * sync), so re-running it — or enabling the real sync later — will not create
 * duplicates.
 */
import 'dotenv/config';
import mongoose from 'mongoose';
import configKeys from '../configKeys';
import googleReviewModel from '../googleReview/models/googleReviewModel';

type SeedReview = {
  authorName: string;
  rating: number; // 1..5
  text: string;
  date: string; // when the review was left, e.g. '2025-03-14'
  profilePhotoUrl?: string;
};

// ────────────────────────────────────────────────────────────────────────────
// PASTE YOUR REAL REVIEWS HERE (copied from your Google listing).
// The 5 entries below are EMPTY PLACEHOLDERS — fill them in or delete extras.
// ────────────────────────────────────────────────────────────────────────────
// Real reviews copied from the Google Business listing. All were shown as
// "2 months ago", so date is approximate (only used as the dedup key).
const REVIEWS: SeedReview[] = [
  {
    authorName: 'Jacqueline Crasto',
    rating: 5,
    text: 'Loved this place - I had a good time! Great for solo dates 🎀',
    date: '2026-04-27',
  },
  {
    authorName: 'Adi Sal',
    rating: 5,
    text: 'Our teacher was very helpful and patient in showing us how to balance and trim on a wheel. We were served tea after.',
    date: '2026-04-27',
  },
  {
    authorName: 'Alex Simkins',
    rating: 5,
    text: 'Great session! Thank you very much Hirun',
    date: '2026-04-27',
  },
  {
    authorName: 'Gaurav Shetty',
    rating: 5,
    text: 'We actually made something it was fun experience!',
    date: '2026-04-27',
  },
  {
    authorName: 'Soyful Islam',
    rating: 5,
    text: 'Was a very positive experience and a friendly and professional staff team',
    date: '2026-04-27',
  },
];

const toUnixSeconds = (date: string): number => {
  const ms = new Date(date).getTime();
  if (Number.isNaN(ms)) {
    throw new Error(`Invalid date "${date}" — use a format like 2025-03-14`);
  }
  return Math.floor(ms / 1000);
};

async function run() {
  const filled = REVIEWS.filter((r) => r.authorName.trim() && r.text.trim());

  if (!filled.length) {
    console.error('No reviews to insert. Fill in the REVIEWS array with your real reviews first.');
    process.exit(1);
  }

  const placeId = process.env.GOOGLE_PLACE_ID;
  if (!placeId) {
    console.error('GOOGLE_PLACE_ID is not set in your environment.');
    process.exit(1);
  }

  await mongoose.connect(configKeys.DATABASE_URL);
  console.log(`Connected. Upserting ${filled.length} review(s)…`);

  for (const r of filled) {
    const reviewTime = toUnixSeconds(r.date);
    await googleReviewModel.updateOne(
      { authorName: r.authorName, reviewTime },
      {
        $set: {
          placeId,
          authorName: r.authorName,
          rating: r.rating,
          text: r.text,
          profilePhotoUrl: r.profilePhotoUrl || undefined,
          reviewTime,
          source: 'google', // genuine Google reviews, entered manually
          isActive: true,
          isDeleted: false,
        },
      },
      { upsert: true },
    );
    console.log(`  ✓ ${r.authorName} (${r.rating}★)`);
  }

  await mongoose.disconnect();
  console.log('Done.');
}

run().catch(async (err) => {
  console.error('Seed failed:', err);
  await mongoose.disconnect().catch(() => undefined);
  process.exit(1);
});
