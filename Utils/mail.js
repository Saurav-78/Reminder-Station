const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{user:process.env.EMAIL,
        pass: process.env.PASS
    }
});
const sendReminderMail = async(title, discription, priority, maindate)=>{
    await transporter.sendMail({
        from:process.env.EMAIL, to: process.env.EMAIL, 
        subject:`reminder : ${title}`, 
        text:`reminder alert
        Title:${title}
        Discription:${discription}
        Priority:${priority}
        Maindate:${maindate}`
    });
};
module.exports = sendReminderMail;