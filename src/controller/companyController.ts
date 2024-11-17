import { Request, Response } from "express";
import mongoose from "mongoose";
import { IUser, ICompany,  } from "../util/interface";
import UserModel from "../models/userSchema"; 
import CompanyModel from "../models/companySchema"; 
import { createNotification } from "./notificationController";
import userAttendanceSchema from "../models/userAttendanceSchema";

export const createCompany = async (req: any, res: any) => {
  try {
    const { name, address, contactNumber, email } = req.body;
    if(req.user.role != 'ADMIN'){
        return res.status(404).json({ error: "Access Denied" });
    }
    if (!name || !address || !contactNumber || !email ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newCompany = await CompanyModel.create({
      name,
      address,
      contactNumber,
      email,
      employees: [],
    });

    res.status(200).json({ newCompany });
  } catch (error: any) {
    console.log(error.message);
    res.status(400).json({ message: "Failed to create company" });
  }
};

export const applyToCompany = async (req: any, res: any) => {
  try {
    const { companyId, userId } = req.body;

    if (!companyId || !userId) {
      return res.status(400).json({ error: "Company ID and User ID are required" });
    }

    const user: IUser | null = await UserModel.findById(userId);
    const company: ICompany | null = await CompanyModel.findById(companyId)

    if (!user || !company) {
      return res.status(404).json({ error: "User or Company not found" });
    }

    if(Number(user.applicationAttempt) >= 3){
      return res.status(404).json({ error: "No more attemp left for application" });
    }

    if(user.companyId && user.isCompanyApprove){
        return res.status(400).json({ error: "User is already an intern of a company" });
    }

    let employees = company.employees;
    if (user && user._id) {
        const isAlreadyEmployee = company.employees.some(
            (empId) => empId.toString() === user._id.toString()
          );
        if (isAlreadyEmployee) {
          return res.status(400).json({ error: "User had already apply to this company" });
        }else{
            employees.push(user)
            await UserModel.updateOne({
                _id: user._id,
            }, {
                isCompanyApprove: false,
                companyId: company._id,
                applicationAttempt: Number(user.applicationAttempt) + 1
            })

            await CompanyModel.updateOne(
                { _id: company._id }, { employees }
            )
        
            return res.status(200).json({ message: "Application to company is pending approval" });
        }
    }

  } catch (error: any) {
    console.log(error);
    res.status(400).json({ message: "Failed to apply to company" });
  }
};

export const approveCompanyApplication = async (req: any, res: any) => {
    try {
        const { companyId, userId , status} = req.body;
    
        if (!companyId || !userId) {
            return res.status(400).json({ error: "Company ID and User ID are required" });
        }
    
        const user: IUser | null = await UserModel.findById(userId);
        const company: ICompany | null = await CompanyModel.findById(companyId);
    
        if (!user || !company) {
            return res.status(404).json({ error: "User or Company not found" });
        }

        const isAlreadyEmployee = company.employees.some(
            (empId) => empId.toString() === user._id.toString()
        );

        let employees = company.employees;

        if (!isAlreadyEmployee) {
            return res.status(400).json({ error: "User does not exist or have not applied to this Company" });
        }
    
        if(status == false){
            employees = employees.filter(
                (empId) => empId.toString() !== user._id.toString()
            );            

            await UserModel.updateOne({
                _id: user._id,
            }, {
                isCompanyApprove: false,
                companyId: null
            })
        
            await CompanyModel.updateOne(
                { _id: company._id }, { employees}
            )
            await createNotification({
              userid: user._id,
              companyid: company._id as string,
              title: "Application Decline",
              description: `Your Application to Company ${company.name} has been declined!`,
            });
            return res.status(200).json({ message: "Application to company has been deleted" });
        }else{
            await UserModel.updateOne({
                _id: user._id,
            }, {
                isCompanyApprove: status,
            })
            await createNotification({
              userid: user._id,
              companyid: company._id as string,
              title: "Application Approve",
              description: `Your Application to Company ${company.name} has been approved!`,
            });
            return res.status(200).json({ message: "Application to company has been approve" });
        }
    } catch (error: any) {
      console.log(error.message);
      res.status(400).json({ message: "Failed to approve user" });
    }
};

export const updateCompany = async (req: any, res: any) => {
    try {
      const { name, address, contactNumber, email } = req.body;
      const {id} = req.params;
      if (req.user.role !== "ADMIN") {
        return res.status(403).json({ error: "Access Denied" });
      }
  
      if (!id) {
        return res.status(400).json({ error: "Company ID is required" });
      }
  
      const company = await CompanyModel.findById(id);
      if (!company) {
        return res.status(404).json({ error: "Company not found" });
      }
  
      company.name = name ?? company.name;
      company.address = address ?? company.address;
      company.contactNumber = contactNumber ?? company.contactNumber;
      company.email = email ?? company.email;
  
      await company.save();
  
      res.status(200).json({ message: "Company updated successfully", company });
    } catch (error: any) {
      console.error(error.message);
      res.status(400).json({ message: "Failed to update company" });
    }
};

export const getCompany = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    let condition:any = {}
    if(id != 'all'){
      condition._id = id
    }
    const companies:any = await CompanyModel.find(condition).populate({
      path: 'employees',
      select: 'username',
    });
    if (companies.length == 0) {
      return res.status(404).json({ error: "Company not found" });
    }
    res.status(200).json(companies);
  } catch (error: any) {
    console.log(error.message);
    res.status(400).json({ message: "Failed to retrieve company" });
  }
};

export const searchCompanies = async (req: any, res: any) => {
  try {
    const { search } = req.query;
    const companies = await CompanyModel.find({
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { contactNumber: { $regex: search, $options: 'i' } },
      ],
    });

    res.status(200).json({ companies });
  } catch (error: any) {
    console.log(error.message);
    res.status(400).json({ message: "Failed to search companies" });
  }
};

export const getPendingApplication = async (req: any, res: any) => {
  try {
    const pendingApplications = await UserModel.find({
      companyId: { $ne: null }, 
      isCompanyApprove: false, 
      role: {$ne: 'ADMIN'}
    }).populate('companyId', 'name _id');
    res.status(200).json(pendingApplications);
  } catch (error: any) {
    console.log(error.message);
    res.status(400).json({ message: "Failed to retrieve company" });
  }
};

export const getCompanyAttendance = async (req: any, res: any) => {
  try {
    const { datetime } = req.query;
    const { id } = req.params; 
    console.log(datetime, id);

    let condition: any = {
      company: new mongoose.Types.ObjectId(id), 
    };

    if (datetime) {
      const now = new Date(datetime);
      const startOfToday = new Date(now.setHours(0, 0, 0, 0));
      const endOfToday = new Date(now.setHours(23, 59, 59, 999));
      condition.date = {
        $gte: startOfToday,
        $lte: endOfToday,
      };
    }

    const attendances = await userAttendanceSchema.find(condition)
      .sort({ createdAt: -1 })
      .populate({
        path: 'user',
        select: 'username course'
      })
      .populate('company'); 

    res.status(200).send(JSON.stringify(attendances));
  } catch (error: any) {
    console.log(error.message);
    res.status(400).send({ message: "Invalid Data or Email Already Taken" });
  }
}
