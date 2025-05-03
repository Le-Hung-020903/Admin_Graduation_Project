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
import { getAllDiscountAPI, getProductList } from "../../../api"
import { formattedAmount } from "../../../utils/formatMoney"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import { useNavigate } from "react-router-dom"

const CreateOrder = () => {
  const navigate = useNavigate()

  const [age, setAge] = React.useState("")

  const handleGoBack = () => {
    navigate(-1) // Quay lại trang trước đó
  }

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
  const [order, setOrder] = useState({
    discount_id: 0,
    address_id: 0,
    note: "",
    payment_method: "",
    final_price: "",
    order_status: "",
    payment_status: ""
  })

  const [inputs, setInputs] = useState([
    { product_id: 0, variant_id: 0, quantity: 1, price: 0 }
  ])

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

  const handleChange = () => {}

  const handleDelete = (index: number) => {
    const newInputs = inputs.filter((_, i) => i !== index)
    setInputs(newInputs)
  }

  useEffect(() => {
    const fetchProductList = async () => {
      const res = await getProductList()
      setProductList(res.data)
    }
    const fetchDiscountCode = async () => {
      const res = await getAllDiscountAPI()
      setDiscountList(res.data)
    }
    fetchProductList()
    fetchDiscountCode()
  }, [])

  return (
    <Box>
      <Button
        startIcon={<ArrowBackIcon />}
        variant="outlined"
        onClick={handleGoBack}
        sx={{
          mb: 3, // margin bottom
          textTransform: "none", // không viết hoa chữ
          "&:hover": {
            backgroundColor: "#f5f5f5" // màu nền khi hover
          }
        }}
      >
        Quay lại
      </Button>
      <Typography
        variant="h4"
        sx={{
          mb: 3
        }}
      >
        Create Order
      </Typography>
      <Box
        sx={{
          width: "25%"
        }}
      >
        <Typography>Payment method</Typography>
        <Box sx={{ minWidth: 120, mt: 1 }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Payment</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Payment"
              value={order.payment_method || ""}
              onChange={handleChange}
            >
              <MenuItem value={"COD"}>COD</MenuItem>
              <MenuItem value={"QR_PAYMENT"}>QR_PAYMENT</MenuItem>
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
              value={order.payment_status || ""}
              label="Status"
              onChange={handleChange}
            >
              <MenuItem value={"PENDING"}>PENDING</MenuItem>
              <MenuItem value={"WAITING_CONFIRMATION"}>
                WAITING_CONFIRMATION
              </MenuItem>
              <MenuItem value={"SHIPPED"}>SHIPPED</MenuItem>
              <MenuItem value={"DELIVERED"}>DELIVERED</MenuItem>
              <MenuItem value={"CANCELED"}>CANCELED</MenuItem>
              <MenuItem value={"CONFIRMED"}>CONFIRMED</MenuItem>
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
              value={order.discount_id || 0}
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
          mt: 3
        }}
      >
        <Typography>Note</Typography>
        <TextField
          id="outlined-basic"
          label="Note"
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
      </Box>
    </Box>
  )
}

export default CreateOrder
