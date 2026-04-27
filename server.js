// const express = require("express");
// const cors = require("cors");
// const dotenv = require("dotenv");
// const cron = require("node-cron");

// dotenv.config();

// const connectDB = require("./config/db");
// const authRoutes = require("./routes/authRoutes");
// const reminderRoutes = require("./routes/reminderRoutes");

// const Reminder = require("./models/Reminder");
// const sendReminderMail = require("./Utils/mailer");

// const app = express();

// app.use(cors());
// app.use(express.json());

// connectDB();

// app.get("/",(req,res)=>{
//   res.send("API Running");
// });

// app.use("/api/auth", authRoutes);
// app.use("/api/reminder", reminderRoutes);

// cron.schedule("* * * * *", async ()=>{

//   const now = new Date();
//   const reminders = await Reminder.find({completed:false});

//   for(const r of reminders){

//     for(const rDate of r.reminderDates){

//       const reminderTime = new Date(rDate);

//       const alreadySent = r.sentReminderDates.some(
//         d => new Date(d).getTime() === reminderTime.getTime()
//       );

//       if(alreadySent) continue;

//       if(now >= reminderTime){

//         await sendReminderMail(
//           r.title,
//           r.description,
//           r.priority,
//           r.mainDate
//         );

//         r.sentReminderDates.push(reminderTime);
//         await r.save();
//       }
//     }
//   }

// });

// const PORT = process.env.PORT || 5000;

// app.listen(PORT,()=>{
//   console.log("Server running on",PORT);
// });

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cron = require('node-cron');
dotenv.config();

const connectDB = require('./Config/DB');
const authroutes = require('./routes/authRoutes');
const reminderroutes = require('./Routes/reminderroutes');
const Reminder = require('./models/Reminder');
const sendReminderMail = require('./Utils/mailer');

const app = express();
app.use(cors());
app.use(express.json());
connectDB();

app.get('/', (req, res) => {
    res.send("API is running. :)");
});

app.use("/API/auth", authroutes);
app.use("/API/reminder", reminderroutes);

// Cron job: runs every minute to check and send due reminders
cron.schedule("* * * * *", async () => {
    console.log("⏰ Cron running at:", new Date().toISOString());
    try {
        const now = new Date();
        const reminders = await Reminder.find({ completed: false });
        console.log(`📋 Found ${reminders.length} pending reminder(s)`);

        for (const r of reminders) {
            for (const rDate of r.reminderDates) {
                const reminderTime = new Date(rDate);

                const alreadySent = r.sendReminderDates.some(
                    d => new Date(d).getTime() === reminderTime.getTime()
                );

                console.log(`🔔 "${r.title}" | Due: ${reminderTime.toISOString()} | Already sent: ${alreadySent} | Now >= Due: ${now >= reminderTime}`);

                if (alreadySent) continue;

                if (now >= reminderTime) {
                    console.log(`📧 Sending email for: "${r.title}"`);
                    await sendReminderMail(r.title, r.description, r.priority, r.maindate);
                    r.sendReminderDates.push(reminderTime);
                    await r.save();
                    console.log(`✅ Email sent for: "${r.title}"`);
                }
            }
        }
    } catch (err) {
        console.error("❌ Cron error:", err);
    }
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server is running on port ${port}. :)`));
