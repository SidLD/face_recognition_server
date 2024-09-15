import express from 'express'
import dotenv from 'dotenv'
import { verifyToken } from '../util/verify';
import { attendanceLogin, getAttendanceLogin, getUsers, register, getUserAttendance, approveUser } from '../controller/userController';
import { login, approveUser as AdminApprove } from '../controller/adminController';
dotenv.config()
const userAPI = express()

userAPI.post('/register', register);
userAPI.get('/users', getUsers);
userAPI.post('/attendance', attendanceLogin);
userAPI.get('/attendance', getAttendanceLogin);
userAPI.get('/attendance/user', getUserAttendance);
userAPI.get('/user/status', approveUser);


//Admin
userAPI.post('/admin/login', login);
userAPI.post('/admin/approveUser',verifyToken, AdminApprove);
userAPI.post('/admin/user/attendance', verifyToken, getUserAttendance);

export default userAPI