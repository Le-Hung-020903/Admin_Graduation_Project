export interface IRole {
  id: number
  name: string
  permissions?: permission[]
  created_at: string
}
export interface permission {
  id?: number
  value: string
}
