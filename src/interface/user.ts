export interface IUser {
  id?: number
  name: string
  email: string
  password?: string
  status: boolean
  phone: string
  created_at?: string
  roles?: number[]
}
