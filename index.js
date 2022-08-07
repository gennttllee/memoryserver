import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import postRoutes from './routes/posts.js';
import userRoutes from './routes/users.js';
import cors from 'cors';
import dotenv from 'dotenv';

const app = express();
dotenv.config();

app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
app.use(cors({
    origin: '*'
}));
app.use('/posts', postRoutes);
app.use('/user', userRoutes);

const CONNECTION_URL = process.env.CONNECTION;

const PORT = process.env.PORT || 5000;

mongoose.connect(CONNECTION_URL, { useUnifiedTopology: true, useNewUrlParser: true })
    .then(() => app.listen(PORT, () => console.log(`server running on port ${PORT}`)))
    .catch((error) => console.log(error.message));

