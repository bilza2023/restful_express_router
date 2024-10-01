require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const UserSchema = require('./UserSchema');

const User = mongoose.model('User', UserSchema);


async function login(req, res) {
    try {
        const { email, password } = req.body;

        // Input validation
        if (!email || !password) {
            return res.status(400).json({ ok: false, message: "Email and password are required" });
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ ok: false, message: "Invalid email format" });
        }

        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ ok: false, message: "Email address not found" });
        }

        // Uncomment this block when email verification is implemented
        // if (!user.verified) {
        //     return res.status(403).json({ ok: false, message: "Your account is not verified", errorCode: "AccountNotVerified" });
        // }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (isPasswordValid) {
            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "365d" });

            res.set("Authorization", `Bearer ${token}`);
            return res.status(200).json({ ok: true, message: "Login successful", token, email });
        } else {
            return res.status(401).json({ ok: false, message: "Invalid email or password" });
        }
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ ok: false, message: "Login failed", error: error.message });
    }
}

module.exports = login;