interface IPermission {
  id: number
  value: string
}

export interface IROLE {
  id: number
  name: string
  created_at: string
  permissions: IPermission[]
}
export interface IUser {
  id?: number
  name: string
  email: string
  password?: string
  status: boolean
  avatar: string | null
  phone: string
  roles: IROLE[]
  created_at?: string
}
