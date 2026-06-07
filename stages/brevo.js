const axios = require('axios');

async function sendEmails(contacts) {
  console.log(`\n📧 Stage 4: Sending emails to ${contacts.length} contacts...`);
  
  let sent = 0;

  for (const contact of contacts) {
    try {
      await axios.post(
        'https://api.brevo.com/v3/smtp/email',
        {
          sender: {
            name: 'Joshini',
            email:'joshini@autopitch.site'
          },
          to: [{ email: contact.email, name: contact.name }],
          subject: `Hi from a student developer!`,
          htmlContent: `
            <p>Hi ${contact.name.split(' ')[0]},</p>
            <p>I'm Joshini, a student developer currently building an automated outreach pipeline as part of a tech assessment.</p>
            <p>I came across ${contact.domain} and used it as a test case for my pipeline — which automatically finds companies, locates decision makers, and sends personalized emails.</p>
            <p>I apologize if this reached you unexpectedly! I'd love to hear any feedback if you have a moment.</p>
            <br/>
            <p>Best regards,</p>
            <p>Joshini</p>
          `
        },
        {
          headers: {
            'api-key': process.env.BREVO_API_KEY,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log(`✅ Email sent to ${contact.name} (${contact.email})`);
      sent++;

    } catch (error) {
      console.error(`❌ Brevo error for ${contact.name}:`, error.response?.data || error.message);
    }
  }

  console.log(`\n✅ Successfully sent ${sent} emails!`);
}

module.exports = { sendEmails };