import express from 'express'
import dotenv from 'dotenv'
import { verifyToken } from '../util/verify';
import { applyToCompany, approveCompanyApplication, createCompany, updateCompany } from '../controller/companyController';
dotenv.config()
const companyAPI = express()

companyAPI.get('/companies/:id', updateCompany);
companyAPI.post('/admin/companies',verifyToken, createCompany);
companyAPI.put('/admin/companies/:id',verifyToken, updateCompany);

companyAPI.post('/user/apply-company',verifyToken, applyToCompany);
companyAPI.post('/user/approve-company',verifyToken, approveCompanyApplication);

export default companyAPI