const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cron = require('node-cron');
dotenv.config();

const connectDB = require('./Config/DB');
const authroutes = require('./routes/authRoutes');
const reminderroutes = require('./Routes/reminderroutes');
const Reminder = require('./models/Reminder');
const User = require('./models/user');
const sendReminderMail = require('./Utils/mail');

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
                    const user = await User.findById(r.userId);
                    if (user) {
                        await sendReminderMail(r.title, r.description, r.priority, r.maindate, user.email);
                    }
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
