import express from 'express'
import dotenv from 'dotenv'
import { verifyToken } from '../util/verify';
import { attendanceLogin, getAttendanceLogin, getUsers, register, getUserAttendance, approveUser, getUsersWithAttendance, getAdminUsers } from '../controller/userController';
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
userAPI.put('/admin/user/status',verifyToken, AdminApprove);
userAPI.get('/admin/user/attendance', getUserAttendance);
userAPI.get('/admin/users/attendances', getUsersWithAttendance);
userAPI.get('/admin/users', verifyToken, getAdminUsers);

export default userAPI