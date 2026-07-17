import { sendEmail } from './mailService';

export const sendWorkshopBookingConfirmationMail = async ({ order, bookingsData, to, cc }: any) => {
  try {
    console.log('WORKSHOP EMAIL FUNCTION STARTED');
    console.log('ORDER:', order?._id);
    console.log('BOOKINGS DATA LENGTH:', bookingsData?.length);

    if (!Array.isArray(bookingsData) || bookingsData.length === 0) {
      console.log('NO BOOKINGS FOUND FOR EMAIL');
      return;
    }

    const firstBooking = bookingsData[0];

    if (!firstBooking?.booking) {
      console.log('INVALID BOOKING DATA');
      return;
    }

    const customer = firstBooking.booking.customer;

    if (!customer?.email) {
      console.log('CUSTOMER EMAIL NOT FOUND');
      return;
    }

    const logoUrl = 'https://api.bediaprive.com/uploads/logo/logo.png';
    const logoIconUrl = 'https://api.bediaprive.com/uploads/logo/bediaprive_logo_icon.svg?v=4';
    const instagramIcon = 'https://api.bediaprive.com/uploads/logo/instagram.svg?v=5';
    const tiktokIcon = 'https://api.bediaprive.com/uploads/logo/tiktok.svg?v=5';
    const youtubeIcon = 'https://api.bediaprive.com/uploads/logo/youtube.svg?v=5';
    const logoIconDarkUrl =
      'https://api.bediaprive.com/uploads/logo/bediaprive-logo-icon-dark.png?v=2';
    const instagramIconDark = 'https://api.bediaprive.com/uploads/logo/instagram-dark.svg?v=2';
    const tiktokIconDark = 'https://api.bediaprive.com/uploads/logo/tiktok-dark.svg?v=2';
    const youtubeIconDark = 'https://api.bediaprive.com/uploads/logo/youtube-dark.svg?v=3';
    const logoDarkUrl = 'https://api.bediaprive.com/uploads/logo/bediaprive-logo-dark.svg?v=6';

    // const logoUrl = `${process.env.BASE_URL}/uploads/logo/logo.png`;
    // const logoIconUrl = `${process.env.BASE_URL}/uploads/logo/bediaprive_logo_icon.svg?v=4`;
    // const instagramIcon = `${process.env.BASE_URL}/uploads/logo/instagram.svg?v=5`;
    // const tiktokIcon = `${process.env.BASE_URL}/uploads/logo/tiktok.svg?v=5`;
    // const youtubeIcon = `${process.env.BASE_URL}/uploads/logo/youtube.svg?v=5`;
    // const logoIconDarkUrl = `${process.env.BASE_URL}/uploads/logo/bediaprive-logo-icon-dark.png?v=2`;
    // const instagramIconDark = `${process.env.BASE_URL}/uploads/logo/instagram-dark.svg?v=2`;
    // const tiktokIconDark = `${process.env.BASE_URL}/uploads/logo/tiktok-dark.svg?v=2`;
    // const youtubeIconDark = `${process.env.BASE_URL}/uploads/logo/youtube-dark.svg?v=3`;
    // const logoDarkUrl = `${process.env.BASE_URL}/uploads/logo/bediaprive-logo-dark.svg?v=6`;

    const workshopSections = bookingsData
      .map(({ booking, workshop, slot }: any) => {
        const itemRows =
          booking.items
            ?.map(
              (item: any) => `
              <tr>
                <td width="45%" class="row-label text-strong" style="padding:3px 15px 3px 0;color:#000000;font-size:14px;vertical-align:top;">${item.optionTitle}</td>
                <td align="left" class="row-value text-strong" style="word-break:break-word;padding:3px 0;color:#000000;font-weight:500;font-size:14px;vertical-align:top;">${item.people} ${item.people === 1 ? 'Guest' : 'Guests'}</td>
              </tr>`,
            )
            .join('') || '';

        // Gift vouchers have no date/slot until the recipient redeems them.
        const isScheduled = !!booking.bookingDate;

        const eventDay = isScheduled
          ? new Date(booking.bookingDate).toLocaleDateString('en-US', { weekday: 'long' })
          : '';
        const eventDate = isScheduled
          ? new Date(booking.bookingDate).toLocaleDateString('en-US', {
            month: 'long',
            day: '2-digit',
            year: 'numeric',
          })
          : '';
        const eventTime = `${slot?.startTime || '-'} - ${slot?.endTime || '-'}`;

        const scheduleRows = isScheduled
          ? `
                <tr>
                  <td width="45%" class="row-label text-strong" style="padding:3px 15px 3px 0;color:#000000;vertical-align:top;">Day</td>
                  <td align="left" class="row-value text-strong" style="word-break:break-word;padding:3px 0;color:#000000;font-weight:500;vertical-align:top;">${eventDay}</td>
                </tr>
                <tr>
                  <td width="45%" class="row-label text-strong" style="padding:3px 15px 3px 0;color:#000000;vertical-align:top;">Date</td>
                  <td align="left" class="row-value text-strong" style="word-break:break-word;padding:3px 0;color:#000000;font-weight:500;vertical-align:top;">${eventDate}</td>
                </tr>
                <tr>
                  <td width="45%" class="row-label text-strong" style="padding:3px 15px 3px 0;color:#000000;vertical-align:top;">Time</td>
                  <td align="left" class="row-value text-strong" style="word-break:break-word;padding:3px 0;color:#000000;font-weight:500;vertical-align:top;">${eventTime}</td>
                </tr>`
          : `
                <tr>
                  <td width="45%" class="row-label text-strong" style="padding:3px 15px 3px 0;color:#000000;vertical-align:top;">Type</td>
                  <td align="left" class="row-value text-strong" style="word-break:break-word;padding:3px 0;color:#000000;font-weight:500;vertical-align:top;">Gift Voucher</td>
                </tr>
                <tr>
                  <td width="45%" class="row-label text-strong" style="padding:3px 15px 3px 0;color:#000000;vertical-align:top;">Schedule</td>
                  <td align="left" class="row-value text-strong" style="word-break:break-word;padding:3px 0;color:#000000;font-weight:500;vertical-align:top;">To be scheduled by recipient</td>
                </tr>`;

        return `
          <!-- Divider -->
          <tr>
            <td style="padding:6px 0 0 0;">
              <div class="hr" style="border-top:1px solid #e5e7eb;font-size:1px;line-height:1px;height:1px;">&nbsp;</div>
            </td>
          </tr>
          <!-- Workshop block -->
          <tr>
            <td class="px" style="padding:10px 30px 8px 30px;">
              <p class="text-strong" style="margin:0 0 8px 0;font-size:13px;font-weight:600;color:#000000;text-transform:uppercase;letter-spacing:0.5px;">${workshop?.title || 'Workshop'}</p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="font-size:14px;line-height:1.4;">
                ${scheduleRows}
                <tr>
                  <td width="45%" class="row-label text-strong" style="padding:3px 15px 3px 0;color:#000000;vertical-align:top;">Guests</td>
                  <td align="left" class="row-value text-strong" style="word-break:break-word;padding:3px 0;color:#000000;font-weight:500;vertical-align:top;">${booking.totalPeople}</td>
                </tr>
              </table>
              <!-- Package rows -->
              <p class="text-strong" style="margin:10px 0 4px 0;font-size:13px;font-weight:600;color:#000000;text-transform:uppercase;letter-spacing:0.5px;">Packages</p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="font-size:14px;line-height:1.4;">
                ${itemRows}
              </table>
            </td>
          </tr>`;
      })
      .join('');

    const html = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <meta name="format-detection" content="telephone=no, date=no, address=no, email=no">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <title>Booking Confirmed</title>
  <!--[if mso]>
  <noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript>
  <![endif]-->
  <style>
    html, body { margin: 0 !important; padding: 0 !important; width: 100% !important; background-color: #ffffff; }
    * { -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-collapse: collapse; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; line-height: 100%; }
    a { text-decoration: none; }
    .dark-img { display: none; }

    @media only screen and (max-width: 600px) {
      .main-card { width: 100% !important; max-width: 100% !important; }
      .px { padding-left: 16px !important; padding-right: 16px !important; }
      .title { font-size: 20px !important; }
      .row-label, .row-value { font-size: 13px !important; }
      .logo-icon { height: 38px !important; }
    }

    @media (prefers-color-scheme: dark) {
      body, .email-bg { background-color: #0b0f0d !important; }
      .main-card { background-color: #11201c !important; }
      .text-strong { color: #f4f5f3 !important; }
      .text-muted { color: #a8b3ad !important; }
      .hr { border-top-color: #2c3a35 !important; }
      .footer-badge { background-color: transparent !important; border: 0 !important; }
      .light-img { display: none !important; }
      .dark-img { display: block !important; max-height: none !important; overflow: visible !important; line-height: inherit !important; font-size: inherit !important; }
      .dark-img img { filter: none !important; -webkit-filter: none !important; forced-color-adjust: none !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">

  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:#fbfaf5;">
    Your workshop booking at Bedia Pottery is confirmed. We look forward to seeing you!
  </div>

  <table role="presentation" class="email-bg" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff;margin:0;padding:0;">
    <tr>
      <td align="center" style="padding:0;">
        <!--[if mso]><table role="presentation" align="center" width="540" cellpadding="0" cellspacing="0" border="0"><tr><td><![endif]-->

        <table role="presentation" width="100%" class="main-card" style="max-width:540px;width:100%;background-color:#fbfaf5;margin:0 auto;padding:0;" cellpadding="0" cellspacing="0" border="0">

          <!-- Logo -->
          <tr>
            <td align="left" class="px" style="padding:15px 30px 10px 30px;">
              <img src="${logoIconUrl}" alt="Bedia Pottery" class="logo-icon light-img" style="height:45px;width:auto;display:block;border:0;outline:none;" />
              <!--[if !mso]><!-->
              <div class="dark-img" style="display:none;mso-hide:all;overflow:hidden;max-height:0;font-size:0;line-height:0;">
                <img src="${logoIconDarkUrl}" alt="Bedia Pottery" class="logo-icon" style="height:45px;width:auto;display:block;border:0;outline:none;filter:none;-webkit-filter:none;" />
              </div>
              <!--<![endif]-->
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 0 10px 0;">
              <div class="hr" style="border-top:1px solid #e5e7eb;font-size:1px;line-height:1px;height:1px;">&nbsp;</div>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td class="px text-strong" style="padding:0 30px 10px 30px;font-size:15px;color:#000000;font-weight:400;">
              Dear ${customer.firstName || 'Customer'},
            </td>
          </tr>

          <!-- Headline -->
          <tr>
            <td class="px" style="padding:0 30px 12px 30px;">
              <h1 class="title text-strong" style="color:#000000;margin:0;font-size:22px;font-weight:600;letter-spacing:-0.4px;line-height:1.2;">
                Your booking is confirmed!
              </h1>
            </td>
          </tr>

          <!-- Confirmation number -->
          <tr>
            <td class="px" style="padding:0 30px 14px 30px;">
              <p class="text-strong" style="margin:0;font-size:14px;color:#000000;">
                Confirmation: <span class="text-strong" style="color:#000000;font-weight:700;">${order.orderNumber}</span>
              </p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 0 6px 0;">
              <div class="hr" style="border-top:1px solid #e5e7eb;font-size:1px;line-height:1px;height:1px;">&nbsp;</div>
            </td>
          </tr>

          <!-- Guest details -->
          <tr>
            <td class="px" style="padding:4px 30px 8px 30px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="font-size:14px;line-height:1.4;">
                <tr>
                  <td width="45%" class="row-label text-strong" style="padding:3px 15px 3px 0;color:#000000;vertical-align:top;">Name</td>
                  <td align="left" class="row-value text-strong" style="word-break:break-word;padding:3px 0;color:#000000;font-weight:500;vertical-align:top;">${customer.firstName} ${customer.lastName}</td>
                </tr>
                <tr>
                  <td width="45%" class="row-label text-strong" style="padding:3px 15px 3px 0;color:#000000;vertical-align:top;">Phone</td>
                  <td align="left" class="row-value text-strong" style="word-break:break-word;padding:3px 0;color:#000000;font-weight:500;vertical-align:top;">${customer.phone}</td>
                </tr>
                <tr>
                  <td width="45%" class="row-label text-strong" style="padding:3px 15px 3px 0;color:#000000;vertical-align:top;">Email</td>
                  <td align="left" class="row-value text-strong" style="word-break:break-all;padding:3px 0;color:#000000;font-weight:500;vertical-align:top;">${customer.email}</td>
                </tr>
                <tr>
                  <td width="45%" class="row-label text-strong" style="padding:3px 15px 3px 0;color:#000000;vertical-align:top;">Amount Paid</td>
                  <td align="left" class="row-value text-strong" style="word-break:break-word;padding:3px 0;color:#000000;font-weight:700;vertical-align:top;">${order.grandTotal} AED</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Dynamic workshop sections -->
          ${workshopSections}

          <!-- Divider -->
          <tr>
            <td style="padding:6px 0 0 0;">
              <div class="hr" style="border-top:1px solid #e5e7eb;font-size:1px;line-height:1px;height:1px;">&nbsp;</div>
            </td>
          </tr>

          <!-- Location -->
          <tr>
            <td class="px" style="padding:8px 30px 8px 30px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="font-size:14px;line-height:1.4;">
                <tr>
                  <td width="45%" class="row-label text-strong" style="padding:3px 15px 3px 0;color:#000000;vertical-align:top;">Location</td>
                  <td align="left" class="row-value text-strong" style="word-break:break-word;padding:3px 0;color:#000000;font-weight:500;vertical-align:top;">
                    Bedia Pottery LLC,<br/>Warehouse 10,<br/>
                    Al Khayat Avenue, 19th Street,<br/>Al Quoz 1, Dubai, UAE
                  </td>
                </tr>
                <tr>
                  <td width="45%" class="row-label text-strong" style="padding:8px 15px 3px 0;color:#000000;vertical-align:top;">Parking</td>
                  <td align="left" class="row-value text-strong" style="word-break:break-word;padding:8px 0 3px 0;color:#000000;font-weight:500;vertical-align:top;">Valet parking</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Maps CTA -->
          <tr>
            <td class="px" style="padding:8px 30px 16px 30px;">            
              <a href="https://www.google.com/maps/place/Bedia+Pottery+%7C+Adults+%26+Kids+Birthday+Party+Packages+%2B+Fun+Beginners+Workshop/@25.1393368,55.2263525,17z/data=!4m6!3m5!1s0x3e5f69be5e716b71:0x79d624863c4c5812!8m2!3d25.1396865!4d55.2286163!16s%2Fg%2F11vdldm6g6?entry=ttu&g_ep=EgoyMDI2MDYyOC4wIKXMDSoASAFQAw%3D%3D"
                style="display:inline-block;background:#111827;color:#ffffff;text-decoration:none;padding:12px 22px;border-radius:8px;font-size:13px;font-weight:600;letter-spacing:0.3px;">
                Open in Google Maps
              </a>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 0 6px 0;">
              <div class="hr" style="border-top:1px solid #e5e7eb;font-size:1px;line-height:1px;height:1px;">&nbsp;</div>
            </td>
          </tr>

          <!-- Footer: logo + social -->
          <tr>
            <td class="px" style="padding:4px 30px 14px 30px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="left" style="vertical-align:middle;">
                    <table role="presentation" class="footer-badge" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;border:0;">
                      <tr>
                        <td style="padding:0;">
                          <img src="${logoUrl}" alt="Bedia Pottery" class="light-img" style="height:20px;width:auto;display:block;border:0;" />
                          <!--[if !mso]><!-->
                          <div class="dark-img" style="display:none;mso-hide:all;overflow:hidden;max-height:0;font-size:0;line-height:0;">
                            <img src="${logoDarkUrl}" alt="Bedia Pottery" style="height:20px;width:auto;display:block;border:0;filter:none;-webkit-filter:none;" />
                          </div>
                          <!--<![endif]-->
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td align="right" style="vertical-align:middle;white-space:nowrap;font-size:0;">
                    <a href="https://www.instagram.com/bediapottery/" style="display:inline-block;margin-left:12px;text-decoration:none;vertical-align:middle;">
                      <img src="${instagramIcon}" alt="Instagram" width="20" height="20" class="light-img" style="display:block;width:20px;height:20px;border:0;border-radius:100%;" />
                      <!--[if !mso]><!-->
                      <div class="dark-img" style="display:none;mso-hide:all;overflow:hidden;max-height:0;font-size:0;line-height:0;">
                        <img src="${instagramIconDark}" alt="Instagram" width="20" height="20" style="display:block;width:20px;height:20px;border:0;" />
                      </div>
                      <!--<![endif]-->
                    </a>
                    <a href="https://www.tiktok.com/@bediapottery" style="display:inline-block;margin-left:12px;text-decoration:none;vertical-align:middle;">
                      <img src="${tiktokIcon}" alt="TikTok" width="20" height="20" class="light-img" style="display:block;width:20px;height:20px;border:0;border-radius:100%;" />
                      <!--[if !mso]><!-->
                      <div class="dark-img" style="display:none;mso-hide:all;overflow:hidden;max-height:0;font-size:0;line-height:0;">
                        <img src="${tiktokIconDark}" alt="TikTok" width="20" height="20" style="display:block;width:20px;height:20px;border:0;" />
                      </div>
                      <!--<![endif]-->
                    </a>
                    <a href="https://www.youtube.com/@bediapottery" style="display:inline-block;margin-left:12px;text-decoration:none;vertical-align:middle;">
                      <img src="${youtubeIcon}" alt="YouTube" width="20" height="20" class="light-img" style="display:block;width:20px;height:20px;border:0;border-radius:100%;" />
                      <!--[if !mso]><!-->
                      <div class="dark-img" style="display:none;mso-hide:all;overflow:hidden;max-height:0;font-size:0;line-height:0;">
                        <img src="${youtubeIconDark}" alt="YouTube" width="20" height="20" style="display:block;width:20px;height:20px;border:0;" />
                      </div>
                      <!--<![endif]-->
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Bottom bar -->
          <tr>
            <td style="background-color:#0d463d;height:30px;font-size:1px;line-height:1px;">&nbsp;</td>
          </tr>

        </table>
        <!--[if mso]></td></tr></table><![endif]-->
      </td>
    </tr>
  </table>
</body>
</html>`;

    await sendEmail(
      to || customer.email,
      `Workshop Booking Confirmation - ${order.orderNumber}`,
      'Workshop Booking Confirmed',
      html,
      undefined,
      cc || [process.env.CC_EMAIL!],
    );
  } catch (error: any) {
    console.error('WORKSHOP EMAIL SEND FAILED:', error?.message);
    console.error(error);
  }
};

export const sendPriveBookingConfirmationMail = async ({ order, bookingsData }: any) => {
  try {
    console.log('EMAIL FUNCTION STARTED');
    console.log('ORDER:', order?._id);
    console.log('BOOKINGS DATA LENGTH:', bookingsData?.length);
    console.log('CC EMAIL:', process.env.CC_EMAIL);

    if (!Array.isArray(bookingsData) || bookingsData.length === 0) {
      console.log('NO BOOKINGS FOUND FOR EMAIL');
      return;
    }

    const firstBooking = bookingsData[0];

    if (!firstBooking?.booking) {
      console.log('INVALID BOOKING DATA');
      return;
    }

    const customer = firstBooking.booking.customer;

    if (!customer?.email) {
      console.log('CUSTOMER EMAIL NOT FOUND');
      return;
    }

    const logoUrl = `${process.env.BASE_URL}/uploads/logo/bediaprive_logo.svg?v=4`;
    const logoIconUrl = `${process.env.BASE_URL}/uploads/logo/bediaprive_logo_icon.svg?v=4`;
    const instagramIcon = `${process.env.BASE_URL}/uploads/logo/instagram.svg?v=5`;
    const tiktokIcon = `${process.env.BASE_URL}/uploads/logo/tiktok.svg?v=5`;
    const youtubeIcon = `${process.env.BASE_URL}/uploads/logo/youtube.svg?v=5`;
    const heroImageUrl = `${process.env.BASE_URL}/uploads/logo/prive-email-image.png?v=4`;
    const heroImageDarkUrl = `${process.env.BASE_URL}/uploads/logo/prive-email-image-dark.png?v=2`;
    const logoDarkUrl = `${process.env.BASE_URL}/uploads/logo/bediaprive-logo-dark.svg?v=6`;
    const logoIconDarkUrl = `${process.env.BASE_URL}/uploads/logo/bediaprive-logo-icon-dark.png?v=2`;
    const instagramIconDark = `${process.env.BASE_URL}/uploads/logo/instagram-dark.svg?v=2`;
    const tiktokIconDark = `${process.env.BASE_URL}/uploads/logo/tiktok-dark.svg?v=2`;
    const youtubeIconDark = `${process.env.BASE_URL}/uploads/logo/youtube-dark.svg?v=3`;

    const packagesList = bookingsData
      .map(({ booking }: any) => {
        return booking.items?.map((item: any) => item.optionTitle).join(', ');
      })
      .filter(Boolean)
      .join(' | ');

    const eventDay = new Date(firstBooking.booking.bookingDate).toLocaleDateString('en-US', {
      weekday: 'long',
    });
    const eventDate = new Date(firstBooking.booking.bookingDate).toLocaleDateString('en-US', {
      month: 'long',
      day: '2-digit',
      year: 'numeric',
    });
    const eventTime = `${firstBooking.slot?.startTime || '-'} - ${firstBooking.slot?.endTime || '-'}`;

    const html = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <meta name="format-detection" content="telephone=no, date=no, address=no, email=no">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <title>Reservation Confirmed</title>

  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->

  <style>
    /* ---------- Client resets ---------- */
    html, body {
      margin: 0 !important;
      padding: 0 !important;
      width: 100% !important;
      background-color: #ffffff;
    }
    * { -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; }
    table, td {
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
      border-collapse: collapse;
    }
    img {
      -ms-interpolation-mode: bicubic;
      border: 0;
      outline: none;
      text-decoration: none;
      line-height: 100%;
    }
    a { text-decoration: none; }

    /* Dark-mode logo swap: hidden by default, revealed in dark mode */
    .dark-img { display: none; }

    /* ---------- Responsive: phones ---------- */
    @media only screen and (max-width: 600px) {
      .main-card {
        width: 100% !important;
        max-width: 100% !important;
      }
      .px {
        padding-left: 20px !important;
        padding-right: 20px !important;
      }
      .hero-img {
        width: 100% !important;
        height: auto !important;
      }
      .title {
        font-size: 20px !important;
      }
      .row-label,
      .row-value {
        font-size: 13px !important;
      }
      .logo-icon {
        height: 40px !important;
      }
    }

    /* ---------- Dark mode ---------- */
    @media (prefers-color-scheme: dark) {
      body, .email-bg {
        background-color: #0b0f0d !important;
      }
      .main-card {
        background-color: #11201c !important;
      }
      .text-strong {
        color: #f4f5f3 !important;
      }
      .text-muted {
        color: #a8b3ad !important;
      }
      .hr {
        border-top-color: #2c3a35 !important;
      }
      .footer-badge {
        background-color: transparent !important;
        border: 0 !important;
      }
      /* swap logos */
      .light-img { display: none !important; }
      .dark-img {
        display: block !important;
        max-height: none !important;
        overflow: visible !important;
        line-height: inherit !important;
        font-size: inherit !important;
      }
      /* Prevent mobile clients (Gmail Android, Apple Mail) from inverting SVG colours */
      .dark-img img {
        filter: none !important;
        -webkit-filter: none !important;
        forced-color-adjust: none !important;
      }
    }
  </style>
</head>

<body style="margin:0;padding:0;background-color:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">

  <!-- Hidden preview text -->
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:#fbfaf5;">
    Your reservation at Bedia Priv&eacute; is confirmed. We look forward to seeing you!
  </div>

  <!-- Outer wrapper -->
  <table role="presentation" class="email-bg" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff;margin:0;padding:0;">
    <tr>
      <td align="center" style="padding:0;">

        <!--[if mso]>
        <table role="presentation" align="center" width="540" cellpadding="0" cellspacing="0" border="0"><tr><td>
        <![endif]-->

        <!-- Main card -->
        <table role="presentation" width="100%" class="main-card" style="max-width:540px;width:100%;background-color:#fbfaf5;margin:0 auto;padding:0;" cellpadding="0" cellspacing="0" border="0">

          <!-- Logo (swaps black -> white in dark mode) -->
          <tr>
            <td align="left" class="px" style="padding:15px 30px 10px 30px;">
              <img src="${logoIconUrl}" alt="Bedia Priv&eacute;" class="logo-icon light-img" style="height:45px;width:auto;display:block;border:0;outline:none;" />
              <!--[if !mso]><!-->
              <div class="dark-img" style="display:none;mso-hide:all;overflow:hidden;max-height:0;font-size:0;line-height:0;">
                <img src="${logoIconDarkUrl}" alt="Bedia Priv&eacute;" class="logo-icon" style="height:45px;width:auto;display:block;border:0;outline:none;filter:none;-webkit-filter:none;" />
              </div>
              <!--<![endif]-->
            </td>
          </tr>

          <!-- Divider (full width) -->
          <tr>
            <td style="padding:0 0 10px 0;">
              <div class="hr" style="border-top:1px solid #e5e7eb;font-size:1px;line-height:1px;height:1px;">&nbsp;</div>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td class="px text-strong" style="padding:0 30px 4px 30px;font-size:15px;color:#111827;font-weight:400;">
              Dear ${customer.firstName || 'Customer'},
            </td>
          </tr>

          <!-- Headline -->
          <tr>
            <td class="px" style="padding:0 30px 12px 30px;">
              <h1 class="title text-strong" style="color:#111827;margin:0;font-size:22px;font-weight:600;letter-spacing:-0.4px;line-height:1.2;">
                Your reservation is confirmed!
              </h1>
            </td>
          </tr>

          <!-- Hero image -->
          <tr>
            <td style="padding:0 0 12px 0;">
              <img src="${heroImageUrl}" alt="Reservation Summary" width="540" class="hero-img light-img" style="width:100%;max-width:540px;height:auto;display:block;object-fit:cover;border:0;" />
              <!--[if !mso]><!-->
              <div class="dark-img" style="display:none;mso-hide:all;overflow:hidden;max-height:0;font-size:0;line-height:0;">
                <img src="${heroImageDarkUrl}" alt="Reservation Summary" width="540" class="hero-img" style="width:100%;max-width:540px;height:auto;display:block;object-fit:cover;border:0;" />
              </div>
              <!--<![endif]-->
            </td>
          </tr>

          <!-- Event details -->
          <tr>
            <td class="px" style="padding:4px 30px 8px 30px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="font-size:14px;line-height:1.4;">
                <tr>
                  <td width="40%" class="row-label text-muted" style="padding:3px 0;color:#4b5563;vertical-align:top;">Day</td>
                  <td align="left" class="row-value text-strong" style="word-break:break-word;padding:3px 0;color:#111827;font-weight:500;vertical-align:top;">${eventDay}</td>
                </tr>
                <tr>
                  <td width="40%" class="row-label text-muted" style="padding:3px 0;color:#4b5563;vertical-align:top;">Date</td>
                  <td align="left" class="row-value text-strong" style="word-break:break-word;padding:3px 0;color:#111827;font-weight:500;vertical-align:top;">${eventDate}</td>
                </tr>
                <tr>
                  <td width="40%" class="row-label text-muted" style="padding:3px 0;color:#4b5563;vertical-align:top;">Time</td>
                  <td align="left" class="row-value text-strong" style="word-break:break-word;padding:3px 0;color:#111827;font-weight:500;vertical-align:top;">${eventTime}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Divider (full width) -->
          <tr>
            <td style="padding:0 0 6px 0;">
              <div class="hr" style="border-top:1px solid #e5e7eb;font-size:1px;line-height:1px;height:1px;">&nbsp;</div>
            </td>
          </tr>

          <!-- Guest details -->
          <tr>
            <td class="px" style="padding:4px 30px 8px 30px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="font-size:14px;line-height:1.4;">
                <tr>
                  <td width="40%" class="row-label text-muted" style="padding:3px 0;color:#4b5563;vertical-align:top;">Name</td>
                  <td align="left" class="row-value text-strong" style="word-break:break-word;padding:3px 0;color:#111827;font-weight:500;vertical-align:top;">${customer.firstName} ${customer.lastName}</td>
                </tr>
                <tr>
                  <td width="40%" class="row-label text-muted" style="padding:3px 0;color:#4b5563;vertical-align:top;">Phone No.</td>
                  <td align="left" class="row-value text-strong" style="word-break:break-word;padding:3px 0;color:#111827;font-weight:500;vertical-align:top;">${customer.phone}</td>
                </tr>
                <tr>
                  <td width="40%" class="row-label text-muted" style="padding:3px 0;color:#4b5563;vertical-align:top;">Email ID</td>
                  <td align="left" class="row-value text-strong" style="word-break:break-all;padding:3px 0;color:#111827;font-weight:500;vertical-align:top;">${customer.email}</td>
                </tr>
                <tr>
                  <td width="40%" class="row-label text-muted" style="padding:3px 0;color:#4b5563;vertical-align:top;">No. of Guests</td>
                  <td align="left" class="row-value text-strong" style="word-break:break-word;padding:3px 0;color:#111827;font-weight:500;vertical-align:top;">${firstBooking.booking.totalPeople}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Divider (full width) -->
          <tr>
            <td style="padding:0 0 6px 0;">
              <div class="hr" style="border-top:1px solid #e5e7eb;font-size:1px;line-height:1px;height:1px;">&nbsp;</div>
            </td>
          </tr>

          <!-- Order details -->
          <tr>
            <td class="px" style="padding:4px 30px 8px 30px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="font-size:14px;line-height:1.4;">
                <tr>
                  <td width="40%" class="row-label text-muted" style="padding:3px 0;color:#4b5563;vertical-align:top;">Amount</td>
                  <td align="left" class="row-value text-strong" style="word-break:break-word;padding:3px 0;color:#111827;font-weight:500;vertical-align:top;">${order.grandTotal} AED</td>
                </tr>
                <tr>
                  <td width="40%" class="row-label text-muted" style="padding:3px 0;color:#4b5563;vertical-align:top;">Package</td>
                  <td align="left" class="row-value text-strong" style="word-break:break-word;padding:3px 0;color:#111827;font-weight:500;vertical-align:top;">${packagesList || 'Signature'}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Divider (full width) -->
          <tr>
            <td style="padding:0 0 6px 0;">
              <div class="hr" style="border-top:1px solid #e5e7eb;font-size:1px;line-height:1px;height:1px;">&nbsp;</div>
            </td>
          </tr>

          <!-- Location & parking -->
          <tr>
            <td class="px" style="padding:4px 30px 8px 30px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="font-size:14px;line-height:1.4;">
                <tr>
                  <td width="40%" class="row-label text-muted" style="padding:3px 0;color:#4b5563;vertical-align:top;">Location Details:</td>
                  <td align="left" class="row-value text-strong" style="word-break:break-word;padding:3px 0;color:#111827;text-align:left;font-weight:500;vertical-align:top;">
                    Bedia Priv&eacute;,<br/> 1st Floor, Warehouse 10,<br/>
                    Al Khayat Avenue, <br/> 19&#8203;th Street, Al Quoz,<br/>
                    Dubai - U.A.E
                  </td>
                </tr>
                <tr>
                  <td width="40%" class="row-label text-muted" style="padding:8px 0 3px 0;color:#4b5563;vertical-align:top;">Parking:</td>
                  <td align="left" class="row-value text-strong" style="word-break:break-word;padding:8px 0 3px 0;color:#111827;font-weight:500;vertical-align:top;">
                    Valet parking
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Divider (full width) -->
          <tr>
            <td style="padding:6px 0 10px 0;">
              <div class="hr" style="border-top:1px solid #e5e7eb;font-size:1px;line-height:1px;height:1px;">&nbsp;</div>
            </td>
          </tr>

          <!-- Footer: logo + social -->
          <tr>
            <td class="px" style="padding:4px 30px 14px 30px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="left" style="vertical-align:middle;">
                    <table role="presentation" class="footer-badge" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;border:0;">
                      <tr>
                        <td style="padding:0;">
                          <img src="${logoUrl}" alt="Bedia Priv&eacute;" class="light-img" style="height:20px;width:auto;display:block;border:0;" />
                          <!--[if !mso]><!-->
                          <div class="dark-img" style="display:none;mso-hide:all;overflow:hidden;max-height:0;font-size:0;line-height:0;">
                            <img src="${logoDarkUrl}" alt="Bedia Priv&eacute;" style="height:20px;width:auto;display:block;border:0;filter:none;-webkit-filter:none;" />
                          </div>
                          <!--<![endif]-->
                        </td>
                      </tr>
                    </table>
                  </td>

                  <td align="right" style="vertical-align:middle;white-space:nowrap;font-size:0;">
                    <a href="https://www.instagram.com/bediapottery/" style="display:inline-block;margin-left:12px;text-decoration:none;vertical-align:middle;">
                      <img src="${instagramIcon}" alt="Instagram" width="20" height="20" class="light-img" style="display:block;width:20px;height:20px;border:0;border-radius:100%;" />
                      <!--[if !mso]><!-->
                      <div class="dark-img" style="display:none;mso-hide:all;overflow:hidden;max-height:0;font-size:0;line-height:0;">
                        <img src="${instagramIconDark}" alt="Instagram" width="20" height="20" style="display:block;width:20px;height:20px;border:0;border-radius:100%;" />
                      </div>
                      <!--<![endif]-->
                    </a>
                    <a href="https://www.tiktok.com/@bediapottery" style="display:inline-block;margin-left:12px;text-decoration:none;vertical-align:middle;">
                      <img src="${tiktokIcon}" alt="TikTok" width="20" height="20" class="light-img" style="display:block;width:20px;height:20px;border:0;border-radius:100%;" />
                      <!--[if !mso]><!-->
                      <div class="dark-img" style="display:none;mso-hide:all;overflow:hidden;max-height:0;font-size:0;line-height:0;">
                        <img src="${tiktokIconDark}" alt="TikTok" width="20" height="20" style="display:block;width:20px;height:20px;border:0;" />
                      </div>
                      <!--<![endif]-->
                    </a>
                    <a href="https://www.youtube.com/@bediapottery" style="display:inline-block;margin-left:12px;text-decoration:none;vertical-align:middle;">
                      <img src="${youtubeIcon}" alt="YouTube" width="20" height="20" class="light-img" style="display:block;width:20px;height:20px;border:0;border-radius:100%;" />
                      <!--[if !mso]><!-->
                      <div class="dark-img" style="display:none;mso-hide:all;overflow:hidden;max-height:0;font-size:0;line-height:0;">
                        <img src="${youtubeIconDark}" alt="YouTube" width="20" height="20" style="display:block;width:20px;height:20px;border:0;" />
                      </div>
                      <!--<![endif]-->
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Bottom bar -->
          <tr>
            <td style="background-color:#0d463d;height:30px;font-size:1px;line-height:1px;">&nbsp;</td>
          </tr>

        </table>
        <!-- /Main card -->

        <!--[if mso]>
        </td></tr></table>
        <![endif]-->

      </td>
    </tr>
  </table>
</body>
</html>
`;

    await sendEmail(
      customer.email,
      `Workshop Booking Confirmation - ${order.orderNumber}`,
      'Workshop Booking Confirmed',
      html,
      undefined,
      [process.env.CC_EMAIL!],
    );
  } catch (error: any) {
    console.error('EMAIL SEND FAILED');
    console.error(error);
  }
};

export const sendGiftVoucherMail = async ({ booking, voucherPath }: any) => {
  try {
    // The gift card email goes to the purchaser only; the recipient gets the
    // voucher when the purchaser hands over the attached PDF.
    const recipientEmail = booking.customer?.email;
    if (!recipientEmail) {
      console.log('PURCHASER EMAIL NOT FOUND, SKIPPING');
      return;
    }

    const logoUrl = 'https://api.bediaprive.com/uploads/logo/logo.png';
    const logoIconUrl = 'https://api.bediaprive.com/uploads/logo/BP_ICON.png?v=4';
    const instagramIcon = 'https://api.bediaprive.com/uploads/logo/instagram.svg?v=5';
    const tiktokIcon = 'https://api.bediaprive.com/uploads/logo/tiktok.svg?v=5';
    const youtubeIcon = 'https://api.bediaprive.com/uploads/logo/youtube.svg?v=5';
    const logoIconDarkUrl =
      'https://api.bediaprive.com/uploads/logo/bediaprive-logo-icon-dark.png?v=2';
    const instagramIconDark = 'https://api.bediaprive.com/uploads/logo/instagram-dark.svg?v=2';
    const tiktokIconDark = 'https://api.bediaprive.com/uploads/logo/tiktok-dark.svg?v=2';
    const youtubeIconDark = 'https://api.bediaprive.com/uploads/logo/youtube-dark.svg?v=3';
    const logoDarkUrl = 'https://api.bediaprive.com/uploads/logo/bediaprive-logo-dark.svg?v=6';

    // const logoIconUrl = `${process.env.BASE_URL}/uploads/logo/bediaprive_logo_icon.svg?v=4`;
    // const logoIconDarkUrl = `${process.env.BASE_URL}/uploads/logo/bediaprive-logo-icon-dark.png?v=2`;
    // const logoUrl = `${process.env.BASE_URL}/uploads/logo/bediaprive_logo.svg?v=4`;
    // const logoDarkUrl = `${process.env.BASE_URL}/uploads/logo/bediaprive-logo-dark.svg?v=6`;
    // const instagramIcon = `${process.env.BASE_URL}/uploads/logo/instagram.svg?v=5`;
    // const tiktokIcon = `${process.env.BASE_URL}/uploads/logo/tiktok.svg?v=5`;
    // const youtubeIcon = `${process.env.BASE_URL}/uploads/logo/youtube.svg?v=5`;
    // const instagramIconDark = `${process.env.BASE_URL}/uploads/logo/instagram-dark.svg?v=2`;
    // const tiktokIconDark = `${process.env.BASE_URL}/uploads/logo/tiktok-dark.svg?v=2`;
    // const youtubeIconDark = `${process.env.BASE_URL}/uploads/logo/youtube-dark.svg?v=3`;

    const html = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <meta name="format-detection" content="telephone=no, date=no, address=no, email=no">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <title>Gift Voucher</title>
  <!--[if mso]>
  <noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript>
  <![endif]-->
  <style>
    html, body { margin: 0 !important; padding: 0 !important; width: 100% !important; background-color: #ffffff; }
    * { -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-collapse: collapse; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; line-height: 100%; }
    a { text-decoration: none; }
    .dark-img { display: none; }

    @media only screen and (max-width: 600px) {
      .main-card { width: 100% !important; max-width: 100% !important; }
      .px { padding-left: 16px !important; padding-right: 16px !important; }
      .title { font-size: 20px !important; }
      .row-label, .row-value { font-size: 13px !important; }
      .logo-icon { height: 38px !important; }
      .voucher-code { font-size: 18px !important; letter-spacing: 2px !important; }
    }

    @media (prefers-color-scheme: dark) {
      body, .email-bg { background-color: #0b0f0d !important; }
      .main-card { background-color: #11201c !important; }
      .text-strong { color: #f4f5f3 !important; }
      .text-muted { color: #a8b3ad !important; }
      .hr { border-top-color: #2c3a35 !important; }
      .voucher-box { background-color: #1a2e26 !important; border-color: #2c3a35 !important; }
      .voucher-code { color: #f59e0b !important; }
      .footer-badge { background-color: transparent !important; border: 0 !important; }
      .light-img { display: none !important; }
      .dark-img { display: block !important; max-height: none !important; overflow: visible !important; line-height: inherit !important; font-size: inherit !important; }
      .dark-img img { filter: none !important; -webkit-filter: none !important; forced-color-adjust: none !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">

  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:#fbfaf5;">
    Thank you for purchasing a gift card from Bedia Pottery!
  </div>

  <table role="presentation" class="email-bg" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff;margin:0;padding:0;">
    <tr>
      <td align="center" style="padding:0;">
        <!--[if mso]><table role="presentation" align="center" width="540" cellpadding="0" cellspacing="0" border="0"><tr><td><![endif]-->

        <table role="presentation" width="100%" class="main-card" style="max-width:540px;width:100%;background-color:#fbfaf5;margin:0 auto;padding:0;" cellpadding="0" cellspacing="0" border="0">

          <!-- Logo -->
          <tr>
            <td align="left" class="px" style="padding:15px 30px 10px 30px;">
              <img src="${logoIconUrl}" alt="Bedia Pottery" class="logo-icon light-img" style="height:45px;width:auto;display:block;border:0;outline:none;" />
              <!--[if !mso]><!-->
              <div class="dark-img" style="display:none;mso-hide:all;overflow:hidden;max-height:0;font-size:0;line-height:0;">
                <img src="${logoIconDarkUrl}" alt="Bedia Pottery" class="logo-icon" style="height:45px;width:auto;display:block;border:0;outline:none;filter:none;-webkit-filter:none;" />
              </div>
              <!--<![endif]-->
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 0 10px 0;">
              <div class="hr" style="border-top:1px solid #e5e7eb;font-size:1px;line-height:1px;height:1px;">&nbsp;</div>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td class="px" style="padding:0 30px 12px 30px;">
              <p class="text-strong" style="margin:0;font-size:14px;color:#000000;font-weight:400;line-height:1.6;">
                Hello dear!
              </p>
            </td>
          </tr>

          <!-- Headline -->
          <tr>
            <td class="px" style="padding:0 30px 12px 30px;">
              <p class="text-strong" style="margin:0;font-size:14px;color:#000000;font-weight:700;line-height:1.6;">
                Thank you for purchasing a gift card from us!
              </p>
            </td>
          </tr>

          <!-- Message -->
          <tr>
            <td class="px" style="padding:0 30px 12px 30px;">
              <p class="text-strong" style="margin:0;font-size:14px;color:#000000;line-height:1.6;">
                Please find the attached gift card. We&rsquo;re excited to welcome your loved ones to our studio and promise to offer them the best service and a memorable experience.
              </p>
            </td>
          </tr>
          <tr>
            <td class="px" style="padding:0 30px 12px 30px;">
              <p class="text-strong" style="margin:0;font-size:14px;color:#000000;line-height:1.6;">
                Once again, thank you for choosing us!
              </p>
            </td>
          </tr>
          <tr>
            <td class="px" style="padding:0 30px 16px 30px;">
              <p class="text-strong" style="margin:0;font-size:14px;color:#000000;line-height:1.6;">
                Warm regards,<br/><br/>
                Team Bedia.
              </p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 0 10px 0;">
              <div class="hr" style="border-top:1px solid #e5e7eb;font-size:1px;line-height:1px;height:1px;">&nbsp;</div>
            </td>
          </tr>

          <!-- Footer: logo + social -->
          <tr>
            <td class="px" style="padding:4px 30px 14px 30px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="left" style="vertical-align:middle;">
                    <table role="presentation" class="footer-badge" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;border:0;">
                      <tr>
                        <td style="padding:0;">
                          <img src="${logoUrl}" alt="Bedia Pottery" class="light-img" style="height:20px;width:auto;display:block;border:0;" />
                          <!--[if !mso]><!-->
                          <div class="dark-img" style="display:none;mso-hide:all;overflow:hidden;max-height:0;font-size:0;line-height:0;">
                            <img src="${logoDarkUrl}" alt="Bedia Pottery" style="height:20px;width:auto;display:block;border:0;filter:none;-webkit-filter:none;" />
                          </div>
                          <!--<![endif]-->
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td align="right" style="vertical-align:middle;">
                    <!-- Icons in a nested table: Gmail on Android misaligns
                         inline-block anchors, table cells keep them level. -->
                    <table role="presentation" align="right" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="padding:0 0 0 12px;vertical-align:middle;font-size:0;line-height:0;">
                          <a href="https://www.instagram.com/bediapottery/" style="text-decoration:none;">
                            <img src="${instagramIcon}" alt="Instagram" width="20" height="20" class="light-img" style="display:block;width:20px;height:20px;border:0;border-radius:100%;" />
                            <!--[if !mso]><!-->
                            <div class="dark-img" style="display:none;mso-hide:all;overflow:hidden;max-height:0;font-size:0;line-height:0;">
                              <img src="${instagramIconDark}" alt="Instagram" width="20" height="20" style="display:block;width:20px;height:20px;border:0;" />
                            </div>
                            <!--<![endif]-->
                          </a>
                        </td>
                        <td style="padding:0 0 0 12px;vertical-align:middle;font-size:0;line-height:0;">
                          <a href="https://www.tiktok.com/@bediapottery" style="text-decoration:none;">
                            <img src="${tiktokIcon}" alt="TikTok" width="20" height="20" class="light-img" style="display:block;width:20px;height:20px;border:0;border-radius:100%;" />
                            <!--[if !mso]><!-->
                            <div class="dark-img" style="display:none;mso-hide:all;overflow:hidden;max-height:0;font-size:0;line-height:0;">
                              <img src="${tiktokIconDark}" alt="TikTok" width="20" height="20" style="display:block;width:20px;height:20px;border:0;" />
                            </div>
                            <!--<![endif]-->
                          </a>
                        </td>
                        <td style="padding:0 0 0 12px;vertical-align:middle;font-size:0;line-height:0;">
                          <a href="https://www.youtube.com/@bediapottery" style="text-decoration:none;">
                            <img src="${youtubeIcon}" alt="YouTube" width="20" height="20" class="light-img" style="display:block;width:20px;height:20px;border:0;border-radius:100%;" />
                            <!--[if !mso]><!-->
                            <div class="dark-img" style="display:none;mso-hide:all;overflow:hidden;max-height:0;font-size:0;line-height:0;">
                              <img src="${youtubeIconDark}" alt="YouTube" width="20" height="20" style="display:block;width:20px;height:20px;border:0;" />
                            </div>
                            <!--<![endif]-->
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Bottom bar -->
          <tr>
            <td style="background-color:#0d463d;height:30px;font-size:1px;line-height:1px;">&nbsp;</td>
          </tr>

        </table>
        <!--[if mso]></td></tr></table><![endif]-->
      </td>
    </tr>
  </table>
</body>
</html>`;

    await sendEmail(
      recipientEmail,
      'Your Bedia Pottery Gift Card',
      'Gift Card Purchase Confirmation',
      html,
      [{ filename: 'gift-voucher.pdf', path: voucherPath }],
      [process.env.CC_EMAIL!],
    );
  } catch (error: any) {
    console.error('GIFT VOUCHER EMAIL SEND FAILED:', error?.message);
    console.error(error);
  }
};
