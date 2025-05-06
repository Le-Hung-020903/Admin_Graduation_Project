export interface IUser {
  id?: number
  name: string
  email: string
  password?: string
  status: boolean
  avatar: string | null
  phone: string
  created_at?: string
}
