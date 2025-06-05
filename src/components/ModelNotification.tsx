"use client"
import * as React from "react"
import Popover from "@mui/material/Popover"
import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import IconButton from "@mui/material/IconButton"
import Tooltip from "@mui/material/Tooltip"
import Chip from "@mui/material/Chip"
import { Button, Stack } from "@mui/material"
import { keyframes } from "@mui/system"
import dayjs from "dayjs"
import NotificationsIcon from "@mui/icons-material/Notifications"
import Badge from "@mui/material/Badge"
import { INotifications } from "../interface/notification"
import { getNotificationAPI } from "../api"

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

export default function ModelNotification() {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleDeleteNotification = (id: number) => {
    // if(confirm)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const id = open ? "simple-popover" : undefined
  const [notifications, setNotifications] = React.useState<
    INotifications[] | null
  >(null)

  React.useEffect(() => {
    const fetchNotifications = async () => {
      if (!open || notifications) return
      const res = await getNotificationAPI()
      setNotifications(res)
      console.log("data", res)
    }
    fetchNotifications()
  }, [open, notifications])
  return (
    <div>
      <Box>
        <Box onClick={(e) => handleClick(e)}>
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
        </Box>

        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center"
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right"
          }}
          disableAutoFocus
          disableEnforceFocus
          disableRestoreFocus
        >
          <Box sx={{ p: 2, maxWidth: "300px" }}>
            <Typography variant="body1">Thông báo</Typography>
            <Stack
              direction="row"
              spacing={1}
              sx={{
                mt: 1,
                "& .MuiChip-label": {
                  cursor: "pointer"
                }
              }}
            >
              <Chip
                label="Tất cả"
                onClick={(e) => {
                  e.stopPropagation()
                }}
              />
              <Chip
                label="Chưa đọc"
                variant="outlined"
                onClick={(e) => {
                  e.stopPropagation()
                }}
              />
            </Stack>
            <Box
              sx={{
                mt: 2,
                "& > .MuiBox-root": {
                  cursor: "pointer"
                }
              }}
            >
              {notifications && notifications.length > 0 ? (
                notifications?.map((item: INotifications) => {
                  return (
                    <Box
                      key={item.id}
                      sx={{
                        mt: 1,
                        p: 1,
                        bgcolor: `${item.is_read ? "" : "#e0e0e0"}`,
                        borderRadius: 3,
                        border: "1px solid #e0e0e0",
                        position: "relative",
                        "&:hover .MuiBox-root": {
                          display: "block"
                        }
                      }}
                    >
                      <Box
                        sx={{
                          display: "none",
                          position: "absolute",
                          top: "50%",
                          right: "1%",
                          transform: "translateY(-50%) rotate(90deg)"
                        }}
                      >
                        <Tooltip title="Xoá thông báo">
                          <IconButton
                            aria-label="more options"
                            onClick={() => handleDeleteNotification(id)}
                          >
                            <MoreVertIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                      <Stack
                        direction={"row"}
                        alignItems={"center"}
                        justifyContent={"space-between"}
                      >
                        <Typography variant="body2">{item.title}</Typography>
                        <Typography
                          component={"span"}
                          sx={{
                            fontSize: "13px"
                          }}
                        >
                          {dayjs(item.created_at).format("DD/MM/YYYY")}
                        </Typography>
                      </Stack>
                      <Typography
                        sx={{
                          mt: 0.6
                        }}
                      >
                        {item.message}
                      </Typography>
                    </Box>
                  )
                })
              ) : (
                <Typography variant="body1" my={4}>
                  Chưa có thông báo mới !
                </Typography>
              )}
            </Box>
            <Box
              sx={{
                mt: 2.5
              }}
            >
              <Button
                variant="outlined"
                sx={{
                  textTransform: "capitalize",
                  width: "100%",
                  borderRadius: 2
                }}
                onClick={(e) => {
                  e.stopPropagation()
                }}
              >
                Xem thông báo trước
              </Button>
            </Box>
          </Box>
        </Popover>
      </Box>
    </div>
  )
}
