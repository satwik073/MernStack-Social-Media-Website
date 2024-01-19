const Notifies = require('../models/notifyModel')


const notifyCtrl = {
    createNotify: async (req, res) => {
        try {
          const { id, recipients, text, content, image } = req.body;
    
          // Ensure recipients exist and is an array
          if (!Array.isArray(recipients) || !recipients.includes(req.user._id.toString())) {
            // Handle recipients that are not an array or don't contain the user's ID
            return res.status(400).json({ msg: 'Invalid recipients or user ID not found' });
          }
    
          const notify = new Notifies({
            id,
            recipients,
            text,
            content,
            image,
            user: req.user._id,
          });
    
          await notify.save();
          return res.json({ notify });
        } catch (err) {
          return res.status(500).json({ msg: err.message });
        }
      },
    
    removeNotify: async (req, res) => {
        try {
            const notify = await Notifies.findOneAndDelete({
                id: req.params.id, url: req.query.url
            })
            
            return res.json({notify})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    getNotifies: async (req, res) => {
        try {
            const notifies = await Notifies.find({recipients: req.user._id})
            .sort('-createdAt').populate('user', 'avatar username')
            
            return res.json({notifies})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    isReadNotify: async (req, res) => {
        try {
            const notifies = await Notifies.findOneAndUpdate({_id: req.params.id}, {
                isRead: true
            })

            return res.json({notifies})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    deleteAllNotifies: async (req, res) => {
        try {
            const notifies = await Notifies.deleteMany({recipients: req.user._id})
            
            return res.json({notifies})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
}


module.exports = notifyCtrl