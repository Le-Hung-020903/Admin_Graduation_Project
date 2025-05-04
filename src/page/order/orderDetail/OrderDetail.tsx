import React, { useCallback, useEffect, useState } from "react"
import Box from "@mui/material/Box"
import Grid from "@mui/material/Grid"
import Typography from "@mui/material/Typography"
import Stack from "@mui/material/Stack"
import Divider from "@mui/material/Divider"
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"
import Person4Icon from "@mui/icons-material/Person4"
import EmailIcon from "@mui/icons-material/Email"
import CallIcon from "@mui/icons-material/Call"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import Paper from "@mui/material/Paper"
import Avatar from "@mui/material/Avatar"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import { getOrderDetailAPI, updateOrderAPI } from "../../../api"
import { useParams } from "react-router-dom"
import { IAddress, IOrderDetail } from "../../../interface/order"
import dayjs from "dayjs"
import { formattedAmount } from "../../../utils/formatMoney"
import { toast } from "react-toastify"
import GoBack from "../../../components/GoBack"
import Address from "../../../components/Address"

const OrderDetail = () => {
  const { id } = useParams()
  const [open, setOpen] = React.useState(false)
  const handleOpen = () => setOpen(true)
  const [order, setOrder] = useState<IOrderDetail | null>(null)
  const [note, setNote] = useState<string>("")
  const [status, setStatus] = useState<string>("")
  const [selectedAddress, setSelectedAddress] = useState<IAddress | null>(null)

  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null
  )
  console.log("o noi chi tiet", selectedAddressId)

  const orderStatus = [
    { value: "PENDING", label: "Đang chờ" },
    { value: "WAITING_CONFIRMATION", label: "Chờ xác nhận" },
    { value: "SHIPPED", label: "Đang giao" },
    { value: "DELIVERED", label: "Đã giao" },
    { value: "CANCELED", label: "Đã hủy" },
    { value: "CONFIRMED", label: "Đã xác nhận" }
  ]

  const fetchOrderDetail = useCallback(async () => {
    const res = await getOrderDetailAPI(Number(id))
    setOrder(res.data)
    setNote(res.data.note)
    setStatus(res.data.status)
    setSelectedAddress(res.data.address)
  }, [id])

  const handleUpdateOrder = async (id: number) => {
    const data = {
      note: note,
      address_id: selectedAddressId ? selectedAddressId : 0,
      status: status
    }
    toast.promise(updateOrderAPI(id, data), {}).then((res) => {
      if (res.success) {
        toast.success("Cập nhật giỏ hàng thành công")
      }
    })
  }

  useEffect(() => {
    fetchOrderDetail()
  }, [fetchOrderDetail])

  return (
    <Box>
      <GoBack />
      <Stack
        direction={"row"}
        spacing={1}
        mb={4}
        sx={{
          "& .MuiTypography-root": {
            fontWeight: "bold"
          }
        }}
      >
        <Typography variant="h5">Order Details:</Typography>
        <Typography variant="h5">{`Order-${order?.order_code}`}</Typography>
      </Stack>
      <Divider />
      <Box mt={3}>
        <Grid
          container
          spacing={2}
          sx={{
            "& .MuiSvgIcon-root": {
              color: "white"
            }
          }}
        >
          <Grid item xs={12} md={3}>
            <Stack
              direction={"row"}
              spacing={3}
              justifyContent={"flex-start"}
              alignItems={"center"}
              sx={{
                bgcolor: "#D1E7DD",
                p: 2,
                borderRadius: "10px"
              }}
            >
              <Stack
                direction={"row"}
                alignItems={"center"}
                justifyContent={"center"}
                sx={{
                  bgcolor: "#198754",
                  width: 50,
                  height: 50,
                  borderRadius: "10px"
                }}
              >
                <ShoppingCartIcon />
              </Stack>
              <Stack>
                <Typography>Order Created at</Typography>
                <Typography>
                  {dayjs(order?.created_at).format("DD/MM/YYYY [at] hh:mm A")}
                </Typography>
              </Stack>
            </Stack>
          </Grid>
          <Grid item xs={12} md={3}>
            <Stack
              direction={"row"}
              spacing={3}
              justifyContent={"flex-start"}
              alignItems={"center"}
              sx={{
                bgcolor: "#F8D7DA",
                p: 2,
                borderRadius: "10px"
              }}
            >
              <Stack
                direction={"row"}
                alignItems={"center"}
                justifyContent={"center"}
                sx={{
                  bgcolor: "#DC3545",
                  width: 50,
                  height: 50,
                  borderRadius: "10px"
                }}
              >
                <Person4Icon />
              </Stack>
              <Stack>
                <Typography>Name</Typography>
                <Typography
                  sx={{
                    textTransform: "capitalize"
                  }}
                >
                  {order?.address.name}
                </Typography>
              </Stack>
            </Stack>
          </Grid>
          <Grid item xs={12} md={3}>
            <Stack
              direction={"row"}
              spacing={3}
              justifyContent={"flex-start"}
              alignItems={"center"}
              sx={{
                bgcolor: "#FFF3CD",
                p: 2,
                borderRadius: "10px"
              }}
            >
              <Stack
                direction={"row"}
                alignItems={"center"}
                justifyContent={"center"}
                sx={{
                  bgcolor: "#FFC107",
                  width: 50,
                  height: 50,
                  borderRadius: "10px"
                }}
              >
                <EmailIcon />
              </Stack>
              <Stack>
                <Typography>Email</Typography>
                <Typography>{order?.user.email}</Typography>
              </Stack>
            </Stack>
          </Grid>
          <Grid item xs={12} md={3}>
            <Stack
              direction={"row"}
              spacing={3}
              justifyContent={"flex-start"}
              alignItems={"center"}
              sx={{
                bgcolor: "#CFF4FC",
                p: 2,
                borderRadius: "10px"
              }}
            >
              <Stack
                direction={"row"}
                alignItems={"center"}
                justifyContent={"center"}
                sx={{
                  bgcolor: "#0DCAF0",
                  width: 50,
                  height: 50,
                  borderRadius: "10px"
                }}
              >
                <CallIcon />
              </Stack>
              <Stack>
                <Typography>Contact No</Typography>
                <Typography>{order?.address.phone}</Typography>
              </Stack>
            </Stack>
          </Grid>
        </Grid>
      </Box>
      <Grid container spacing={4} mt={2}>
        <Grid item xs={12} md={8}>
          <Box>
            <TableContainer component={Paper} elevation={2}>
              <Typography variant="h6" sx={{ p: 2, fontWeight: "bold" }}>
                Order Summary
              </Typography>
              <Table>
                <TableHead>
                  <TableRow
                    sx={{
                      "& .MuiTableCell-root": {
                        textTransform: "uppercase"
                      }
                    }}
                  >
                    <TableCell>
                      <strong>Product Image</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Product Name</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Quantity</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Price</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order?.orderDetails.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell sx={{ width: "40%" }}>
                        <Avatar
                          src={product.product.images[0].url}
                          variant="square"
                          sx={{ width: 50, height: 50 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography>{product.product.name}</Typography>
                      </TableCell>
                      <TableCell>{product.quantity}</TableCell>
                      <TableCell>
                        {formattedAmount(product.variant.price)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Box
              sx={{
                mt: 2.8,
                width: "37%",
                ml: "auto"
              }}
            >
              <Paper
                elevation={2}
                sx={{
                  p: 2
                }}
              >
                <Stack
                  direction={"row"}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                >
                  <Typography>Subotal Price:</Typography>
                  <Typography
                    sx={{
                      fontWeight: "bold"
                    }}
                  >
                    {formattedAmount(Number(order?.total_price))}
                  </Typography>
                </Stack>
                <Stack
                  direction={"row"}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                  sx={{
                    mt: 2
                  }}
                >
                  <Typography>Discount Price:</Typography>
                  <Typography
                    sx={{
                      fontWeight: "bold"
                    }}
                  >
                    {formattedAmount(
                      Number(order?.total_price) - Number(order?.final_price)
                    )}
                  </Typography>
                </Stack>
                <Divider
                  sx={{
                    my: 2
                  }}
                />
                <Stack
                  direction={"row"}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                >
                  <Typography
                    sx={{
                      fontWeight: "bold"
                    }}
                  >
                    Total Price:
                  </Typography>
                  <Typography
                    sx={{
                      color: "red",
                      fontWeight: "bold"
                    }}
                  >
                    {formattedAmount(Number(order?.final_price))}
                  </Typography>
                </Stack>
              </Paper>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              "& .MuiTypography-root": {
                fontWeight: "bold"
              }
            }}
          >
            <Typography variant="h6">Status Orders</Typography>
            <Box
              sx={{
                mt: 4,
                p: 0.1
              }}
            >
              <Typography>Order ID</Typography>
              <TextField
                id="filled-read-only-input"
                label=""
                defaultValue={order?.order_code}
                variant="filled"
                slotProps={{
                  input: {
                    readOnly: true
                  }
                }}
                sx={{
                  width: "100%",
                  mt: 1
                }}
              />
            </Box>
            <Box
              sx={{
                mt: 4,
                p: 0.1
              }}
            >
              <Typography>Order Status</Typography>
              <TextField
                id="outlined-select-currency-native"
                select
                label="Status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                slotProps={{
                  select: {
                    native: true
                  }
                }}
                sx={{
                  width: "100%",
                  mt: 2
                }}
              >
                {orderStatus.map((item) => {
                  return (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  )
                })}
              </TextField>
            </Box>
            <Box
              sx={{
                mt: 4,
                p: 0.1
              }}
            >
              <Typography>Order Transection</Typography>
              <TextField
                id="filled-read-only-input"
                label=""
                defaultValue={order?.payment_method}
                variant="filled"
                slotProps={{
                  input: {
                    readOnly: true
                  }
                }}
                sx={{
                  width: "100%",
                  mt: 1
                }}
              />
            </Box>
            <Box
              sx={{
                mt: 4,
                p: 0.1
              }}
            >
              <Typography>Note</Typography>
              <TextField
                id="outlined-basic"
                label="Note"
                value={note}
                InputLabelProps={{
                  shrink: true // <--- ép label float luôn
                }}
                variant="outlined"
                sx={{
                  width: "100%",
                  mt: 1,
                  "& .MuiOutlinedInput-root": {
                    height: 80, // Chiều cao tổng thể TextField
                    "& fieldset": {
                      borderWidth: 2 // Độ dày border
                    },
                    "&:hover fieldset": {
                      borderWidth: 2 // Khi hover cũng giữ độ dày border
                    },
                    "&.Mui-focused fieldset": {
                      borderWidth: 2 // Khi focus cũng giữ độ dày border
                    }
                  }
                }}
                onChange={(e) => setNote(e.target.value)}
              />
            </Box>
            <Box
              sx={{
                mt: 4,
                p: 0.1
              }}
            >
              <Stack
                direction={"row"}
                justifyContent={"space-between"}
                alignItems={"center"}
              >
                <Typography>Address</Typography>
                <Button variant="outlined" onClick={handleOpen}>
                  Thay đổi
                </Button>
              </Stack>
              <TextField
                id="filled-read-only-input"
                label=""
                value={`${selectedAddress?.street}, ${selectedAddress?.ward}, ${selectedAddress?.district}, ${selectedAddress?.province}`}
                variant="filled"
                slotProps={{
                  input: {
                    readOnly: true
                  }
                }}
                sx={{
                  width: "100%",
                  mt: 1
                }}
              />
            </Box>
            <Box sx={{ mt: 3 }}>
              <Button
                className="interceptor-loading"
                variant="contained"
                sx={{ width: "100%" }}
                onClick={() => handleUpdateOrder(Number(id))}
              >
                Update
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      <Address
        open={open}
        setOpen={setOpen}
        setSelectedAddress={setSelectedAddress}
        selectedAddressId={selectedAddressId}
        setSelectedAddressId={setSelectedAddressId}
      />
    </Box>
  )
}
export default OrderDetail
