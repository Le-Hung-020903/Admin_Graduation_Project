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
