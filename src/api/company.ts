import express from 'express'
import dotenv from 'dotenv'
import { verifyToken } from '../util/verify';
import { applyToCompany, approveCompanyApplication, createCompany, getCompany, getCompanyAttendance, getPendingApplication, searchCompanies, updateCompany } from '../controller/companyController';
dotenv.config()
const companyAPI = express()

companyAPI.get('/companies/:id', getCompany);
companyAPI.get('/companies', searchCompanies)
companyAPI.post('/admin/companies',verifyToken, createCompany);
companyAPI.put('/admin/companies/:id',verifyToken, updateCompany);
companyAPI.post('/admin/approve-company',verifyToken, approveCompanyApplication);

companyAPI.post('/user/apply-company', applyToCompany);
companyAPI.get('/admin/companies/pending-aplication',verifyToken, getPendingApplication)
companyAPI.get('/admin/companies/:id/attendance',verifyToken, getCompanyAttendance)

export default companyAPI