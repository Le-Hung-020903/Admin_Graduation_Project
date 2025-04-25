import { useState } from "react"
import { Box, IconButton, Typography, Tooltip } from "@mui/material"
import { Outlet, useNavigate, useLocation } from "react-router-dom"
import MenuIcon from "@mui/icons-material/Menu"
import HomeIcon from "@mui/icons-material/Home"
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"
import CategoryIcon from "@mui/icons-material/Category"
import InventoryIcon from "@mui/icons-material/Inventory"
import DiscountIcon from "@mui/icons-material/Discount"
import ControlCameraIcon from "@mui/icons-material/ControlCamera"
import ViewModuleIcon from "@mui/icons-material/ViewModule"
import GroupIcon from "@mui/icons-material/Group"

const Layout = () => {
  const [expanded, setExpanded] = useState<boolean>(true)
  const navigate = useNavigate()
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path
  const activeBgColor = "#DADDE3"
  const defaultBgColor = "transparent"

  const menuItems = [
    { icon: <HomeIcon />, label: "Trang chủ", path: "/" },
    { icon: <CategoryIcon />, label: "Danh mục", path: "/category" },
    { icon: <ShoppingCartIcon />, label: "Sản phẩm", path: "/product" },
    { icon: <InventoryIcon />, label: "Đơn hàng", path: "/order" },
    { icon: <DiscountIcon />, label: "Mã giảm giá", path: "/discount" },
    { icon: <ControlCameraIcon />, label: "Vai trò", path: "/roles" },
    { icon: <GroupIcon />, label: "User", path: "/users" },
    { icon: <ViewModuleIcon />, label: "Module", path: "/modules" }
  ]

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          top: 0,
          width: expanded ? "15%" : "5%",
          background: "#F5F6FA",
          transition: "width 0.3s ease",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "10px"
        }}
      >
        {/* Nút mở rộng/thu nhỏ sidebar */}
        <IconButton
          onClick={() => setExpanded(!expanded)}
          sx={{
            color: "#0B0E14",
            marginBottom: 2,
            alignSelf: "center"
          }}
        >
          <MenuIcon />
        </IconButton>

        {/* Danh sách icon điều hướng */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            width: "100%"
          }}
        >
          {menuItems.map((item) => (
            <Box
              key={item.path}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: expanded ? "flex-start" : "center",
                width: "100%",
                padding: "10px",
                borderRadius: "5px",
                background: isActive(item.path)
                  ? activeBgColor
                  : defaultBgColor,
                "&:hover": { background: activeBgColor },
                cursor: "pointer"
              }}
              onClick={() => navigate(item.path)}
            >
              <Tooltip title={!expanded ? item.label : ""} placement="right">
                <Box
                  sx={{
                    minWidth: "40px",
                    display: "flex",
                    justifyContent: "center",
                    color: isActive(item.path) ? "#0B0E14" : "#9A9A9B"
                  }}
                >
                  {item.icon}
                </Box>
              </Tooltip>
              {expanded && (
                <Typography color="#0B0E14">{item.label}</Typography>
              )}
            </Box>
          ))}
        </Box>
      </Box>

      {/* Nội dung chính */}
      <Box
        sx={{
          marginLeft: expanded ? "16%" : "6%",
          width: expanded ? "85%" : "95%",
          transition: "width 0.3s ease",
          padding: "20px"
        }}
      >
        <Outlet />
      </Box>
    </Box>
  )
}

export default Layout
