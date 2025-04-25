import { ICategory } from "./category"

export interface IImage {
  id: number
  url: string
}
export interface IUnit {
  id: number
  symbol: string
}
export interface IManufacturer {
  id: number
  name: string
  phone?: string
  email?: string
  address?: string
}

export interface IIngredient {
  id?: number
  name: string
  info: string
}

export interface IVariant {
  id?: number
  name: string
  price: number
  stock: number
  weight?: number | string
  liter?: number | string
  sku: string
  unit: IUnit | number
}

export interface IProduct {
  id: number
  name: string
  slug: string
  category: ICategory
  images: IImage[]
  variants: IVariant[]
  ingredients: IIngredient[]
  manufacturer: IManufacturer
  desc_markdown: string
  desc_html: string
}
export interface IProductFormData {
  id?: number
  name: string
  category_id: number
  variants: {
    id?: number
    name: string
    price: number
    stock: number
    weight?: number | string
    liter?: number | string
    sku: string
    unit_id: number
  }[]
  ingredients: {
    id?: number
    name: string
    info: string
  }[]
  manufacturer_id: number
  desc_markdown: string
  desc_html: string
}
