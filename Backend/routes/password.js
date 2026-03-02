const express = require('express');
const { forgotPassword, changePassword, verifyResetToken, getResetPasswordToken } = require('../controllers/users/password');

const router = express.Router();

router.post('/forgot-password', forgotPassword);
router.post('/change-password', changePassword);
router.get('/verify-reset-token', verifyResetToken);
router.post('/verify-reset-token', verifyResetToken);
router.post('/getReset-PasswordToken', getResetPasswordToken);


module.exports = router;
