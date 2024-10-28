
export interface IUser {
    _id: String,
    profile: Iimg,
    username:{
        firstName: String,
        middleName?: String,
        lastName: String,
    },
    contact: String,
    course: String,
    role: String ,
    schoolId: String ,
    password: String | undefined,
    status: StatusType,
    applicationAttempt: Number,
    companyId: String,
    isCompanyApprove: Boolean,
}

export interface ICompany {
    save(): unknown
    _id: String | undefined,
    name: String,
    address: String,
    contactNumber: String,
    email: String,
    createdAt: Date,
    updatedAt: Date,
    employees: IUser[]
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
    timeInImg: Iimg,
    timeOutImg: Iimg,
    date: Date
    timeIn: Date,
    timeOut: Date,
    company: ICompany
}