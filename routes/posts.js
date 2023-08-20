const express = require('express')
const router = express.Router()
const Post = require('../models/Post')
const auth = require('../middleware/auth')
//ADD A POST
router.post("/", auth, (req, res) => {
    const { title, description} = req.body

    const post = new Post()
    post.title = title
    post.description = description
    post.author = req.user.id
    post.save()

    return res.json({
        msg: "Post successfull",
        post
    })
})
//GET ALL POSTS
router.get("/", async (req, res) => {
    try{
        let posts = await Post.find({})
        return res.json(posts)
    } catch(err) {
        return res.json(err)
    }
})

//GET ALL THE POST OF THE LOGGED IN USER localhost:3000/posts/myposts
router .get("/myposts", auth, async (req, res) => {
    try{
        let posts = await Post.find({ author: req.user.id })
        return res.json(posts)
    } catch(err) {
        return res.json({msg: "You have no posts"})
    }
})

//GET A SINGLE POST
router.get("/:id", async (req, res) => {
    try{
        let post = await Post.findById(req.params.id)
        return res.json(post)
    } catch(err) {
        return res.json(err)
    }
})

//DELETE A POST
//You can only delete a post that you own
router.delete("/:id", auth, async(req, res) => {
    try {
        let post = await Post.findById(req.params.id);
        
        if (!post) {
            return res.json({msg: "No post"});
        }

        if (post.author.toString() !== req.user.id) {
            return res.json({msg: "Unauthorized"});
        }

        await post.remove();

        return res.json({msg: "Post deleted successfully"});
    } catch(err) {
        return res.json({msg: "Post not deleted"});
    }
})

//EDIT A POST
//UPDATE A POST localhost:3000/posts/id
router.put("/:id", auth, async (req,res) => {
    try{
        let post = await Post.find({ author: req.user.id})
        if(post) {
            let post = await Post.findByIdAndUpdate(req.params.id)
            post.title = req.body.title
            post.description = req.body.description
            post.save()
            return res.json({
                msg: "You have Updated",
                post
            })
        } else {
            return res.json({ msg: "No post to Update"})
        }
    } catch(err) {
        return res.json({msg: "Not Updated"})
    }
})

//UPDATE A POST SIR STYLE
// router.put("/:id", auth, async (req, res) => {
//     try{
//         const post = await Post.findById(req.params.id)
//         if(!post) return res.json({msg: "Post Not Found"})
//         if(post.author.toString() !== req.user.id) return res.json({msg: "You dont own this post"})

//         post.title = req.body.title
//         post.description = req.body.description
//         await Post.updateOne({_id: req.params.id}, post)
//         await post.save()
//         return res.json(post)

//     } catch(err) {
//         return res.json({ msg: "No post Updated"})
//     }
// })



module.exports = router