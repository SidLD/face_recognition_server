import express from 'express'
import dotenv from 'dotenv'
import { verifyToken } from '../util/verify';
import { applyToCompany, approveCompanyApplication, createCompany, updateCompany } from '../controller/companyController';
dotenv.config()
const companyAPI = express()

companyAPI.post('/admin/company',verifyToken, createCompany);
companyAPI.put('/admin/company',verifyToken, updateCompany);

companyAPI.post('/user/apply-company',verifyToken, applyToCompany);
companyAPI.post('/user/approve-company',verifyToken, approveCompanyApplication);

export default companyAPI