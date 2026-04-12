const Reminder = require('../Models/reminder');
exports.addReminder = async(req,res)=>{
    try{
        const{title, discription, priority, maindate, reminderDates} = req.body;
        if(reminderDates.length > 5){
            return res.status(400).json("Max 5 reminders allowed.");

        }
     const reminders = new Reminder({
        userId:req.user, title, discription, priority, maindate, reminderDates
     });
     await reminders.save();
     res.json(reminders);
     
    }
    catch(error){
        res.status(500).json(error);


    }
    
};

exports.getReminders = async(req,res)=>{
    try{
        const data = await Reminder.find({userId:req.user}).Sort({maindate:1});
        res.json(data);

    }
    catch(error){
        res.status(500).json(error);
    }
};

exports.deleteReminder = async(req,res)=>{
    try{
        await Reminder.findByIdAndDelete(req.params.id);
        res.json("Deleted");

    }
    catch(error){
        res.status(500).json(error);

    }
};

exports.toggleComplete = async(req,res)=>{
    try{
        const r = await Reminder.findById(req.params.id);
        if(!r){return res.status(404).json("Reminder not found. :(")}
        r.completed = !r.completed;
        await r.save();
        res.json(r);

    }
    catch(error){
        res.status(500).json(error);
    }
};

exports.countReminders = async(req,res)=>{
    try{
        const count = await Reminder.countDocuments({ userId:req.user, completed:false});
        res.json({count});

    }
    catch(error){
        res.status(500).json(error);
    }
};

exports.updateReminders = async(req,res)=>{
    try{
        const{title, discription, priority, maindate, reminderDates} = req.body;
        if(reminderDates.length > 5){
            return res.status(400).json("Max 5 reminders allowed.");

        }
        const updateReminder = await Reminder.findByIdAndUpdate(req.params.id,
        {title, discription, priority, maindate, reminderDates, sendReminderDates:[]},
        {new:true}
        );
        if(!updateReminder){
            return res.status(404).json("Reminder not found. :(");

        }
        res.json(updateReminder);
    }
    catch(error){
        res.sttatus(500).json(error)
    }
}