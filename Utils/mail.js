const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service:"gmail",
  auth:{
    user:process.env.EMAIL,
    pass:process.env.PASS
  }
});

const sendReminderMail = async (title,description,priority,mainDate)=>{
  await transporter.sendMail({
    from:process.env.EMAIL,
    to:process.env.EMAIL,
    subject:`Reminder: ${title}`,
    text:`
Reminder Alert

Title: ${title}
Description: ${description}
Priority: ${priority}
Event Time: ${mainDate}
    `
  });
};

module.exports = sendReminderMail;
