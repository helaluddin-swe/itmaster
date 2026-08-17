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



// ==========================================
// 1. STANDARD USER AUTHENTICATION
// ==========================================

// Register Standard User
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Please fill in all fields" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists with this email" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Explicitly enforce 'user' role
    const newUser = await User.create({ 
      name, 
      email, 
      password: hashedPassword,
      role: 'user'
    });

    const token = generateToken(newUser._id || newUser.id);

    res.status(201).json({ 
      success: true, 
      message: "Registered successfully", 
      token,
      user: { 
        _id: newUser._id, 
        name: newUser.name, 
        email: newUser.email, 
        role: newUser.role 
      } 
    });
  } catch (error) {
    console.error("Register User Error:", error);
    res.status(500).json({ success: false, message: error.message || "Server error" });
  }
};

// Login Standard User
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Please provide email and password" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "Account not found with this email" });
    }

    // Optional check: Prevent Admin/Staff from logging in via standard user portal if desired
    if (user.role === 'admin' || user.role === 'staff') {
      return res.status(403).json({ 
        success: false, 
        message: "Admin/Staff accounts must sign in through the Admin Portal" 
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    const token = generateToken(user._id || user.id);

    res.status(200).json({
      success: true,
      token,
      user: { 
        _id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role 
      }
    });
  } catch (error) {
    console.error("Login User Error:", error);
    res.status(500).json({ success: false, message: "Server error during login" });
  }
};


// ==========================================
// 2. ADMIN & STAFF AUTHENTICATION
// ==========================================

// Register Admin / Staff
exports.registerAdminStaff = async (req, res) => {
  try {
    const { name, email, password, role, adminSecret } = req.body;

    if (!name || !email || !password || !adminSecret) {
      return res.status(400).json({ 
        success: false, 
        message: "All fields including Admin Secret Key are required" 
      });
    }

    // Verify Admin Secret Key from process.env
    if (adminSecret !== process.env.ADMIN_SECRET_CODE) {
      return res.status(403).json({ 
        success: false, 
        message: "Unauthorized: Invalid Admin Secret Key" 
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Account already exists" });
    }

    // Assign requested role ('admin' or 'staff')
    const assignedRole = (role === 'staff' || role === 'admin') ? role : 'admin';

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newAdmin = await User.create({ 
      name, 
      email, 
      password: hashedPassword,
      role: assignedRole,
      isVerified: true
    });

    const token = generateToken(newAdmin._id || newAdmin.id);

    res.status(201).json({ 
      success: true, 
      message: `Registered successfully as ${assignedRole}`, 
      token,
      user: { 
        _id: newAdmin._id, 
        name: newAdmin.name, 
        email: newAdmin.email, 
        role: newAdmin.role 
      } 
    });
  } catch (error) {
    console.error("Register Admin Error:", error);
    res.status(500).json({ success: false, message: error.message || "Server error" });
  }
};

// Login Admin / Staff
exports.loginAdminStaff = async (req, res) => {
  try {
    const { email, password, adminSecret } = req.body;

    if (!email || !password || !adminSecret) {
      return res.status(400).json({ 
        success: false, 
        message: "Email, password, and Admin Secret Key are required" 
      });
    }

    // 1. Verify Secret Key first
    if (adminSecret !== process.env.ADMIN_SECRET_CODE) {
      return res.status(403).json({ success: false, message: "Invalid Admin Secret Key" });
    }

    // 2. Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "Admin/Staff account not found" });
    }

    // 3. Verify user has elevated permissions
    if (user.role !== 'admin' && user.role !== 'staff') {
      return res.status(403).json({ 
        success: false, 
        message: "Access Denied: Standard user accounts cannot log in here" 
      });
    }

    // 4. Compare Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    const token = generateToken(user._id || user.id);

    res.status(200).json({
      success: true,
      token,
      user: { 
        _id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role 
      }
    });
  } catch (error) {
    console.error("Login Admin Error:", error);
    res.status(500).json({ success: false, message: "Server error during admin login" });
  }
};