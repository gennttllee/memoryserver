import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/user.js'
import PostMessage from '../models/postMessage.js';

export const searchProfile = async (req, res)=>{
    const creator = req.params;
    const id = creator.id;
    try {
        const existUser = await User.findById(id);
        const posts = await PostMessage.find({ email :existUser.email})
        res.status(200).json({post : posts, user : existUser})
    } catch (error) {
        res.status(500).json({ message: 'something went wrong' })
    }

}

export const signIn = async (req, res) => {
    const { email, password } = req.body;

    try {
        const existUser = await User.findOne({ email });
        if (!existUser) return res.json({ message: 'user does not exist' })

        const correctPassword = await bcrypt.compare(password, existUser.password);
        if (!correctPassword) return res.json({ message: 'invalid credentials' });

        const token = jwt.sign({
            email: existUser.email, id: existUser._id,
        }, 'Malachi', { expiresIn: '1hr' });

        res.status(200).json({ result: existUser, token })

    } catch (error) {
        res.status(500).json({ message: 'something went wrong' })
    }
};

export const google = async (req, res) => {
    const mResults = jwt.decode(req.body.profile)
    const { email, sub, name, picture } = mResults;
    try {
        const existUser = await User.findOne({ email })
        if (existUser) {
            const token = jwt.sign({
                email: existUser.email, id: existUser._id,
            }, 'Malachi', { expiresIn: '1hr' });
            res.status(200).json({ result: existUser, token })
        } else {
            const password = await bcrypt.hash('123456', 12);
            const result = await User.create({ name, email, password, picture, id: sub })
            const token = jwt.sign({
                email: result.email, id: result._id,
            }, 'Malachi', { expiresIn: '1hr' });
            res.status(200).json({ result, token })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'something went wrong' })
    }
}

export const signUp = async (req, res) => {
    const { email, password, firstName, lastName, confirmPassword, picture } = req.body;

    try {
        const existUser = await User.findOne({ email })
        if (existUser) return res.status(404).json({ message: 'user already exist' })
        if (password !== confirmPassword) return res.status(404).json({ message: 'passwords does not match' });
        const hashPassword = await bcrypt.hash(password, 12);

        const result = await User.create({ name: `${firstName}, ${lastName}`, email, picture, password: hashPassword })

        const token = jwt.sign({
            email: result.email, id: result._id,
        }, 'Malachi', { expiresIn: '1hr' });

        res.status(200).json({ result, token })

    } catch (error) {
        res.status(500).json({ message: 'something went wrong' })
    }
}