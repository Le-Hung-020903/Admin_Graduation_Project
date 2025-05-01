import { IDiscount } from "../interface/discount"
import { IProductFormData } from "../interface/product"
import authorizedAxiosInstance from "../utils/axios"
import { IAction } from "../interface/module"
import { IUser } from "../interface/user"
import { IAddress } from "../interface/order"

// PRODUCT
export const createProductAPI = async (
  data: IProductFormData,
  files: File[]
) => {
  const formData = new FormData()

  // Thêm các trường dữ liệu vào form data
  formData.append("name", data.name)
  formData.append("category_id", data.category_id.toString())
  formData.append("manufacturer_id", data.manufacturer_id.toString())
  formData.append("desc_html", data.desc_html)
  formData.append("desc_markdown", data.desc_markdown)

  // Thêm các biển thể
  data.variants.forEach((variant, index) => {
    formData.append(`variants[${index}][name]`, variant.name)
    formData.append(`variants[${index}][price]`, variant.price.toString())
    formData.append(`variants[${index}][stock]`, variant.stock.toString())
    formData.append(
      `variants[${index}][weight]`,
      (variant.weight ?? "").toString()
    )
    formData.append(
      `variants[${index}][liter]`,
      (variant.liter ?? "").toString()
    )
    formData.append(`variants[${index}][sku]`, variant.sku)
    formData.append(`variants[${index}][unit_id]`, variant.unit_id.toString())
  })

  // Thêm các nguyên liệu
  data.ingredients.forEach((ingredient, index) => {
    formData.append(`ingredients[${index}][name]`, ingredient.name)
    formData.append(`ingredients[${index}][info]`, ingredient.info)
  })

  files.forEach((file) => {
    formData.append("files", file)
  })

  const res = await authorizedAxiosInstance.post("/product/create", formData, {
    headers: {
      "Content-Type": "multipart/form-data" // Ghi đè Content-Type
    }
  })
  return res.data
}
export const updateProductAPI = async (
  data: IProductFormData,
  files: File[]
) => {
  const formData = new FormData()

  // Thêm các trường dữ liệu vào form data
  formData.append("id", (data.id ?? "").toString())
  formData.append("name", data.name)
  formData.append("category_id", data.category_id.toString())
  formData.append("manufacturer_id", data.manufacturer_id.toString())
  formData.append("desc_html", data.desc_html)
  formData.append("desc_markdown", data.desc_markdown)

  // Thêm các biển thể
  data.variants.forEach((variant, index) => {
    formData.append(`variants[${index}][id]`, (variant.id ?? "").toString())
    formData.append(`variants[${index}][name]`, variant.name)
    formData.append(`variants[${index}][price]`, variant.price.toString())
    formData.append(`variants[${index}][stock]`, variant.stock.toString())
    formData.append(
      `variants[${index}][weight]`,
      (variant.weight ?? "").toString()
    )
    formData.append(
      `variants[${index}][liter]`,
      (variant.liter ?? "").toString()
    )
    formData.append(`variants[${index}][sku]`, variant.sku)
    formData.append(`variants[${index}][unit_id]`, variant.unit_id.toString())
  })

  // Thêm các nguyên liệu
  data.ingredients.forEach((ingredient, index) => {
    formData.append(
      `ingredients[${index}][id]`,
      (ingredient.id ?? "").toString()
    )
    formData.append(`ingredients[${index}][name]`, ingredient.name)
    formData.append(`ingredients[${index}][info]`, ingredient.info)
  })

  files.forEach((file) => {
    formData.append("files", file)
  })

  const res = await authorizedAxiosInstance.patch(
    `/product/${data.id}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data" // Ghi đè Content-Type
      }
    }
  )
  return res.data
}
export const deleteProductAPI = async (id: number) => {
  const res = await authorizedAxiosInstance.delete(`/product/${id}`)
  return res.data
}

// DISCOUNT
export const getDiscountAPI = async (page: number, limit: number) => {
  const res = await authorizedAxiosInstance.get(
    `/discount?_page=${page}&_limit=${limit}`
  )
  return res.data
}
export const createDiscountAPI = async (data: IDiscount) => {
  const res = await authorizedAxiosInstance.post("/discount/create", data)
  return res.data
}
export const deleteDiscountAPI = async (id: number) => {
  const res = await authorizedAxiosInstance.delete(`/discount/${id}`)
  return res.data
}
export const updateDiscountAPI = async (id: number, data: IDiscount) => {
  const res = await authorizedAxiosInstance.patch(`/discount/${id}`, data)
  return res.data
}

// MODULES
export const getModulesAPI = async () => {
  const res = await authorizedAxiosInstance.get("/modules")
  return res.data
}
export const createModulesAPI = async (data: IAction) => {
  const res = await authorizedAxiosInstance.post("/modules/create", data)
  return res.data
}

//ROLES
export const getRoleAPI = async () => {
  const res = await authorizedAxiosInstance.get("/role")
  return res.data
}
export const getRoleDetailAPI = async (id: number) => {
  const res = await authorizedAxiosInstance.get(`role/${id}`)
  return res.data
}
export const createPermissionAPI = async (data: {
  name: string
  permissions: string[]
}) => {
  const res = await authorizedAxiosInstance.post("/permission/create", data)
  return res.data
}
export const updatePermissionsAPI = async (
  data: {
    name: string
    permissions: string[]
  },
  id: number
) => {
  const res = await authorizedAxiosInstance.patch(`/permission/${id}`, data)
  return res.data
}
export const deleteRoleAPI = async (id: number) => {
  const res = await authorizedAxiosInstance.delete(`/role/${id}`)
  return res.data
}

//USER
export const getUserAPI = async (page: number, limit: number) => {
  const res = await authorizedAxiosInstance.get(
    `/user?_page=${page}&_limit=${limit}`
  )
  return res.data
}
export const createUserAPI = async (data: IUser) => {
  const res = await authorizedAxiosInstance.post("/user/create", data)
  return res.data
}
export const updateUserAPI = async (data: IUser, id: number) => {
  const res = await authorizedAxiosInstance.patch(`/user/${id}`, data)
  return res.data
}

// ORDER
export const getOrderAPI = async (
  page: number,
  limit: number,
  sort: string,
  status?: string
) => {
  let url = `/order/get_all?_page=${page}&_limit=${limit}&_sort=${sort}`
  if (status) {
    url += `&_status=${status}`
  }

  const res = await authorizedAxiosInstance.get(url)
  return res.data
}
export const getOrderDetailAPI = async (id: number) => {
  const res = await authorizedAxiosInstance.get(`/order/${id}`)
  return res.data
}
export const updateOrderAPI = async (
  id: number,
  data: { note?: string; status?: string; address_id?: number }
) => {
  const res = await authorizedAxiosInstance.patch(
    `order/update_status/${id}`,
    data
  )
  return res.data
}
//ADDRESS
export const getAddressAPI = async () => {
  const res = await authorizedAxiosInstance.get("/address/get_all")
  return res.data
}
export const createAddressAPI = async (data: IAddress) => {
  const res = await authorizedAxiosInstance.post("/address/create", data)
  return res.data
}
