import mongoose from "mongoose";
import userSchema from "../models/userSchema";
import { IUser, StatusType, UserAttendance } from "../util/interface";
import bcrypt from 'bcrypt'
import userAttendanceSchema from "../models/userAttendanceSchema";


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
        role: params.role,
        schoolId: params.schoolId,
        password: hashedPassword,
        profile: {
          base64: profile
        },
        status: StatusType.PENDING
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

export const getAdminUsers = async (req: any, res: any) => {
  try {
      const users = await userSchema.find({
        role: {
          $ne: 'ADMIN'
        }
      }).select('-password -profile');
      res.status(200).send(JSON.stringify(users))

  } catch (error: any) {
      console.log(error.message)
      res.status(400).send({message:"Invalid Data or Email Already Taken"})
  }
}

export const attendanceLogin = async (req: any, res: any) => {
  try {
      const { id, imgPath, loginType, datetime } = req.body;
    
      const user: IUser | null = await userSchema.findOne({_id: new mongoose.Types.ObjectId(id)})
      if(!user){
        return res.status(400).json({ error: 'User Does Not Exist' });
      }

      if(user.status == StatusType.PENDING){
        return res.status(400).json({ error: 'User is still Pending' });
      }
      
      const now = new Date();
      const startOfToday = new Date(now.setHours(0, 0, 0, 0));
      const endOfToday = new Date(now.setHours(23, 59, 59, 999));

      const record: UserAttendance | null = await userAttendanceSchema.findOne({
        user: {
          _id:  new mongoose.Types.ObjectId(id)
        },
        date: {
          $gte: startOfToday,
          $lte: endOfToday,
        }
      })

      let attendanceRecord : UserAttendance | null = null;

      if(record){
        if(loginType == 'TIME_IN' ){
          if(!record.timeIn){
            attendanceRecord = await userAttendanceSchema.findOneAndUpdate({
              _id: new mongoose.Types.ObjectId(record._id)
            }, {
              timeInImg: imgPath,
              timeIn: datetime
            },
            {new :true}
            )
          }else{
            return res.status(400).json({ error: 'User Already Checked In' });
          }
        }else {
            attendanceRecord = await userAttendanceSchema.findOneAndUpdate({
              _id: new mongoose.Types.ObjectId(record._id)
            }, {
              timeOutImg: imgPath,
              timeOut: datetime
            },
            {new :true}
          )
        }
      }else{
        if(loginType == 'TIME_IN'){
          attendanceRecord = await userAttendanceSchema.create({
            timeInImg: imgPath,
            loginType: loginType,
            user: {
              _id:  new mongoose.Types.ObjectId(id)
            },
            timeIn: datetime
          })
        }else if(loginType == 'TIME_OUT'){
          attendanceRecord = await userAttendanceSchema.create({
            timeOutImg: imgPath,
            loginType: loginType,
            user: {
              _id:  new mongoose.Types.ObjectId(id)
            },
            timeOut: datetime
          })
        }
      }
     
      return res.status(200).json({message: "Success" });

  } catch (error: any) {
      console.log(error.message)
      res.status(400).send({message:"Invalid Data or Email Already Taken"})
  }
}

export const getAttendanceLogin = async (req: any, res: any) => {
  try {
      const { datetime } = req.query;
      const now = new Date(datetime);
      const startOfToday = new Date(now.setHours(0, 0, 0, 0));
      const endOfToday = new Date(now.setHours(23, 59, 59, 999));

      const attendanceRecords = await userAttendanceSchema.aggregate([
        {
          $match: {
            date: {
              $gte: startOfToday,
              $lte: endOfToday,
            },
          },
        },
        {
          $lookup: {
            from: 'users', // Ensure this is the correct collection name
            localField: 'user',
            foreignField: '_id',
            as: 'user',
          },
        },
        {
          $unwind: '$user',
        },
        {
          $match: {
            'user.role': { $ne: 'ADMIN' },
          },
        },
        {
          $project: {
            'user.password': 0,
            'user.profile': 0,
          },
        },
        {
          $sort: { _id: 1 },
        },
      ]);
  
      return res.status(200).send({data: attendanceRecords})

  } catch (error: any) {
      console.log(error.message)
      res.status(400).send({message:"Invalid Data"})
  }
}

