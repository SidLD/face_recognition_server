import express from 'express'
import dotenv from 'dotenv'
import { verifyToken } from '../util/verify';
import { attendanceLogin, getAttendanceLogin, getUsers, register, getUserAttendance } from '../controller/userController';
dotenv.config()
const userAPI = express()

userAPI.post('/register', register);
userAPI.get('/users', getUsers);
userAPI.post('/attendance', attendanceLogin);
userAPI.get('/attendance', getAttendanceLogin);
userAPI.get('/attendance/user', getUserAttendance);


export default userAPI