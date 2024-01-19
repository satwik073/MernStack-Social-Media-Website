const router = require('express').Router()
const commentCtrl = require('../controllers/commentCtrl')
const auth = require('../middleware/auth')

router.post('/post/:id/comment', commentCtrl.createComment)

router.patch('/comment/:id', commentCtrl.updateComment)

router.patch('/comment/:id/like', commentCtrl.likeComment)

router.patch('/comment/:id/unlike', commentCtrl.unLikeComment)

router.delete('/comment/:id', commentCtrl.deleteComment)

router.get('/post/:id/comments', commentCtrl.getCommentsByPostId);

router.post('/comment/:parentId/reply', commentCtrl.createReply);

router.patch('/reply/:replyId/like', commentCtrl.likeReply); 

router.patch('/reply/:replyId/unlike', commentCtrl.unlikeReply); 
module.exports = router