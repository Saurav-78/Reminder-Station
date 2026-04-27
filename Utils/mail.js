const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS
    }
});

const sendReminderMail = async (title, description, priority, maindate, userEmail) => {
    await transporter.sendMail({
        from:    process.env.EMAIL,
        to:      userEmail,
        subject: `Reminder: ${title}`,
        text: `Reminder Alert!\n\nTitle:       ${title}\nDescription: ${description}\nPriority:    ${priority}\nMain Date:   ${maindate}`
    });
};

module.exports = sendReminderMail;
