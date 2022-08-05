import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/user.js'
import PostMessage from '../models/postMessage.js';
import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

const REFRESH_TOKEN = process.env.REFRESH_TOKEN
const access = process.env.ACCESS_TOKEN

const clientId = process.env.CLIENT_ID
const secret = process.env.SECRET

const oauth2 = new google.auth.OAuth2(
    clientId, secret
)
oauth2.setCredentials({ refresh_token: REFRESH_TOKEN })

const sendMail = async (email) => {
    const text = Math.floor((Math.random()*14031995)+1);
    const mailOption = {
        from: 'markwilliamz1995@gmail.com',
        to: email,
        subject: 'use this code to reset your password',
        text : `password reset code is ${text}`
    }
    try {
        const accessToken = await oauth2.getAccessToken();
        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'Oauth2',
                user: process.env.USER,
                clientId: clientId,
                clientSecret: secret,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken
            }
        })
        transport.sendMail(mailOption, (error, result) => {
            if (error) {
                return error
            }
        })
        transport.close();
        return text
    } catch (error) {
        res.status(500).json(error)
    }
}

export const searchProfile = async (req, res) => {
    const creator = req.params;
    const id = creator.id;
    try {
        const existUser = await User.findById(id);
        const posts = await PostMessage.find({ email: existUser.email })
        res.status(200).json({ post: posts, user: existUser })
    } catch (error) {
        res.status(500).json({ message: 'something went wrong' })
    }
}

export const resetPassword = async (req, res) => {
    const { email } = req.params;
    try {
        const result = await User.findOne({ email })
        if (!result) return res.status(401).json({ message: 'user does not exist' })
        const text = await sendMail(email);
        res.status(200).send({message : 'OTP sent to user email', otp : text})
    } catch (error) {
        res.status(500).json(error)
    }
}

export const patchPassword = async(req, res)=>{
    const { email } = req.params;
    const {newPassword} = req.body;
    try {
        let existUser = await User.findOne({ email });
        if (!existUser) return res.status(401).json({ message: 'user with this email does not exist' })
        const password = await bcrypt.hash(newPassword, 12);
        existUser.password = password;
        const {_id } = existUser;
        const result = await User.findByIdAndUpdate(_id, existUser, {new : true})
        const token = jwt.sign({
            email: result.email, id: result._id,
        }, 'Malachi', { expiresIn: '1hr' });

        res.status(200).json({ result, token })
    } catch (error) {
        res.status(500).json({ message: 'something went wrong please refresh and try again later' })
    }
}

export const signIn = async (req, res) => {
    const { email, password } = req.body;

    try {
        const existUser = await User.findOne({ email });
        if (!existUser) return res.status(401).json({ message: 'user does not exist' })

        const correctPassword = await bcrypt.compare(password, existUser.password);
        if (!correctPassword) return res.status(401).json({ message: 'invalid credentials' })

        const token = jwt.sign({
            email: existUser.email, id: existUser._id,
        }, 'Malachi', { expiresIn: '1hr' });

        res.status(200).json({ result: existUser, token })

    } catch (error) {
        res.status(500).json({ message: 'something went wrong' })
    }
};

export const googled = async (req, res) => {
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