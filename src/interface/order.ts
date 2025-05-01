export interface IOrder {
  id: number
  status: string
  order_code: string
  final_price: string
  name: string
  payment_method: string
  product: {
    name: string
    images: {
      url: string
    }
  }
  more: string
}
interface Image {
  id: number
  url: string
}

interface Product {
  id: number
  name: string
  images: Image[]
}

interface Variant {
  id: number
  name: string
  price: number
}

interface OrderDetail {
  id: number
  quantity: number
  product: Product
  variant: Variant
}
interface User {
  email: string
}
export interface IAddress {
  id?: number
  name: string
  phone: string
  province: string
  district: string
  ward: string
  street: string
  is_default?: boolean
}

export interface IOrderDetail {
  id: number
  total_price: number
  final_price: number
  note: string
  user: User
  status: string
  order_code: string
  payment_method: string
  created_at: string
  orderDetails: OrderDetail[]
  address: IAddress
}
