import axios from 'axios';

export const fetchGoogleReviewsFromAPI = async () => {
  const placeId = process.env.GOOGLE_PLACE_ID;
  const key = process.env.GOOGLE_PLACES_API_KEY;

  if (!placeId || !key) {
    console.error('Google reviews sync: missing GOOGLE_PLACE_ID or GOOGLE_PLACES_API_KEY');
    return [];
  }

  const response = await axios.get('https://maps.googleapis.com/maps/api/place/details/json', {
    params: {
      place_id: placeId,
      fields: 'reviews',
      key,
    },
  });

  const { status, error_message: errorMessage, result } = response.data || {};

  // The Places API returns HTTP 200 even on failure; the real outcome is in
  // `status`. Without billing enabled it returns REQUEST_DENIED with a message
  // like "You must enable Billing on the Google Cloud Project", and `result`
  // is absent — which previously made the sync silently save nothing.
  if (status !== 'OK') {
    console.error(`Google reviews sync failed: status=${status}`, errorMessage || '');
    return [];
  }

  return result?.reviews || [];
};
