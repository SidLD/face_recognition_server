
export interface IUser {
    _id: String | undefined,
    profile: Iimg,
    username:{
        firstName: String,
        middleName?: String,
        lastName: String,
    },
    contact: String,
    course: String,
    role: String ,
    password: String | undefined,
    status: StatusType
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
}