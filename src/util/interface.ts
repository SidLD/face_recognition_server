import { IUserAttachment } from "../models/userAttachmentSchema"

export interface IUser {
    _id: String,
    profile: Iimg,
    username:{
        firstName: String,
        middleName?: String,
        lastName: String,
    },
    activeStatus: boolean,
    contact: String,
    course: String,
    role: String ,
    schoolId: String ,
    password: String | undefined,
    status: StatusType,
    applicationAttempt: Number,
    companyId: String,
    isCompanyApprove: Boolean,
    requiredHours:number,
    service_time: {
        hour: number,
        minute: number
    },
    attachments: [
        IUserAttachment
    ]
}

export interface ICompany {
    _id: String | undefined,
    name: String,
    address: String,
    contactNumber: String,
    email: String,
    createdAt: Date,
    updatedAt: Date,
    employees: IUser[]
    internCount: number
}

export enum StatusType {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    DECLINED = 'DECLINED'
}

export interface Iimg {
    _id: String | undefined,
    user: IUser,
    path: string,
    name: string,
    imageType: string
    fullPath: string,
    base64: any
}

export interface UserAttendance {
    loginType: string
    _id: string | undefined,
    user: IUser,
    timeInImgAM: Iimg,
    timeOutImgAM: Iimg,
    timeInImgPM: Iimg,
    timeOutImgPM: Iimg,
    date: Date
    timeInAM: Date,
    timeOutAM: Date,
    timeInPM: Date,
    timeOutPM: Date,
    company: ICompany,
    service_time: {
        hour: number,
        minute: number
    }
}