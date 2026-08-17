const express = require("express");
const { 
  loginUser, 
  registerUser, 
  getUserProfile, 
  deleteUserAccount, 
  getCurrentUser, 
  getAllUsers 
} = require("../controllers/AuthController.js");
const authMiddleware = require("../middleware/authMiddleware.js");
const adminMiddleware = require("../middleware/adminMiddleware.js");



const router = express.Router();

// --- Public Routes ---
router.post('/login', loginUser);       
router.post('/signup', registerUser);   

// --- Private (User) Routes ---
router.get('/me', authMiddleware, getCurrentUser); 

// --- Admin ONLY Routes ---
// We chain authMiddleware FIRST so req.user is populated, then adminMiddleware checks the role


router.get('/all-users', authMiddleware, adminMiddleware, getAllUsers);
router.get('/users/:id', authMiddleware, adminMiddleware, getUserProfile);
router.delete("/users/:id", authMiddleware, adminMiddleware, deleteUserAccount); 

module.exports = router;