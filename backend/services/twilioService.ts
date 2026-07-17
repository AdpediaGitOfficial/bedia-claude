/*
import twilio from 'twilio';
import configKeys from '../configKeys';

const client = twilio(configKeys.TWILIO_ACCOUNT_SID, configKeys.TWILIO_AUTH_TOKEN);

export const sendOtp = async (to: number, otp: string): Promise<void> => {
  await client.messages.create({
    body: `${otp} is your verification code for Etern Learning. This code will expire in 10 minutes.`,
    from: configKeys.TWILIO_PHONE_NUMBER,
    to: `+91${to}`,
  });
};
*/

import axios from 'axios';

export const sendOtp = async (to: number, otp: string): Promise<void> => {
  try {
    const response = await axios.get('https://www.sapteleservices.com/SMS_API/sendsms.php', {
      params: {
        apikey: process.env.SAP_API_KEY,
        sendername: process.env.SAP_SENDER_NAME,
        tid: '1707174678706116453',
        mobile: `${to}`,
        routetype: 1,
        message: `Your Verification code for Etern learning is ${otp}. This code expires in 10 minutes. ETERN LEARNING`,
      },
    });

    console.log('Status Code:', response.status);
  } catch (error) {
    console.error('Failed to send SMS via SAP TeleServices:', error);
    throw new Error('SMS sending failed');
  }
};
