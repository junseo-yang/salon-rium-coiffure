/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable global-require */
/* eslint-disable no-console */
export async function sendTwilio({ to, body }: { to: string; body: string }) {
    const client = require("twilio")(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
    );

    try {
        await client.messages.create({
            to, // Destination Number
            from: process.env.TWILIO_PHONE_NUMBER, // From a valid Twilio number
            body
        });
    } catch (e) {
        console.error(e);
    }
}
