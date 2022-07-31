import mongoose from "mongoose";

const postSchema = mongoose.Schema({
    message: { type: String, required: true },
    creator: { type: String, required: true },
    picture : String,
    email : String,
    name : {type : String},
    tags: [String],
    file: [{ type: String, required: true }],
    likes: [{type : Object}],
    comments: [{type : Object}],
    createdAt: {
        type: Date,
        default: new Date()
    }
})

const PostMessage = mongoose.model('PostMessage', postSchema);

export default PostMessage;