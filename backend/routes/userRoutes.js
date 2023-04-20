const express = require('express')
const { sendEmailLinkForResetPassword, changePassword, verifyUserForForgotPassword } = require('../controllers/resetController')
const router = express.Router()
const {
  registerUser,
  loginUser,
  getMe,
  newToken,
  logout,
} = require('../controllers/userController')
const { protect } = require('../middleware/authMiddleware')
const { loginLimiter } = require('../middleware/loginLimiterMiddleware')

router.post('/signup', registerUser)
router.post('/login',loginLimiter, loginUser)
router.post('/refresh',newToken)
router.delete('/logout',logout)
router.get('/me', protect, getMe)
router.post('/sendpasswordlink',sendEmailLinkForResetPassword);
router.get('/forgotpassword/:id/:token',verifyUserForForgotPassword)
router.post('/:id/:token',changePassword)

module.exports = router
