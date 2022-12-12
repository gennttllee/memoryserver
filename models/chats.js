import mongoose from "mongoose";

const chatSchema = mongoose.Schema({
    from:  String,
    to: String,
    message: [{
        email : String,
        text : String,
        createdAt: {
            type: String,
            default: new Date().getTime().toString()
        }
    }],
    createdAt: {
        type: Date,
        default: new Date()
    }
})

const Chats = mongoose.model('Chats', chatSchema);

export default Chats;