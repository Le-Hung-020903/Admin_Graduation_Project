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
import Select from "@mui/material/Select"
import MenuItem from "@mui/material/MenuItem"
import InputLabel from "@mui/material/InputLabel"
import FormControl from "@mui/material/FormControl"

const paginationModel = { page: 0, pageSize: 5 }

export default function Order() {
  const initalRow = [
    {
      id: 1,
      Recipient_name: "Lê đình hùng",
      Total_price: "100.000 VND",
      Parent_id: 0,
      Created_at: "2024-03-05"
    },
    {
      id: 2,
      Recipient_name: "Lê đình nam",
      Total_price: "100.000 VND",
      Parent_id: 1,
      Created_at: "2024-03-05"
    },
    {
      id: 3,
      Recipient_name: "lê đình trình",
      Total_price: "100.000 VND",
      Parent_id: 1,
      Created_at: "2024-03-05"
    }
  ]
  const [rows, setRow] = React.useState(initalRow)
  const [open, setOpen] = React.useState(false)
  const [editingRow, setEditingRow] = React.useState(null)
  const [formData, setFormData] = React.useState({
    id: "",
    Recipient_name: "",
    Total_price: "",
    Parent_id: "",
    Slug: "",
    Created_at: ""
  })
  const handleOpen = (row = null) => {
    if (row) {
      setEditingRow(row.id)
      setFormData(row)
    } else {
      setEditingRow(null)
      setFormData({
        id: "",
        Recipient_name: "",
        Total_price: "",
        Parent_id: "",
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
      width: 90,
      align: "center",
      headerAlign: "center"
    },
    {
      field: "Recipient_name",
      headerName: "Recipient name",
      width: 200,
      align: "center",
      headerAlign: "center"
    },
    {
      field: "Total_price",
      headerName: "Total price",
      width: 200,
      align: "center",
      headerAlign: "center"
    },
    {
      field: "Parent_id",
      headerName: "Parent_id",
      type: "number",
      width: 100,
      align: "center",
      headerAlign: "center"
    },
    {
      field: "Status",
      headerName: "Status",
      width: 300,
      renderCell: (params) => (
        <Box sx={{ minWidth: 80, minHeight: 40 }}>
          <FormControl fullWidth size="small" margin="dense">
            <InputLabel id="status-label">Status</InputLabel>
            <Select
              labelId="status-label"
              name="Status"
              value={formData.Status}
              onChange={handleChange}
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="cancel">Cancel</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
            </Select>
          </FormControl>
        </Box>
      ),
      align: "center",
      headerAlign: "center"
    },
    {
      field: "Created_at",
      headerName: "Created_at",
      width: 170
    },
    {
      field: "Actions",
      headerName: "Actions",
      width: 150,
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
            label="Parent ID"
            name="Parent_id"
            fullWidth
            margin="dense"
            value={formData.Parent_id}
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
