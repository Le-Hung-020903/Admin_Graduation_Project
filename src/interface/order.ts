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

export interface IOrderPayload {
  user_id: number
  discount_id?: number
  address_id: number | null
  note: string
  payment_method: string
  final_price: number
  payment_status: string
  status: string
  order_details: {
    product_id: number
    variant_id: number
    quantity: number
    price: number
  }[]
}
export interface IWebsocketOrder {
  id: number
  title: string
  message: string
  is_read: boolean
  user_redirec_url: string | null
  admin_redirec_url: string | null
  receiver_role: "USER" | "ADMIN"
  user: {
    id: number
  }
  created_at: string
  updated_at: string
}
