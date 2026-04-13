const Reminder = require('../Models/reminder');

exports.addReminder = async (req, res) => {
    try {
        const { title, description, priority, maindate, reminderDates } = req.body;

        if (!reminderDates || reminderDates.length > 5) {
            return res.status(400).json({ message: "Max 5 reminder dates allowed." });
        }

        const reminder = new Reminder({
            userId: req.user,
            title,
            description,   // fixed: was "discription" throughout
            priority,
            maindate,
            reminderDates
        });

        await reminder.save();
        res.status(201).json(reminder);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

exports.getReminders = async (req, res) => {
    try {
        const data = await Reminder.find({ userId: req.user }).sort({ maindate: 1 });  // fixed: was .Sort()
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

exports.deleteReminder = async (req, res) => {
    try {
        const deleted = await Reminder.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: "Reminder not found." });
        }
        res.json({ message: "Deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

exports.toggleComplete = async (req, res) => {
    try {
        const r = await Reminder.findById(req.params.id);
        if (!r) {
            return res.status(404).json({ message: "Reminder not found. :(" });
        }
        r.completed = !r.completed;
        await r.save();
        res.json(r);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

exports.countReminders = async (req, res) => {
    try {
        const count = await Reminder.countDocuments({ userId: req.user, completed: false });
        res.json({ count });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

exports.updateReminders = async (req, res) => {
    try {
        const { title, description, priority, maindate, reminderDates } = req.body;

        if (!reminderDates || reminderDates.length > 5) {
            return res.status(400).json({ message: "Max 5 reminder dates allowed." });
        }

        const updatedReminder = await Reminder.findByIdAndUpdate(
            req.params.id,
            { title, description, priority, maindate, reminderDates, sendReminderDates: [] },
            { new: true }
        );

        if (!updatedReminder) {
            return res.status(404).json({ message: "Reminder not found. :(" });
        }

        res.json(updatedReminder);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });  // fixed: was "res.sttatus"
    }
};