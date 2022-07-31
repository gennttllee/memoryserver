import express from 'express';

import {signIn, signUp, google, searchProfile } from '../controllers/users.js';
import  auth from '../middleware/auth.js'
const router = express.Router();

router.post('/signIN', signIn);
router.post('/signUp', signUp);
router.post('/signUp', signUp);
router.post ('/google', google)
router.get('/:id/profile' ,auth, searchProfile)

export default router;