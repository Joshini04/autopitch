require('dotenv').config();
const readline = require('readline');
const { findLookalikeCompanies } = require('./stages/ocean');
const { findDecisionMakers } = require('./stages/prospeo');
const { getEmails } = require('./stages/eazyreach');
const { sendEmails } = require('./stages/brevo');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function main() {
  console.log('🚀 Welcome to AutoPitch - Automated Outreach Pipeline');
  console.log('================================================\n');

  rl.question('Enter seed domain : ', async (seedDomain) => {
    rl.close();

    const companies = await findLookalikeCompanies(seedDomain);
    if (companies.length === 0) {
      console.log('❌ No companies found. Exiting.');
      return;
    }

    const contacts = await findDecisionMakers(companies);
    if (contacts.length === 0) {
      console.log('❌ No contacts found. Exiting.');
      return;
    }

    const contactsWithEmails = await getEmails(contacts);
    if (contactsWithEmails.length === 0) {
      console.log('❌ No emails found. Exiting.');
      return;
    }

    console.log('\n⚠️  SAFETY CHECKPOINT');
    console.log('====================');
    console.log(`Ready to send emails to ${contactsWithEmails.length} contacts:`);
    contactsWithEmails.forEach(c => console.log(`  - ${c.name} (${c.email})`));

    const rl2 = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl2.question('\nProceed with sending emails? (yes/no): ', async (answer) => {
      rl2.close();
      if (answer.toLowerCase() === 'yes') {
        await sendEmails(contactsWithEmails);
        console.log('\n🎉 AutoPitch pipeline completed successfully!');
      } else {
        console.log('❌ Email sending cancelled.');
      }
    });
  });
}

main();