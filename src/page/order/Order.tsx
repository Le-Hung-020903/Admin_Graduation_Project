import * as React from "react"
import { DataGrid, GridColDef } from "@mui/x-data-grid"
import Paper from "@mui/material/Paper"
import Button from "@mui/material/Button"
import Box from "@mui/material/Box"
import IconButton from "@mui/material/IconButton"
import DeleteIcon from "@mui/icons-material/Delete"
import EditIcon from "@mui/icons-material/Edit"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import TextField from "@mui/material/TextField"
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

const paginationModel = { page: 0, pageSize: 5 }

export default function Order() {
  const [age, setAge] = React.useState("")

  const handleChangeh = (event: SelectChangeEvent) => {
    setAge(event.target.value as string)
  }

  const [rows, setRow] = React.useState<IOrder[]>([])
  const [open, setOpen] = React.useState(false)
  const [editingRow, setEditingRow] = React.useState(null)
  const [formData, setFormData] = React.useState({
    id: "",
    Recipient_name: "",
    Total_price: "",
    Slug: "",
    Created_at: ""
  })
  const handleOpen = (row = null) => {
    if (row) {
      setEditingRow(row?.id)
      setFormData(row)
    } else {
      setEditingRow(null)
      setFormData({
        id: "",
        Recipient_name: "",
        Total_price: "",
        Slug: "",
        Created_at: ""
        // Status: "pending"
      })
    }
    setOpen(true)
  }
  // Xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }
  const handleDelete = (id: number) => {}
  const handleSubmit = () => {}
  const handleClose = () => setOpen(false)
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
          <Stack>
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
          <IconButton color="primary" onClick={() => handleOpen(params.row)}>
            <RemoveRedEyeIcon />
          </IconButton>
          <IconButton color="primary" onClick={() => handleOpen(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton color="error" onClick={() => handleDelete(params.row.id)}>
            <DeleteIcon />
          </IconButton>
        </Box>
      )
    }
  ]

  React.useEffect(() => {
    const fetchOrderApi = async () => {
      const res = await getOrderAPI(1, 5, "DESC", "")
      setRow(
        res.data.map((item: IOrder) => ({
          id: item.order_code,
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
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleOpen()}
          sx={{ mb: 1 }}
        >
          Thêm mới
        </Button>
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
      {/* Modal nhập dữ liệu */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {editingRow !== null ? "Chỉnh sửa dữ liệu" : "Thêm mới dữ liệu"}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            name="Name"
            fullWidth
            margin="dense"
            value={formData.Name}
            onChange={handleChange}
          />
          <TextField
            label="Desc"
            name="Desc"
            fullWidth
            margin="dense"
            value={formData.Desc}
            onChange={handleChange}
          />

          <TextField
            label="Slug"
            name="Slug"
            fullWidth
            margin="dense"
            value={formData.Slug}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Hủy
          </Button>
          <Button onClick={handleSubmit} color="primary">
            {editingRow !== null ? "Lưu" : "Thêm"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
