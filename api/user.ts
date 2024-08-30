import express from 'express'
import dotenv from 'dotenv'
import { verifyToken } from '../util/verify';
import { getUsers, register } from '../controller/userController';
dotenv.config()
const userAPI = express()

userAPI.post('/register', register);
userAPI.get('/users', getUsers);


export default userAPI