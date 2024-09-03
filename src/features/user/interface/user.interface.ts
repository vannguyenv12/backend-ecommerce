export interface IUserCreateBody {
  email: string, password: string, firstName: string, lastName: string, avatar: string
}

export interface IUserUpdateBody {
  firstName: string, lastName: string, avatar: string
}

export interface IUserUpdatePasswordBody {
  currentPassword: string, newPassword: string, confirmNewPassword: string
}