const router = require('express').Router()
const postCtrl = require('../controllers/postCtrl')
const auth = require('../middleware/auth')

router.route('/posts')
    .post(postCtrl.createPost)
    .get(postCtrl.getPosts)

router.route('/post/:id')
    .patch(postCtrl.updatePost)
    .get(postCtrl.getPost)
    .delete(postCtrl.deletePost)

router.patch('/post/:id/like', postCtrl.likePost)

router.patch('/post/:id/unlike', postCtrl.unLikePost)

router.get('/user_posts/:id', postCtrl.getUserPosts)

router.get('/post_discover', postCtrl.getPostsDicover)

router.post('/savePost/:id', postCtrl.savePost)

router.post('/unSavePost/:id', postCtrl.unSavePost)

// router.get('/getAllPosts', postCtrl.getAllPosts)

router.get('/Allposts', postCtrl.getAllPosts)
module.exports = router