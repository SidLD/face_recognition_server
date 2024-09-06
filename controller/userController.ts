import mongoose from "mongoose";
import userSchema from "../models/userSchema";
import { IUser, LoginType, UserAttendance } from "../util/interface";
import bcrypt from 'bcrypt'
import userAttendanceSchema from "../models/userAttendanceSchema";


const DEFAULT_ATTENDANCE = "";

export const register = async (req: any, res: any) => {
    try {
        const { profile } = req.body;
        let params:IUser = req.body

        if (!params.username.firstName || !params.username.lastName || !profile) {
          return res.status(400).json({ error: 'First name, and last name are required' });
        }
      
        const user:{
          email: string
        } | null = await userSchema.findOne({email: params.contact, contact: params.contact})

      if(user){
        return res.status(400).json({ error: 'User Already Exist' });
      }
      const password = params.password ? params.password.toString() : 'password';
      const hashedPassword = await bcrypt.hash(password, 10)
      const newUser = await userSchema.create({
        username:{
          firstName: params.username.firstName,
          middleName: params.username.middleName,
          lastName: params.username.lastName
        },
        contact: params.contact,
        course: params.course,
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

export const attendanceLogin = async (req: any, res: any) => {
  try {
      const { id, imgPath, loginType, datetime } = req.body;
    
      const user: IUser | null = await userSchema.findOne({id: id})

      if(!user){
        return res.status(400).json({ error: 'User Does Not Exist' });
      }
      
      const now = new Date();
      const startOfToday = new Date(now.setHours(0, 0, 0, 0));
      const endOfToday = new Date(now.setHours(23, 59, 59, 999));

      const attendanceRecord: UserAttendance | null = await userAttendanceSchema.findOne({
        user: id,
        date: {
          $gte: startOfToday,
          $lte: endOfToday,
        }
      })

      if(attendanceRecord){
        let attendancRecord : UserAttendance | null = null;
        if(loginType == LoginType.TIME_OUT){
          attendancRecord = await userAttendanceSchema.create({
            attendance: DEFAULT_ATTENDANCE,
            img: imgPath,
            type: loginType,
            user: {
              id: id
            },
            date: datetime,
            timeOut: datetime
          })
          res.status(200).send({attendancRecord})
        }else{
          res.status(400).send({message: "Time In Override is disabled."})
        }
      }else{
        let attendancRecord : UserAttendance | null = null;
        if(loginType == LoginType.TIME_IN){
          attendancRecord = await userAttendanceSchema.create({
            attendance: DEFAULT_ATTENDANCE,
            img: imgPath,
            type: loginType,
            user: {
              id: id
            },
            timeIn: datetime
          })
        }else{
          attendancRecord = await userAttendanceSchema.create({
            attendance: DEFAULT_ATTENDANCE,
            img: imgPath,
            type: loginType,
            user: {
              id: id
            },
            date: datetime,
            timeOut: datetime
          })
        }
        res.status(200).send({attendancRecord})
      }

  } catch (error: any) {
      console.log(error.message)
      res.status(400).send({message:"Invalid Data or Email Already Taken"})
  }
}

export const getAttendanceLogin = async (req: any, res: any) => {
  try {
      const { datetime } = req.body;

      const now = new Date(datetime);
      const startOfToday = new Date(now.setHours(0, 0, 0, 0));
      const endOfToday = new Date(now.setHours(23, 59, 59, 999));

      const attendanceRecords: UserAttendance[] = await userAttendanceSchema.find({
        date: {
          $gte: startOfToday,
          $lte: endOfToday,
        }
      })
      return res.status(200).send({attendanceRecords})

  } catch (error: any) {
      console.log(error.message)
      res.status(400).send({message:"Invalid Data or Email Already Taken"})
  }
}
