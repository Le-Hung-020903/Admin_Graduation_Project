import * as React from "react"
import { DataGrid, GridColDef } from "@mui/x-data-grid"
import Paper from "@mui/material/Paper"
import Button from "@mui/material/Button"
import Box from "@mui/material/Box"
import IconButton from "@mui/material/IconButton"
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye"
import Select, { SelectChangeEvent } from "@mui/material/Select"
import MenuItem from "@mui/material/MenuItem"
import InputLabel from "@mui/material/InputLabel"
import FormControl from "@mui/material/FormControl"
import Chip from "@mui/material/Chip"
import Stack from "@mui/material/Stack"
import { getOrderAPI } from "../../api"
import { IOrder } from "../../interface/order"
import { Typography } from "@mui/material"
import { Link } from "react-router-dom"

const paginationModel = { page: 0, pageSize: 5 }

export default function Order() {
  const [age, setAge] = React.useState("")

  const handleChangeh = (event: SelectChangeEvent) => {
    setAge(event.target.value as string)
  }

  const [rows, setRow] = React.useState<IOrder[]>([])
  const [formData, setFormData] = React.useState({
    id: "",
    Recipient_name: "",
    Total_price: "",
    Slug: "",
    Created_at: ""
  })

  // Xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }
  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      align: "center",
      flex: 0.5,
      headerAlign: "center"
    },
    {
      field: "Product_item",
      headerName: "Product item",
      align: "center",
      flex: 1.5,
      headerAlign: "center",
      renderCell: (params) => {
        const more = params.row?.more
        return (
          <Stack
            direction={"row"}
            spacing={1}
            alignItems={"center"}
            justifyContent={"center"}
            mt={1}
          >
            <Stack
              display="flex"
              alignItems={"center"}
              justifyContent={"center"}
            >
              <img
                src={params.row?.Product_item?.images?.url}
                alt={params.row?.Product_item?.name}
                style={{
                  width: "50px", // giới hạn chiều rộng
                  height: "50px", // giới hạn chiều cao
                  objectFit: "cover", // giữ tỉ lệ, cắt dư nếu cần
                  borderRadius: "6px" // bo góc nếu thích
                }}
              />
            </Stack>
            {more && (
              <Typography variant="caption" color="text.secondary">
                {more}
              </Typography>
            )}
          </Stack>
        )
      }
    },
    {
      field: "Recipient_name",
      headerName: "Recipient name",
      align: "center",
      flex: 1.5,
      headerAlign: "center"
    },
    {
      field: "Total_price",
      headerName: "Total price",
      align: "center",
      flex: 1.5,
      headerAlign: "center"
    },
    {
      field: "Status",
      headerName: "Status",
      flex: 2,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        let color: "default" | "success" | "info" = "default"

        switch (params.row.Status) {
          case "CONFIRMED":
            color = "success"
            break
          case "WAITING_CONFIRMATION":
            color = "default"
            break
          // bạn có thể thêm các case khác nếu cần
          default:
            color = "info"
            break
        }

        return <Chip label={params.row.Status} color={color} />
      }
    },
    {
      field: "Payment_method",
      headerName: "Payment method",
      align: "center",
      flex: 1.5,
      headerAlign: "center"
    },
    {
      field: "Actions",
      headerAlign: "center",
      align: "center",
      flex: 2,
      headerName: "Actions",
      renderCell: (params) => (
        <Box>
          <Link to={`/order/${params.row.id}`}>
            <IconButton color="primary">
              <RemoveRedEyeIcon />
            </IconButton>
          </Link>
        </Box>
      )
    }
  ]

  React.useEffect(() => {
    const fetchOrderApi = async () => {
      const res = await getOrderAPI(1, 5, "DESC", "")
      setRow(
        res.data.map((item: IOrder) => ({
          id: item.id,
          Recipient_name: item.name,
          Status: item.status,
          Total_price: item.final_price,
          Product_item: item.product,
          more: item.more,
          Payment_method: item.payment_method
        }))
      )
    }
    fetchOrderApi()
  }, [])
  return (
    <Box>
      <Box>
        <Link to={"/order/create"}>
          <Button variant="contained" color="primary" sx={{ mb: 1 }}>
            Thêm mới
          </Button>
        </Link>
      </Box>
      <Stack
        direction={"row"}
        spacing={2}
        sx={{ mt: 2, mb: 3 }}
        alignItems={"center"}
      >
        <Box sx={{ minWidth: 200 }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">trạng thái</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={age}
              label="trạng thái"
              onChange={handleChangeh}
            >
              <MenuItem value={10}>Ten</MenuItem>
              <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={30}>Thirty</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ minWidth: 200 }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Thời gian</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={age}
              label="Thời gian"
              onChange={handleChangeh}
            >
              <MenuItem value={10}>Mới nhất</MenuItem>
              <MenuItem value={20}>Cũ nhất</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box>
          <Button variant="contained" color="primary">
            Lọc đơn hàng
          </Button>
        </Box>
      </Stack>
      <Paper sx={{ height: 650, width: "100%" }} elevation={6}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10]}
          checkboxSelection
          sx={{ border: 0, textAlign: "center" }}
          rowHeight={70}
        />
      </Paper>
    </Box>
  )
}
