import React, { useEffect, useState } from "react"
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
import Backdrop from "@mui/material/Backdrop"
import Modal from "@mui/material/Modal"
import Fade from "@mui/material/Fade"
import Radio from "@mui/material/Radio"
import RadioGroup from "@mui/material/RadioGroup"
import FormControlLabel from "@mui/material/FormControlLabel"
import FormControl from "@mui/material/FormControl"
import AddIcon from "@mui/icons-material/Add"
import Avatar from "@mui/material/Avatar"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import Select from "@mui/material/Select"
import MenuItem from "@mui/material/MenuItem"
import Checkbox from "@mui/material/Checkbox"
import {
  createAddressAPI,
  getAddressAPI,
  getOrderDetailAPI
} from "../../../api"
import { useParams } from "react-router-dom"
import { IAddress, IOrderDetail } from "../../../interface/order"
import dayjs from "dayjs"
import { formattedAmount } from "../../../utils/formatMoney"
import InputLabel from "@mui/material/InputLabel"
import { toast } from "react-toastify"

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "10px"
}
type Addresses = {
  name: string
  slug: string
  type: string
  name_with_type: string
  code: string
}

const OrderDetail = () => {
  const { id } = useParams()
  const [open, setOpen] = React.useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const [order, setOrder] = useState<IOrderDetail | null>(null)
  const [status, setStatus] = useState<string>(order?.status || "")
  const [selectedAddress, setSelectedAddress] = useState<IAddress | null>(null)
  const [openEditAddress, setOpenEditAddress] = useState<boolean>(false)
  const [address, setAddress] = useState<IAddress[]>([])
  const handleOpenEditAddress = () => setOpenEditAddress(!openEditAddress)
  const [listProvince, setListProvince] = useState<Addresses[]>([])
  const [listDistricts, setListDistricts] = useState<Addresses[]>([])
  const [listWards, setListWards] = useState<Addresses[]>([])
  const [location, setLocation] = useState({
    name: "",
    phone: "",
    province_code: "",
    province: "",
    district_code: "",
    district: "",
    ward: "",
    ward_code: "",
    location: "",
    is_default: false
  })
  console.log("dia chi", location)

  // State
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null
  )

  // Hàm xử lý khi bấm "Cập nhật"
  const handleUpdateAddress = (id: number) => {
    console.log("Địa chỉ cần cập nhật:", id)
  }
  const orderStatus = [
    { value: "PENDING", label: "Đang chờ" },
    { value: "WAITING_CONFIRMATION", label: "Chờ xác nhận" },
    { value: "SHIPPED", label: "Đang giao" },
    { value: "DELIVERED", label: "Đã giao" },
    { value: "CANCELED", label: "Đã hủy" },
    { value: "CONFIRMED", label: "Đã xác nhận" }
  ]

  const fetchAddress = async () => {
    const res = await getAddressAPI()
    setAddress(res.data)
  }
  const handleSubmitAddress = () => {
    const data = {
      phone: location.phone,
      name: location.name,
      province: location.province,
      district: location.district,
      ward: location.ward,
      street: location.location,
      is_default: location.is_default
    }
    toast.promise(createAddressAPI(data), {}).then((res) => {
      if (res.success) {
        fetchAddress()
        setOpenEditAddress(!openEditAddress)
      }
    })
  }
  useEffect(() => {
    const fetchProvince = async () => {
      const res = await fetch(`https://province-api-vn.vercel.app/provinces`)
      const data = await res.json()
      setListProvince(data)
    }
    fetchProvince()
  }, [])

  useEffect(() => {
    const fetchDistricts = async () => {
      const res = await fetch(
        `https://province-api-vn.vercel.app/districts?parent_code=${location.province_code}`
      )
      const data = await res.json()
      setListDistricts(data)
    }
    fetchDistricts()
  }, [location.province_code])

  useEffect(() => {
    const fetchWards = async () => {
      const res = await fetch(
        `https://province-api-vn.vercel.app/wards?parent_code=${location.district_code}`
      )
      const data = await res.json()
      setListWards(data)
    }
    fetchWards()
  }, [location.district_code])

  useEffect(() => {
    const fetchOrderDetail = async () => {
      const res = await getOrderDetailAPI(Number(id))
      setOrder(res.data)
      setStatus(res.data.status)
      setSelectedAddress(res.data.address)
    }
    fetchOrderDetail()
    fetchAddress()
  }, [id])
  return (
    <Box>
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
                value={order?.note ?? ""}
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
              >
                Update
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      <Box>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={open}
          onClose={handleClose}
          closeAfterTransition
          slots={{ backdrop: Backdrop }}
          slotProps={{
            backdrop: {
              timeout: 500
            }
          }}
        >
          <Fade in={open}>
            <Box sx={style}>
              <Typography
                id="transition-modal-title"
                variant="h6"
                component="h2"
                sx={{
                  mb: 4
                }}
              >
                {openEditAddress ? "Add new address" : "Delivery address"}
              </Typography>
              {openEditAddress ? (
                <Box>
                  {/* Form thêm địa chỉ */}
                  <Box>
                    <Box>
                      <Typography>Full name:</Typography>
                      <TextField
                        id="outlined-basic"
                        label="name"
                        value={location.name}
                        variant="outlined"
                        onChange={(e) =>
                          setLocation((pre) => ({
                            ...pre,
                            name: e.target.value
                          }))
                        }
                        sx={{
                          mt: 1,
                          width: "100%"
                        }}
                      />
                    </Box>
                    <Box
                      sx={{
                        mt: 2
                      }}
                    >
                      <Typography>Phone number:</Typography>
                      <TextField
                        id="outlined-basic"
                        label="phone"
                        value={location.phone}
                        onChange={(e) =>
                          setLocation((pre) => ({
                            ...pre,
                            phone: e.target.value
                          }))
                        }
                        variant="outlined"
                        sx={{
                          mt: 1,
                          width: "100%"
                        }}
                      />
                    </Box>
                    <Box
                      sx={{
                        mt: 2
                      }}
                    >
                      <Typography>Address:</Typography>
                      <FormControl
                        fullWidth
                        sx={{
                          mt: 1
                        }}
                      >
                        <InputLabel id="province-select-label">
                          Province
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={location.province_code || ""}
                          label="Province"
                          onChange={(e) => {
                            const selectedCode = e.target.value
                            const selectedProvince = listProvince.find(
                              (item) => item.code === selectedCode
                            )
                            if (!selectedProvince) return
                            setLocation((prev) => ({
                              ...prev,
                              province: selectedProvince?.name_with_type,
                              province_code: selectedProvince?.code
                            }))
                          }}
                        >
                          <MenuItem value="" disabled>
                            Select Province
                          </MenuItem>
                          {listProvince.map((item) => (
                            <MenuItem key={item.code} value={item.code}>
                              {item.name_with_type}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>
                    <Box
                      sx={{
                        mt: 2
                      }}
                    >
                      <FormControl
                        fullWidth
                        sx={{
                          mt: 1
                        }}
                      >
                        <InputLabel id="province-select-label">
                          District
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={location.district_code || ""}
                          label="District"
                          onChange={(e) => {
                            const selectedCode = e.target.value
                            const selectedDistrict = listDistricts.find(
                              (i) => i.code === selectedCode
                            )
                            if (!selectedDistrict) return
                            setLocation((prev) => ({
                              ...prev,
                              district: selectedDistrict?.name_with_type,
                              district_code: selectedDistrict?.code
                            }))
                          }}
                        >
                          <MenuItem value="" disabled>
                            Select District
                          </MenuItem>
                          {listDistricts.map((item) => (
                            <MenuItem key={item.code} value={item.code}>
                              {item.name_with_type}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>
                    <Box
                      sx={{
                        mt: 2
                      }}
                    >
                      <FormControl
                        fullWidth
                        sx={{
                          mt: 1
                        }}
                      >
                        <InputLabel id="province-select-label">Ward</InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={location.ward_code || ""}
                          label="Province"
                          onChange={(e) => {
                            const selectedCode = e.target.value
                            const selectedWard = listWards.find(
                              (i) => i.code === selectedCode
                            )
                            if (!selectedWard) return
                            setLocation((prev) => ({
                              ...prev,
                              ward: selectedWard?.name_with_type,
                              ward_code: selectedWard?.code
                            }))
                          }}
                        >
                          <MenuItem value="" disabled>
                            Select Ward
                          </MenuItem>
                          {listWards.map((item) => (
                            <MenuItem key={item.code} value={item.code}>
                              {item.name_with_type}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>
                    <Box
                      sx={{
                        mt: 2
                      }}
                    >
                      <FormControl>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={location.is_default}
                              onChange={(e) =>
                                setLocation((pre) => ({
                                  ...pre,
                                  is_default: e.target.checked
                                }))
                              }
                            />
                          }
                          label="Đặt làm địa chỉ mặc định"
                        />
                      </FormControl>
                    </Box>
                  </Box>
                  {/* Form input ở đây */}
                  <Stack
                    spacing={2}
                    direction={"row"}
                    justifyContent={"flex-end"}
                    alignItems={"center"}
                    sx={{
                      mt: 2
                    }}
                  >
                    <Button variant="outlined" onClick={handleOpenEditAddress}>
                      Go back
                    </Button>
                    <Button variant="contained" onClick={handleSubmitAddress}>
                      Save
                    </Button>
                  </Stack>
                </Box>
              ) : (
                <Box>
                  {/* Danh sách địa chỉ */}
                  <FormControl sx={{ width: "100%" }}>
                    <RadioGroup
                      aria-labelledby="address-radio-buttons-group"
                      value={selectedAddressId}
                      onChange={(e) =>
                        setSelectedAddressId(Number(e.target.value))
                      }
                      name="radio-buttons-group"
                    >
                      {address.map((item) => (
                        <Box key={item.id} sx={{ mb: 2 }}>
                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                          >
                            <FormControlLabel
                              value={item.id}
                              control={<Radio />}
                              label={
                                <Stack>
                                  <Typography fontWeight={600}>
                                    {item.name} | {item.phone}
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    {`${item.street}, ${item.ward}, ${item.district}, ${item.province}`}
                                  </Typography>
                                </Stack>
                              }
                            />
                            <Button
                              variant="text"
                              size="small"
                              onClick={() => handleUpdateAddress(item.id)}
                            >
                              Cập nhật
                            </Button>
                          </Stack>
                        </Box>
                      ))}
                    </RadioGroup>
                  </FormControl>

                  {/* Nút Thêm địa chỉ (nằm bên trong Box chung) */}
                  <Box mt={2}>
                    <Button
                      variant="outlined"
                      onClick={handleOpenEditAddress}
                      startIcon={<AddIcon />}
                      sx={{
                        color: "#1976d2",
                        borderColor: "#1976d2",
                        textTransform: "none",
                        fontWeight: 600,
                        borderRadius: "8px",
                        padding: "6px 16px"
                      }}
                    >
                      Thêm địa chỉ
                    </Button>
                  </Box>
                </Box>
              )}
            </Box>
          </Fade>
        </Modal>
      </Box>
    </Box>
  )
}
export default OrderDetail
