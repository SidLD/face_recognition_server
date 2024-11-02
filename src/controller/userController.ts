import mongoose from "mongoose";
import userSchema from "../models/userSchema";
import { ICompany, IUser, StatusType, UserAttendance } from "../util/interface";
import bcrypt from 'bcrypt'
import userAttendanceSchema from "../models/userAttendanceSchema";
import CompanyModel from "../models/companySchema"; // Import the Company model

export const register = async (req: any, res: any) => {
    try {
        const { profile } = req.body;
        let params:IUser = req.body

        if (!params.username.firstName || !params.username.lastName || !profile) {
          return res.status(400).json({ error: 'First name, and last name are required' });
        }
      
        const user:IUser | null = await userSchema.findOne({
          $or: [
            { contact: params.contact },
            { schoolId: params.schoolId }
          ]
        })

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
  
      const user: IUser | null = await userSchema.findOne({ _id: new mongoose.Types.ObjectId(id) });
      const companyData: ICompany | null = await CompanyModel.findById(user?.companyId);

      if (!user) {
          return res.status(400).json({ error: 'User Does Not Exist' });
      }

      if (!companyData) {
          return res.status(400).json({ error: "User needs to have a registered and approved company." });
      }

      if (user.status === StatusType.PENDING) {
          return res.status(400).json({ error: 'User is still Pending' });
      }

      const isAlreadyEmployee = companyData.employees.some(
          (empId) => empId.toString() === user._id.toString()
      );
      if (!isAlreadyEmployee || !(user.companyId && user.isCompanyApprove)) {
          return res.status(400).json({ error: "The user is either not part of this company or has not been approved." });
      }
      
      const now = new Date();
      const startOfToday = new Date(now.setHours(0, 0, 0, 0));
      const endOfToday = new Date(now.setHours(23, 59, 59, 999));

      const record: UserAttendance | null = await userAttendanceSchema.findOne({
          user: { _id: new mongoose.Types.ObjectId(id) },
          company: companyData,
          date: { $gte: startOfToday, $lte: endOfToday },
      });

      let attendanceRecord: UserAttendance | null = null;

      if (record) {
          if (loginType === 'TIME_IN_AM') {
              if (!record.timeInAM) {
                  attendanceRecord = await userAttendanceSchema.findOneAndUpdate(
                      { _id: new mongoose.Types.ObjectId(record._id) },
                      {
                          timeInImgAM: imgPath,
                          timeInAM: datetime,
                      },
                      { new: true }
                  );
              } else {
                  return res.status(400).json({ error: 'User Already Checked In for AM' });
              }
          } else if (loginType === 'TIME_IN_PM') {
              if (!record.timeInPM) {
                  attendanceRecord = await userAttendanceSchema.findOneAndUpdate(
                      { _id: new mongoose.Types.ObjectId(record._id) },
                      {
                          timeInImgPM: imgPath,
                          timeInPM: datetime,
                      },
                      { new: true }
                  );
              } else {
                  return res.status(400).json({ error: 'User Already Checked In for PM' });
              }
          } else if (loginType === 'TIME_OUT_AM') {
              if (!record.timeOutAM) {
                  attendanceRecord = await userAttendanceSchema.findOneAndUpdate(
                      { _id: new mongoose.Types.ObjectId(record._id) },
                      {
                          timeOutImgAM: imgPath,
                          timeOutAM: datetime,
                      },
                      { new: true }
                  );
              } else {
                  return res.status(400).json({ error: 'User Already Checked Out for AM' });
              }
          } else if (loginType === 'TIME_OUT_PM') {
              if (!record.timeOutPM) {
                  attendanceRecord = await userAttendanceSchema.findOneAndUpdate(
                      { _id: new mongoose.Types.ObjectId(record._id) },
                      {
                          timeOutImgPM: imgPath,
                          timeOutPM: datetime,
                      },
                      { new: true }
                  );
              } else {
                  return res.status(400).json({ error: 'User Already Checked Out for PM' });
              }
          }
      } else {
          const attendanceData = {
              user: { _id: new mongoose.Types.ObjectId(id) },
              company: new mongoose.Types.ObjectId(user.companyId as string),
          };

          if (loginType === 'TIME_IN_AM') {
              attendanceRecord = await userAttendanceSchema.create({
                  ...attendanceData,
                  timeInImgAM: imgPath,
                  timeInAM: datetime,
                  loginType,
              });
          } else if (loginType === 'TIME_IN_PM') {
              attendanceRecord = await userAttendanceSchema.create({
                  ...attendanceData,
                  timeInImgPM: imgPath,
                  timeInPM: datetime,
                  loginType,
              });
          } else if (loginType === 'TIME_OUT_AM') {
              attendanceRecord = await userAttendanceSchema.create({
                  ...attendanceData,
                  timeOutImgAM: imgPath,
                  timeOutAM: datetime,
                  loginType,
              });
          } else if (loginType === 'TIME_OUT_PM') {
              attendanceRecord = await userAttendanceSchema.create({
                  ...attendanceData,
                  timeOutImgPM: imgPath,
                  timeOutPM: datetime,
                  loginType,
              });
          }
      }
   
      return res.status(200).json({ message: "Success" });

  } catch (error: any) {
      console.log(error.message);
      res.status(400).send({ message: "Invalid Data or Email Already Taken" });
  }
};

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
            from: 'users', 
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
      const attendances = await userAttendanceSchema.find(condition).sort({createdAt: -1}).populate('user').populate('company')
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
      }).sort({createdAt: -1}).populate('user').select('-password -profile').populate('company')
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
      })
      .populate('company');
      res.status(200).send(JSON.stringify(attendances))
  } catch (error: any) {
      console.log(error.message)
      res.status(400).send({message:"Invalid Data or Email Already Taken"})
  }
}


