
export interface IUser {
    _id: String | undefined,
    profile: Iimg,
    username:{
        firstName: String,
        middleName?: String,
        lastName: String,
    },
    email: String,
    role: RoleType,
    password: String | undefined,
}

export enum RoleType {
    ADMIN,
    USER,
}

export enum LoginType {
    TIME_IN,
    TIME_OUT
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
    _id: string | undefined,
    user: IUser,
    attendance: AttendanceSetting,
    type: LoginType,
    img: Iimg,
    date: Date
    timeIn: Date,
    timeOut: Date
}

export interface AttendanceSetting {
    _id: string | undefined,
    status: boolean,
    timeIn: {
        start: Date,
        end: Date
    },
    timeOut: {
        start: Date,
        end: Date
    }
}

