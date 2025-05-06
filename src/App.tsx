import {
  createBrowserRouter,
  LoaderFunctionArgs,
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
import { useSelector } from "react-redux"
import { selectPermission } from "./redux/slice/permission.slice"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      {
        path: "product",
        element: <Product />
      },
      {
        path: "product/create",
        element: <ProductCreate />
      },
      {
        path: "product/:id",
        element: <ProductDetail />,
        loader: async (params: LoaderFunctionArgs<{ id: string }>) => {
          const res = await authorizedAxiosInstance.get(
            `/product/${params.params.id}`
          )
          return res.data.data
        }
      },
      {
        path: "category",
        element: <Category />
      },
      {
        path: "order",
        element: <Order />,
        loader: async () => {
          const res = await authorizedAxiosInstance.get("/order")
          return res.data.data
        }
      },
      {
        path: "order/create",
        element: <CreateOrder />
      },
      { path: "order/:id", element: <OrderDetail /> },
      {
        path: "discount",
        element: <Discount />
      },
      {
        path: "roles",
        element: <Role />,
        loader: async () => {
          const res = await authorizedAxiosInstance.get("/role")
          return res.data.data
        }
      },
      {
        path: "roles/edit/:id",
        element: <EditRole />
      },
      {
        path: "roles/create",
        element: <CreateRole />
      },
      {
        path: "users",
        element: <User />
      },
      {
        path: "modules",
        element: <Modules />
      }
    ]
  },
  {
    path: "/login",
    element: <Login />
  }
])

const App = () => {
  const permissions = useSelector(selectPermission)
  console.log("🚀 ~ App ~ permissions:", permissions)
  return <RouterProvider router={router} />
}

export default App
