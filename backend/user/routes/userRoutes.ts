import { Router } from 'express';
import {
  registerUser,
  uploadAvatar,
  verifyOtp,
  sendOtp,
  getProfile,
  updateProfile,
  getUsers,
  login,
  registerAdmin,
  logout,
  deleteAccount,
  getUserById,
  deleteUser,
  userLogin,
} from '../controllers/userController';
import { authenticateUser, authenticateAdmin } from '../../middleware/authentication';

import {
  userRegisterValidation,
  verifyOtpValidation,
  sendOtpValidation,
  getProfileValidation,
  userUpdateValidation,
  loginValidation,
  adminRegisterValidation,
  logoutValidation,
} from '../requests/userRequest';

const router = Router();

router.post('/register', userRegisterValidation, registerUser);
router.post('/user-login', loginValidation, userLogin);

router.post('/verify-otp', verifyOtpValidation, verifyOtp);
router.post('/upload-avatar/:studentId', authenticateUser, uploadAvatar);
router.post('/send-otp', sendOtpValidation, sendOtp);
router.get('/profile/:userId', authenticateUser, getProfileValidation, getProfile);

router.put('/profile-update/:userId', authenticateUser, userUpdateValidation, updateProfile);
router.post('/logout', authenticateUser, logoutValidation, logout);
router.post('/delete-account', authenticateUser, deleteAccount);

//Admin apis
router.post('/login', loginValidation, login);
router.get('/all', authenticateAdmin, getUsers);
router.post('/register-admin', adminRegisterValidation, registerAdmin);
router.get('/:id', authenticateAdmin, getUserById);
router.delete('/:userId', authenticateAdmin, deleteUser);

export default router;
