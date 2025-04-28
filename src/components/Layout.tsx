import { useState } from "react"
import Box from "@mui/material/Box"
import IconButton from "@mui/material/IconButton"
import Typography from "@mui/material/Typography"
import Tooltip from "@mui/material/Tooltip"
import Avatar from "@mui/material/Avatar"
import Badge from "@mui/material/Badge"
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
import NotificationsIcon from "@mui/icons-material/Notifications"
import { keyframes, Stack } from "@mui/system"
import Divider from "@mui/material/Divider"
import MenuList from "@mui/material/MenuList"
import MenuItem from "@mui/material/MenuItem"
import ListItemText from "@mui/material/ListItemText"
import ListItemIcon from "@mui/material/ListItemIcon"
import Menu from "@mui/material/Menu"
import AccountCircleIcon from "@mui/icons-material/AccountCircle"
import PersonIcon from "@mui/icons-material/Person"
import ExitToAppIcon from "@mui/icons-material/ExitToApp"

const Layout = () => {
  // Thêm keyframes cho hiệu ứng
  const ripple = keyframes`
  0% {
    transform: scale(0.5);
    opacity: 1;
  }
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
`
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
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleProfile = () => {
    // Xử lý chuyển đến trang profile
    handleMenuClose()
  }

  const handleSignOut = () => {
    // Xử lý đăng xuất
    handleMenuClose()
    // Chuyển hướng ngay lập tức
    navigate("/login", {
      replace: true
    })
  }

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
          padding: "10px",
          zIndex: 1000
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

      {/* Main Content Area */}
      <Box
        sx={{
          flexGrow: 1,
          marginLeft: expanded ? "15%" : "5%",
          transition: "margin-left 0.3s ease",
          display: "flex",
          flexDirection: "column"
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            p: 2,
            boxShadow: "0.5",
            position: "sticky",
            top: 0,
            zIndex: 1100
          }}
        >
          <Tooltip title="Thông báo">
            <IconButton
              sx={{
                mr: 2,
                position: "relative",
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.05)"
                }
              }}
            >
              {/* Hiệu ứng sóng */}
              <Box
                sx={{
                  position: "absolute",
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  animation: `${ripple} 2s infinite`,
                  border: "2px solid",
                  borderColor: "primary.main",
                  pointerEvents: "none"
                }}
              />
              <Badge badgeContent={4} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>
          <Stack direction="row" spacing={2} alignItems={"center"}>
            <Box>
              <Typography component={"p"} color="#0B0E14">
                Gami
              </Typography>
              <Typography
                component={"span"}
                color="#0B0E14"
                sx={{
                  fontSize: "15px"
                }}
              >
                Admin Profile
              </Typography>
            </Box>
            <Avatar
              sx={{
                cursor: "pointer",
                bgcolor: "primary.main",
                width: 40,
                height: 40
              }}
              onClick={handleMenuOpen}
            >
              U
            </Avatar>
          </Stack>

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right"
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right"
            }}
            PaperProps={{
              sx: {
                width: 200,
                overflow: "visible",
                mt: 1.5
              }
            }}
          >
            <MenuList>
              {/* Mục Gami */}
              <MenuItem onClick={handleMenuClose}>
                <ListItemIcon>
                  <AccountCircleIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Gami</ListItemText>
              </MenuItem>

              <Divider />

              {/* Profile Page */}
              <MenuItem onClick={handleProfile}>
                <ListItemIcon>
                  <PersonIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Profile Page</ListItemText>
              </MenuItem>

              {/* Sign Out */}
              <MenuItem onClick={handleSignOut}>
                <ListItemIcon>
                  <ExitToAppIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Sign Out</ListItemText>
              </MenuItem>
            </MenuList>
          </Menu>
        </Box>

        {/* Content */}
        <Box
          sx={{
            flexGrow: 1,
            overflow: "auto",
            p: 3,
            bgcolor: "background.default"
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}

export default Layout
