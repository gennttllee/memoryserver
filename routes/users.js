import express from 'express';

import {signIn, signUp, googled, searchProfile, resetPassword, patchPassword } from '../controllers/users.js';
import  auth from '../middleware/auth.js'
const router = express.Router();

router.post('/signIN', signIn);
router.post('/signUp', signUp);
router.post('/signUp', signUp);
router.post ('/google', googled)
router.get (`/reset/:email`, resetPassword)
router.patch (`/reset/:email`, patchPassword)
router.get('/:id/profile' ,auth, searchProfile)

export default router;