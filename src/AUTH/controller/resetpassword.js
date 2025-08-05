const User = require('../models/User');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // 1. Check if user exists
    const users = await User.findOne({ email });
    if (!users) return res.status(404).json({ message: 'User not found' });

    // 2. Generate reset token
    const token = jwt.sign({ id: users._id }, process.env.JWT_SECRET, { expiresIn: '15m' });

    // 3. Save token and expiry to user
    users.resetToken = token;
    users.resetTokenExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes
    await users.save();

    // 4. Send email with reset link
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const resetURL = `http://localhost:3000/reset-password/${token}`;

    await transporter.sendMail({
      to: users.email,
      from: process.env.EMAIL_FROM,
      subject: 'Password Reset',
      html: `<p>You requested a password reset</p>
             <p>Click this link to reset: <a href="${resetURL}">${resetURL}</a></p>`,
    });

    res.status(200).json({ message: 'Reset link sent to email' });
  } catch (err) {
    res.status(500).json({ message: 'Error sending reset email', error: err.message });
  }
};

exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    // 1. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({
      _id: decoded.id,
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

    // 2. Hash and save new password
    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;

    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (err) {
    res.status(500).json({ message: 'Could not reset password', error: err.message });
  }
};
