import mongoose from 'mongoose';
import PostMessage from '../models/postMessage.js'

export const getPosts = async (req, res) => {
    try {
        const postMessage = await PostMessage.find().sort({ _id: -1 });
        res.status(200).json(postMessage);
    } catch (error) {
        res.status(404).json(error.message)
    }
}

export const searchPost = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await PostMessage.findById(id)
        res.status(200).json({ post: result })
    } catch (error) {
        res.status(500).json(error.message)
    }
}

export const search = async (req, res) => {
    const { id } = req.params;
    const title = new RegExp(id, 'i')

    try {
        const posts = await PostMessage.find({
            $or: [ { message: title },{ tags: title },{name : title},{email : title}, {comments : title}]
        })
        res.status(200).json(posts)
    } catch (error) {
        res.status(500).json(error)
    }
}

export const createPost = async (req, res) => {
    const post = req.body;
    const newPost = PostMessage({ ...post, creator: req.userId, createdAt: new Date().toISOString() });
    try {
        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        res.status(404).json(error.message)
    }
}

export const updatePost = async (req, res) => {
    const { id: _id } = req.params;
    const post = req.body
    if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('no post with that id')
    const updated = await PostMessage.findByIdAndUpdate(_id, post, { new: true })
    res.json(updated);
}

export const deletePost = async (req, res) => {
    const { id: _id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('no post with that id')
    await PostMessage.findByIdAndRemove(_id);
    res.json({ message: 'post deleted successfully' })
}

export const commentPost = async (req, res) => {
    const { id: _id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('no post with that id')
    const post = await PostMessage.findById(_id);
    const data = {
        name: req.body.userInfo.name,
        picture: req.body.userInfo.picture,
        comment: req.body.comments,
        id: req.userId,
    }
    post.comments.push(data)

    const updatedPost = await PostMessage.findByIdAndUpdate(_id, post, { new: true })
    res.json(updatedPost)
}

export const likePost = async (req, res) => {
    const { id: _id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('no post with that id')
    const post = await PostMessage.findById(_id);

    const data = {
        name: req.body.name,
        picture: req.body.picture,
        id: req.userId,
        email: req.body.email
    }

    const index = post.likes.find((item) => {
        return item.id === req.userId
    })

    if (index) {
        post.likes = post.likes.filter((item) => {
            return item.id !== req.userId
        })
    } else {
        post.likes.push(data)
    }
    const updatedPost = await PostMessage.findByIdAndUpdate(_id, post, { new: true })
    res.json(updatedPost)


}