import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import React, { ChangeEvent, useEffect, useState } from "react"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import FormControl from "@mui/material/FormControl"
import Select, { SelectChangeEvent } from "@mui/material/Select"
import Button from "@mui/material/Button"
import AddIcon from "@mui/icons-material/Add"
import TextField from "@mui/material/TextField"
import Stack from "@mui/material/Stack"
import CloseIcon from "@mui/icons-material/Close"
import IconButton from "@mui/material/IconButton"
import {
  createOrderAPI,
  getAllDiscountAPI,
  getProductList,
  getUserByNameAPI
} from "../../../api"
import { formattedAmount } from "../../../utils/formatMoney"
import { IAddress, IOrderPayload } from "../../../interface/order"
import GoBack from "../../../components/GoBack"
import Address from "../../../components/Address"
import { toast } from "react-toastify"

const CreateOrder = () => {
  const defaultOrder = {
    user_id: 0,
    discount_id: 0,
    address_id: null as number | null,
    note: "",
    payment_method: "",
    final_price: 0,
    status: "",
    payment_status: ""
  }

  const defaultInputs = [
    { product_id: 0, variant_id: 0, quantity: 1, price: 0 }
  ]

  const [open, setOpen] = React.useState(false)
  const handleOpen = () => setOpen(true)
  const [userList, setUserList] = useState<{ id: number; name: string }[]>([])
  const [selectedAddress, setSelectedAddress] = useState<IAddress | null>(null)
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null
  )

  const [productList, setProductList] = useState<
    {
      id: number
      name: string
      variants: { id: number; name: string; price: number }[]
    }[]
  >([])

  const [discountList, setDiscountList] = useState<
    {
      id: number
      end_date: string
      content: string
      percent: number
    }[]
  >([])

  const [order, setOrder] = useState(defaultOrder)

  const [inputs, setInputs] = useState(defaultInputs)

  const handleAddOrderItem = () => {
    setInputs([
      ...inputs,
      { product_id: 0, variant_id: 0, quantity: 0, price: 0 }
    ])
  }

  const handleChangeOrderItem =
    (index: number, key: "product_id" | "variant_id" | "quantity") =>
    (
      event:
        | SelectChangeEvent<number>
        | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      const value =
        key === "quantity"
          ? Math.max(Number(event.target.value), 1) // không cho số âm hoặc 0
          : Number(event.target.value)
      const newInputs = [...inputs]

      // Nếu là variant thì cần cập nhật giá luôn
      if (key === "variant_id") {
        const selectedProduct = productList.find(
          (product) => product.id === newInputs[index].product_id
        )
        const selectedVariant = selectedProduct?.variants.find(
          (v) => v.id === value
        )
        newInputs[index].variant_id = value
        newInputs[index].price = selectedVariant?.price ?? 0
      } else if (key === "quantity") {
        newInputs[index].quantity = value
      } else {
        newInputs[index].product_id = value
      }
      setInputs(newInputs)
    }

  const handleChange = (
    e:
      | SelectChangeEvent
      | React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target
    setOrder((pre) => ({
      ...pre,
      [name]:
        name === "discount_id" || name === "user_id" ? Number(value) : value
    }))
  }

  const handleDelete = (index: number) => {
    const newInputs = inputs.filter((_, i) => i !== index)
    setInputs(newInputs)
  }

  const handleCreateOrder = () => {
    const data: IOrderPayload = {
      ...order,
      order_details: inputs
    }
    console.log("data", data)

    toast.promise(createOrderAPI(data), {}).then((res) => {
      if (res.success) {
        toast.success("Thêm đơn hàng thành công")
        // Reset form
        setOrder(defaultOrder)
        setInputs(defaultInputs)
      }
    })
  }

  useEffect(() => {
    const discount = discountList.find((d) => d.id === order.discount_id)
    const percent = discount?.percent || 0

    const total = inputs.reduce((acc, item) => {
      return acc + item.price * item.quantity
    }, 0)

    // (1 - 20 / 100) -> (1 - 0.2) -> 0.8
    const finalPrice = total * (1 - percent / 100)

    setOrder((prev) => ({
      ...prev,
      final_price: Number(finalPrice.toFixed(2))
    }))
  }, [inputs, order.discount_id, discountList])

  useEffect(() => {
    if (selectedAddressId !== null) {
      setOrder((pre) => ({
        ...pre,
        address_id: selectedAddressId
      }))
    }
  }, [selectedAddressId])

  useEffect(() => {
    const fetchProductList = async () => {
      const res = await getProductList()
      setProductList(res.data)
    }
    const fetchDiscountCode = async () => {
      const res = await getAllDiscountAPI()
      setDiscountList(res.data)
    }
    const fetchUser = async () => {
      const res = await getUserByNameAPI()
      setUserList(res.data)
    }
    fetchProductList()
    fetchDiscountCode()
    fetchUser()
  }, [])

  return (
    <Box>
      <GoBack />
      <Typography
        variant="h4"
        sx={{
          mb: 3
        }}
      >
        Create Order
      </Typography>
      <Box sx={{ mt: 3, width: "25%" }}>
        <Typography>User</Typography>
        <Box sx={{ minWidth: 120, mt: 1 }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">User</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              name="user_id"
              label="User"
              value={String(order.user_id || 0)}
              onChange={handleChange}
            >
              {userList.map((item) => {
                return <MenuItem value={item.id}>{item.name}</MenuItem>
              })}
            </Select>
          </FormControl>
        </Box>
      </Box>
      <Box sx={{ mt: 3, width: "25%" }}>
        <Typography>Payment method</Typography>
        <Box sx={{ minWidth: 120, mt: 1 }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Payment</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              name="payment_method"
              label="Payment"
              value={order.payment_method || ""}
              onChange={handleChange}
            >
              <MenuItem value="COD">COD</MenuItem>
              <MenuItem value="QR_PAYMENT">QR_PAYMENT</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>
      <Box
        sx={{
          width: "25%",
          mt: 3
        }}
      >
        <Typography>Order status</Typography>
        <Box sx={{ minWidth: 120, mt: 1 }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Status</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={order.status || ""}
              name="status"
              label="Status"
              onChange={handleChange}
            >
              <MenuItem value="PENDING">PENDING</MenuItem>
              <MenuItem value="WAITING_CONFIRMATION">
                WAITING_CONFIRMATION
              </MenuItem>
              <MenuItem value="SHIPPED">SHIPPED</MenuItem>
              <MenuItem value="DELIVERED">DELIVERED</MenuItem>
              <MenuItem value="CANCELED">CANCELED</MenuItem>
              <MenuItem value="CONFIRMED">CONFIRMED</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>
      <Box
        sx={{
          width: "25%",
          mt: 3
        }}
      >
        <Typography>Discount code</Typography>
        <Box sx={{ minWidth: 120, mt: 1 }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Discount</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={String(order.discount_id || 0)}
              name="discount_id"
              label="Discount"
              onChange={handleChange}
            >
              {discountList.map((item) => {
                return (
                  <MenuItem
                    value={item.id}
                  >{`${item.content} - ${item.percent}%`}</MenuItem>
                )
              })}
            </Select>
          </FormControl>
        </Box>
      </Box>
      <Box
        sx={{
          width: "25%",
          mt: 3
        }}
      >
        <Typography>Payment status</Typography>
        <Box sx={{ minWidth: 120, mt: 1 }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">
              Payment status
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={order.payment_status}
              name="payment_status"
              label="Payment status"
              onChange={handleChange}
            >
              <MenuItem value={"UNPAID"}>UNPAID</MenuItem>
              <MenuItem value={"PAID"}>PAID</MenuItem>
              <MenuItem value={"CANCELLED"}>CANCELLED</MenuItem>
              <MenuItem value={"REFUNDED"}>REFUNDED</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>
      <Box
        sx={{
          width: "25%",
          mt: 4
        }}
      >
        <Stack
          justifyContent={"space-between"}
          alignItems={"center"}
          direction={"row"}
        >
          <Typography>Address</Typography>
          <Button variant="outlined" onClick={handleOpen}>
            Add
          </Button>
        </Stack>
        <TextField
          id="filled-read-only-input"
          name="address_id"
          value={
            selectedAddress
              ? `${selectedAddress?.street}, ${selectedAddress?.ward}, ${selectedAddress?.district}, ${selectedAddress?.province}`
              : "Chưa chọn địa chỉ"
          }
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
          width: "25%",
          mt: 3
        }}
      >
        <Typography>Note</Typography>
        <TextField
          id="outlined-basic"
          label="Note"
          name="note"
          onChange={handleChange}
          variant="outlined"
          sx={{
            mt: 1,
            width: "100%"
          }}
        />
      </Box>
      <Box
        sx={{
          mt: 3
        }}
      >
        <Box
          sx={{
            width: "95%",
            mt: 2
          }}
        >
          <Button
            variant="outlined"
            color="primary"
            startIcon={<AddIcon />}
            sx={{
              textTransform: "none",
              borderRadius: "8px",
              padding: "8px 16px"
            }}
            onClick={handleAddOrderItem}
          >
            Create Product
          </Button>
          {inputs.map((item, index) => {
            return (
              <Stack
                direction={"row"}
                justifyContent={"space-between"}
                sx={{ mt: 2 }}
                alignItems={"center"}
                spacing={2}
                key={index + 1}
              >
                <FormControl
                  fullWidth
                  sx={{
                    flex: "1"
                  }}
                >
                  <InputLabel id="demo-simple-select-label">Product</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={item.product_id}
                    label="Product"
                    onChange={handleChangeOrderItem(index, "product_id")}
                  >
                    {productList.map((item) => {
                      return <MenuItem value={item.id}>{item.name}</MenuItem>
                    })}
                  </Select>
                </FormControl>
                <FormControl
                  fullWidth
                  sx={{
                    flex: "1"
                  }}
                >
                  <InputLabel id="demo-simple-select-label">Variant</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={item.variant_id}
                    onChange={handleChangeOrderItem(index, "variant_id")}
                    label="Variant"
                  >
                    {productList
                      .find((product) => product.id === item.product_id)
                      ?.variants.map((variant) => (
                        <MenuItem key={variant.id} value={variant.id}>
                          {variant.name} - {formattedAmount(variant.price)}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
                <TextField
                  id="outlined-number"
                  label="Number"
                  type="number"
                  value={item.quantity}
                  slotProps={{
                    inputLabel: {
                      shrink: true
                    }
                  }}
                  inputProps={{
                    min: 1
                  }}
                  onChange={handleChangeOrderItem(index, "quantity")}
                  sx={{
                    flex: "1"
                  }}
                />
                <IconButton
                  onClick={() => handleDelete(index)}
                  sx={{
                    backgroundColor: "red",
                    color: "white",
                    borderRadius: "50%",
                    border: "1px solid red",
                    "&:hover": {
                      backgroundColor: "#c62828"
                    },
                    width: 36,
                    height: 36
                  }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Stack>
            )
          })}
        </Box>
        <Button variant="contained" sx={{ mt: 7 }} onClick={handleCreateOrder}>
          Create order
        </Button>
      </Box>
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

export default CreateOrder
