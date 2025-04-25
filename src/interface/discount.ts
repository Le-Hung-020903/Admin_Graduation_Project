export interface IDiscount {
  id?: number
  start_date: string
  end_date: string
  content: string
  percent: number
  code_discount: string
  created_at?: string
}
