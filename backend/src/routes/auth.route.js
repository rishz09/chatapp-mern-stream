// the dot doesn't do anything. Its still a JS file
// for authentication, "/api/auth" part is common
// so, a single file with routing works
// also, a separate file is better because otherwise it
// looks cluttered in server.js

import express from 'express';
import { signup, login, logout, onboard } from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);

// need a protection because only signed up users should see this page
// first check for protectRoute(). If this route is protected, then call the next() method, i.e, call onboard()
router.post('/onboarding', protectRoute, onboard);

// check if user is logged in
router.get('/me', protectRoute, (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});

export default router;
