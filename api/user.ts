import express from 'express'
import dotenv from 'dotenv'
import { verifyToken } from '../util/verify';
import { register } from '../controller/userController';
dotenv.config()
const userAPI = express()

userAPI.post('/register', register);


export default userAPI