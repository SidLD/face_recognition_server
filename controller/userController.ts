import mongoose from "mongoose";
import userSchema from "../models/userSchema";
import { IUser } from "../util/interface";
import bcrypt from 'bcrypt'


export const register = async (req: any, res: any) => {
    try {
        const { profile } = req.body;
        let params:IUser = req.body

        if (!params.username.firstName || !params.username.lastName || !profile) {
          return res.status(400).json({ error: 'First name, and last name are required' });
        }
      
        const user:{
          email: string
        } | null = await userSchema.findOne({email: params.email})

      if(user){
        return res.status(400).json({ error: 'User Already Exist' });
      }

      const hashedPassword = await bcrypt.hash(params.password.toString(), 10)
      const newUser = await userSchema.create({
        email: params.email,
        username:{
          firstName: params.username.firstName,
          middleName: params.username.middleName,
          lastName: params.username.lastName
        },
        password: hashedPassword,
        profile: {
          base64: profile
        }
      })
      res.status(200).send({newUser})

    } catch (error: any) {
        console.log(error.message)
        res.status(400).send({message:"Invalid Data or Email Already Taken"})
    }
}
export const getUsers = async (req: any, res: any) => {
    try {
        const users = await userSchema.find({}).select('-password');
        res.status(200).send(JSON.stringify(users))

    } catch (error: any) {
        console.log(error.message)
        res.status(400).send({message:"Invalid Data or Email Already Taken"})
    }
}