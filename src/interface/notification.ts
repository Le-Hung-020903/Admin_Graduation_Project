export interface INotifications {
  id: number
  title: string
  message: string
  is_read: boolean
  user_redirec_url: string | null
  admin_redirec_url: null
  created_at: string
  receiver_role: "USER"
}
