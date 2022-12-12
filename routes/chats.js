import express from 'express';
import { getChats, createChat } from '../controllers/chats.js';

const router = express.Router();

router.get('/:email', getChats)
router.post('/:email', createChat)


export default router;