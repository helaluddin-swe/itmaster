const User = require("../models/AuthModel.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Helper to generate consistent tokens
const generateToken = (user, expires = '7d') => {
  // 1. Guard against missing JWT secret
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  // 2. Safely extract user ID (handles Mongoose ObjectId or plain object)
  const userId = user?._id?.toString() || user?.id;

  if (!userId) {
    throw new Error("Cannot generate token: Invalid user object or missing ID");
  }

  // 3. Sign token with clear payload structure
  return jwt.sign(
    { 
      id: userId, 
      role: user.role || 'user' // Fallback role if none is provided
    }, 
    process.env.JWT_SECRET, 
    { expiresIn: expires }
  );
};

// 1. REGISTER USER
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role, adminSecret } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    // Role & Secret Key Verification
    let finalRole = 'user'; 
    if (role === 'admin') {
      // Check against environment variable
      if (adminSecret !== process.env.ADMIN_SECRET_CODE) {
        return res.status(403).json({ 
          success: false, 
          message: "Unauthorized: Invalid Admin Secret Key" 
        });
      }
      finalRole = 'admin';
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({ 
      name, 
      email, 
      password: hashedPassword,
      role: finalRole,
      isVerified: finalRole === 'admin' // Auto-verify admins if desired
    });

    res.status(201).json({ 
      success: true, 
      message: `Registered successfully as ${finalRole}`, 
      user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role } 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. LOGIN USER
exports.loginUser = async (req, res) => {
  try {
    const { email, password, role, adminSecret } = req.body;

    // 1. Find user by email and specific role
    const user = await User.findOne({ email, role });
    if (!user) return res.status(404).json({ success: false, message: "Account not found for this role" });

    // 2. Verify Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ success: false, message: "Invalid credentials" });

    // 3. IF Admin, Verify Secret Key
    if (role === 'admin') {
      if (adminSecret !== process.env.ADMIN_SECRET_CODE) {
        return res.status(403).json({ success: false, message: "Invalid Admin Secret Key" });
      }
    }

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 3. GET CURRENT USER
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 4. GET SPECIFIC PROFILE (Added to match route)
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 5. GET ALL USERS
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, users });
  } catch (error) {
    res.status(500).json({ success: false, message: "Could not fetch users" });
  }
};

// 6. DELETE ACCOUNT
exports.deleteUserAccount = async (req, res) => {
  try {
    if (req.user.id !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ success: false, message: "User not found" });
    res.status(200).json({ success: true, message: "Account deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};