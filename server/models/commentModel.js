const mongoose = require('mongoose')
const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    tag: Object,
    reply: { type: mongoose.Types.ObjectId, ref: 'comment' }, // Reference to parent comment
    replies: [{ type: mongoose.Types.ObjectId, ref: 'comment' }], // Array of replies
    likes: [{ type: mongoose.Types.ObjectId, ref: 'user' }],
    user: { type: mongoose.Types.ObjectId, ref: 'user' },
    username: { type: String, required: true },
    avatar: { type: String, required: true },
    postId: { type: mongoose.Types.ObjectId, ref: 'post' },
    postUserId: { type: mongoose.Types.ObjectId, ref: 'post' },
}, {
    timestamps: true
});

module.exports = mongoose.model('comment', commentSchema)