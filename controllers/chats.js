import User from '../models/user.js'
import Chats from '../models/chats.js'

export const status = async (email) => {
    try {
        let user = await User.findOne({ email });
        if (user) {
            user.status = 'online';
            await User.findByIdAndUpdate({ _id: user._id }, user, { new: true })
        }
    } catch (error) {
        console.log(error)
    }
}

export const exit = async (email) => {
    try {
        let user = await User.findOne({ email });
        if (user) {
            user.status = 'offline';
            const result = await User.findByIdAndUpdate({ _id: user._id }, user, { new: true })
        }
    } catch (error) {
        console.log(error)
    }
}

export const getChats = async (req, res) => {
    const { email } = req.params
    try {
        let chats = await Chats.find({
            $or: [{ from: email }, { to: email }]
        }).sort({ _id: -1 })
        res.status(200).json(chats)
    } catch (error) {
        res.status(500).json(error)
    }
}

export const createChat = async (req, res) => {
    const { email, data } = req.body;
    const newChat =  Chats({from : email, to : data})
    try {
        await newChat.save();
        res.status(200).json(newChat)
    } catch (error) {
        res.status(500).json(error)
    }
}

