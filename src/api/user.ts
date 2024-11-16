import express from 'express'
import dotenv from 'dotenv'
import { verifyToken } from '../util/verify';
import { attendanceLogin, getAttendanceLogin, getUsers, register, getUserAttendance, approveUser, getUsersWithAttendance, getAdminUsers, deleteUser, getUsersAttendanceReport, getUsersAttendance } from '../controller/userController';
import { login, loginAdmin, approveUser as AdminApprove } from '../controller/adminController';
dotenv.config()
const userAPI = express()

userAPI.post('/register', register);
userAPI.get('/users', getUsers);
userAPI.post('/attendance', attendanceLogin);
userAPI.get('/attendance', getAttendanceLogin);
userAPI.get('/attendance/user', getUserAttendance);
userAPI.get('/users-attendance', getUsersAttendance);
userAPI.get('/user/status', approveUser);
userAPI.post('/login', login);

//Admin
userAPI.post('/admin/login', loginAdmin);
userAPI.put('/admin/user/status',verifyToken, AdminApprove);
userAPI.get('/admin/user/attendance', getUserAttendance);
userAPI.get('/admin/users/attendances', getUsersWithAttendance);
userAPI.get('/admin/users', verifyToken, getAdminUsers);
userAPI.get('/admin/report/users', getUsersAttendanceReport);
userAPI.delete('/admin/user', verifyToken, deleteUser);

export default userAPI