const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    content: String,
    images: {
        type: Array,
        required: true
    },
    likes: [{ type: mongoose.Types.ObjectId, ref: 'user' }],
    comments: [{ type: mongoose.Types.ObjectId, ref: 'comment' }],
    user: { type: mongoose.Types.ObjectId, ref: 'user' },
    loggedInUserId: { type: mongoose.Types.ObjectId, ref: 'user' }, // Added field
}, {
    timestamps: true
})

module.exports = mongoose.model('post', postSchema)
