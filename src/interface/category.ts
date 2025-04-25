// Định nghĩa kiểu dữ liệu cho một dòng (RowData)
export interface ICategory {
  id: number
  name: string
  desc?: string
  parent?: {
    id: number
    name: string
    desc: string | null
    slug: string
  }
  slug?: string
}
export interface pagination {
  total: number
  page: number
  limit: number
  totalPages: number
}
