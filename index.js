import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import postRoutes from './routes/posts.js';
import userRoutes from './routes/users.js';
import chatRoutes from './routes/chats.js'
import cors from 'cors';
import { createServer } from "http";
import dotenv from 'dotenv';
import { Server } from "socket.io";
import Chats from "./models/chats.js";
import { status, exit, getChats} from './controllers/chats.js'
dotenv.config();

const app = express();
app.use(cors())

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:3000",
        allowedHeaders: ["my-custom-header"],
        credentials: true
    }
});
const PORT = process.env.PORT || 5000;

io.on("connection", (socket) => {

    socket.on('login', (data)=>{
        status(data)
    })

    socket.on('logout', (data)=>{
        exit(data)
    })

});

app.use(bodyParser.json({ limit: '10mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

app.use('/posts', postRoutes);
app.use('/user', userRoutes);
app.use('/chat', chatRoutes);

const CONNECTION_URL = process.env.CONNECTION;

mongoose.connect(CONNECTION_URL, { useUnifiedTopology: true, useNewUrlParser: true })
    .then(() => httpServer.listen(PORT, () => console.log(`server running on port ${PORT}`)))
    .catch((error) => console.log(error.message));

