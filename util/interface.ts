
export interface IUser {
    _id: String | undefined,
    profile: Iimg,
    username:{
        firstName: String,
        middleName?: String,
        lastName: String,
    },
    email: String,
    password: String,
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
