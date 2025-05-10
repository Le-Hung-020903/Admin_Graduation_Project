import {
  createBrowserRouter,
  LoaderFunctionArgs,
  Navigate,
  Outlet,
  RouterProvider
} from "react-router-dom"
import Layout from "./components/Layout"
import Product from "./page/product/Product"
import Home from "./page/home/Home"
import ProductDetail from "./page/product/productDetail/ProductDetail"
import Category from "./page/category/Category"
import Order from "./page/order/Order"
import OrderDetail from "./page/order/orderDetail/OrderDetail"
import Discount from "./page/discount/Discount"
import Role from "./page/role/Role"
import authorizedAxiosInstance from "./utils/axios"
import Login from "./page/login/Login"
import ProductCreate from "./page/product/create/ProductCreate"
import CreateRole from "./page/role/CreateRole/CreateRole"
import EditRole from "./page/role/EditRole/EditRole"
import Modules from "./page/modules/Modules"
import User from "./page/user/User"
import CreateOrder from "./page/order/create/CreateOrder"
import { useDispatch, useSelector } from "react-redux"
import { selectPermission } from "./redux/slice/permission.slice"
import { useEffect, useState } from "react"
import { AppDispatch } from "./redux/store"
import { getPermissionAPI } from "./redux/middleware/permission.middleware"
import { hasPermissionToModule } from "./utils/checkPermission"
import { selectUSer, setUser } from "./redux/slice/user.middleware"

const App = () => {
  const dispatch = useDispatch<AppDispatch>()
  const permissions = useSelector(selectPermission)
  const user = useSelector(selectUSer)
  const [loading, setLoading] = useState<boolean>(true) // Trạng thái loading để đợi user được xác định

  const protectedRouter = () => {
    if (!user) return <Navigate to={"/login"} replace={true} />
    return <Outlet />
  }

  useEffect(() => {
    const userLocal = JSON.parse(localStorage.getItem("user") || "null")
    if (userLocal && !user) {
      dispatch(setUser(userLocal))
    }
    setLoading(false) // Sau khi đã set user xong, thay đổi trạng thái loading
  }, [dispatch, user])

  useEffect(() => {
    if (permissions.length === 0) dispatch(getPermissionAPI())
  }, [dispatch, permissions])

  if (loading) return null // đợi đến khi user được xác định
  const router = createBrowserRouter([
    {
      path: "/",
      element: protectedRouter(),
      children: [
        {
          path: "/",
          element: <Layout />,
          children: [
            { index: true, element: <Home /> },
            {
              path: "product",
              element: hasPermissionToModule(permissions, "products") ? (
                <Product />
              ) : (
                <Navigate to="/" />
              )
            },
            {
              path: "product/create",
              element: permissions.includes("products.insert") ? (
                <ProductCreate />
              ) : (
                <Navigate to="/" />
              )
            },
            {
              path: "product/:id",
              element: permissions.includes("products.read") ? (
                <ProductDetail />
              ) : (
                <Navigate to="/" />
              ),
              loader: async (params: LoaderFunctionArgs<{ id: string }>) => {
                const res = await authorizedAxiosInstance.get(
                  `/product/${params.params.id}`
                )
                return res.data.data
              }
            },
            {
              path: "category",
              element: hasPermissionToModule(permissions, "categories") ? (
                <Category />
              ) : (
                <Navigate to="/" />
              )
            },
            {
              path: "order",
              element: hasPermissionToModule(permissions, "orders") ? (
                <Order />
              ) : (
                <Navigate to="/" />
              ),
              loader: async () => {
                const res = await authorizedAxiosInstance.get("/order")
                return res.data.data
              }
            },
            {
              path: "order/create",
              element: permissions.includes("orders.insert") ? (
                <CreateOrder />
              ) : (
                <Navigate to="/" />
              )
            },
            {
              path: "order/:id",
              element: permissions.includes("orders.read") ? (
                <OrderDetail />
              ) : (
                <Navigate to="/" />
              )
            },
            {
              path: "discount",
              element: hasPermissionToModule(permissions, "discounts") ? (
                <Discount />
              ) : (
                <Navigate to="/" />
              )
            },
            {
              path: "roles",
              element: hasPermissionToModule(permissions, "roles") ? (
                <Role />
              ) : (
                <Navigate to="/" />
              ),
              loader: async () => {
                const res = await authorizedAxiosInstance.get("/role")
                return res.data.data
              }
            },
            {
              path: "roles/edit/:id",
              element: permissions.includes("roles.update") ? (
                <EditRole />
              ) : (
                <Navigate to="/" />
              )
            },
            {
              path: "roles/create",
              element: permissions.includes("roles.insert") ? (
                <CreateRole />
              ) : (
                <Navigate to="/" />
              )
            },
            {
              path: "users",
              element: hasPermissionToModule(permissions, "users") ? (
                <User />
              ) : (
                <Navigate to="/" />
              )
            },
            { path: "modules", element: <Modules /> }
          ]
        }
      ]
    },
    {
      path: "/login",
      element: user ? <Navigate to="/" replace /> : <Login />
    }
  ])

  return <RouterProvider router={router} />
}

export default App
