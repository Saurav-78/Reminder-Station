const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cron = require('node-cron');
dotenv.config();
const connectDB = require('./Config/DB');
const authroutes = require('./Routes/authroutes');
const reminderroutes = require('./Routes/reminderroutes');
const Reminder = require('./Models/reminder');
const sendReminderMail = require('./Utils/mail');
const app = express();
app.use(cors());
app.use(express.json());
connectDB();
app.get('/', (req,res)=>{
    res.send("API is running. :)")
});
app.use("/API/auth", authroutes)
app.use("/API/reminder", reminderroutes);
cron.schedule("* * * * *", async()=>{
    const now = new Date();
    const reminders = await Reminder.find({completed:false});
    for(const r of reminders){
        for(const rDate of r.reminderDates){
         const reminderTime = new Date(rDate);
         const alreadySent = r.sendReminderDates.some(
            d=>new Date(d).getTime()===reminderTime.getTime()
            
         );
         if(alreadySent)continue;
         if(now>=reminderTime){
         await sendReminderMail(r.title, r.discription, r.priority, r.maindate);
         r.sendReminderDates.push(reminderTime);
         await r.save();
        }
    }
}
})
const port = 5000;
app.listen(port,()=>console.log("Server is running on port 5000. :)"));