export const getUserAttendance = async (req: any, res: any) => {
  try {
      const {user, datetime} = req.query;

      let condition:any = {
        _id: new mongoose.Types.ObjectId(user),
      }

      if(datetime){
        const now = new Date(datetime);
        const startOfToday = new Date(now.setHours(0, 0, 0, 0));
        const endOfToday = new Date(now.setHours(23, 59, 59, 999));
        condition.date = {
          $gte: startOfToday,
          $lte: endOfToday,
        }
      }
      console.log(condition)
      const attendances = await userAttendanceSchema.find(condition).sort({createdAt: -1}).populate('user')
      res.status(200).send(JSON.stringify(attendances))
  } catch (error: any) {
      console.log(error.message)
      res.status(400).send({message:"Invalid Data or Email Already Taken"})
  }
}

export const getUsersWithAttendance = async (req: any, res: any) => {
  try {
      const {datetime} = req.query;

      let condition:any = {}

      if(datetime){
        const now = new Date(datetime);
        const startOfToday = new Date(now.setHours(0, 0, 0, 0));
        const endOfToday = new Date(now.setHours(23, 59, 59, 999));
        condition.date = {
          $gte: startOfToday,
          $lte: endOfToday,
        }
      }else{
        const now = new Date();
        const startOfToday = new Date(now.setHours(0, 0, 0, 0));
        const endOfToday = new Date(now.setHours(23, 59, 59, 999));
        condition.date = {
          $gte: startOfToday,
          $lte: endOfToday,
        }
      }
      const attendances = await userAttendanceSchema.find({
        ...condition,
        'user.role': { $ne: 'ADMIN' } 
      }).sort({createdAt: -1}).populate('user').select('-password -profile')
      res.status(200).send(JSON.stringify(attendances))
  } catch (error: any) {
      console.log(error.message)
      res.status(400).send({message:"Invalid Data or Email Already Taken"})
  }
}

export const approveUser = async (req: any, res: any) => {
  try {
      const {user, status} = req.body;

     if(user && status){
      const data = await userSchema.updateOne({ _id: new mongoose.Types.ObjectId(user)}, {
        status: status.toUpperCase()
      })
      res.status(200).send(JSON.stringify(data))
     }else{
      res.status(400).send({message:"User and Status are Required"})
     }
  } catch (error: any) {
      console.log(error.message)
      res.status(400).send({message:"Invalid Data"})
  }
}

export const deleteUser = async (req: any, res: any) => {
  try {
      const {userId} = req.body;
     if(userId){
      const data = await userSchema.findByIdAndDelete(userId)
      return res.status(200).send(data)
     }else{
      return res.status(400).send({message:"User Id is Required"})
     }
  } catch (error: any) {
      console.log(error.message)
      res.status(400).send({message:"Invalid Data"})
  }
}


export const getUsersAttendanceReport = async (req: any, res: any) => {
  try {
      const {startDate, endDate} = req.query;

      let condition:any = {}

      if(startDate){
        const now = new Date(startDate);
        const startOfToday = new Date(now.setHours(0, 0, 0, 0));
        condition.date = {
          $gte: startOfToday,
        }
      }

      if(endDate){
        const now = new Date(endDate);
        const endOfToday = new Date(now.setHours(23, 59, 59, 999));
        condition.date = {
          $lte: endOfToday,
        }
      }

      const attendances = await userAttendanceSchema.find({
        ...condition,
        'user.role': { $ne: 'ADMIN' },
      })
      .sort({ createdAt: -1 })
      .populate({
        path: 'user',
        select: '-password -profile', // Exclude sensitive fields
      });
      res.status(200).send(JSON.stringify(attendances))
  } catch (error: any) {
      console.log(error.message)
      res.status(400).send({message:"Invalid Data or Email Already Taken"})
  }
}


