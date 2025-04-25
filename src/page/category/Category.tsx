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
import { ICategory } from "../../interface/category"
import authorizedAxiosInstance from "../../utils/axios"
import { toast } from "react-toastify"
import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import Select, { SelectChangeEvent } from "@mui/material/Select"

const initialFormData = {
  id: 0,
  name: "",
  desc: "",
  parent: {
    id: 0,
    name: "",
    desc: "",
    slug: ""
  },
  slug: ""
}

export default function Category() {
  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      flex: 0.5,
      align: "center",
      headerAlign: "center"
    },
    {
      field: "name",
      headerName: "First name",
      flex: 2,
      align: "center",
      headerAlign: "center"
    },
    {
      field: "slug",
      headerName: "Slug",
      flex: 2,
      align: "center",
      headerAlign: "center"
    },
    {
      field: "parent",
      headerName: "Parent",
      type: "number",
      flex: 2,
      align: "center",
      headerAlign: "center"
    },
    {
      field: "desc",
      headerName: "Desc",
      flex: 1,
      align: "center",
      headerAlign: "center"
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <Box>
          <IconButton color="primary" onClick={() => handleOpen(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton
            color="error"
            onClick={() => handleDelete(params.row.id, params.row.name)}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
      align: "center",
      headerAlign: "center"
    }
  ]

  const [rows, setRows] = React.useState<ICategory[]>([])
  const [open, setOpen] = React.useState<boolean>(false)
  const [editingRow, setEditingRow] = React.useState<number | null>(null)
  const [formData, setFormData] = React.useState<ICategory>(initialFormData)

  const [parent, setParent] = React.useState<ICategory[]>([])

  const handleOpen = async (row: ICategory | null = null) => {
    if (row) {
      setEditingRow(row.id as number)
      setFormData(row)
    } else {
      setEditingRow(null)
      setFormData(initialFormData)
    }
    const res = await authorizedAxiosInstance.get("category/getAll")
    setParent(res.data.data)
    setOpen(true)
  }

  // Xử lý thay đổi input
  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent<number>
  ) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "parent"
          ? parent.find((item) => item.id === Number(value)) || null
          : value
    }))
  }

  const handleDelete = async (id: number, name: string) => {
    if (confirm(`Bạn có muốn xoá danh mục ${name}`)) {
      await authorizedAxiosInstance.delete(`/category/${id}`)
      setRows((prev) => prev.filter((row) => row.id !== id))
      toast.success("Xóa danh mục thành công")
    }
  }

  const handleSubmit = async () => {
    const payload = {
      ...formData,
      parent: formData.parent?.id || null
    }
    const data = {
      name: payload.name,
      parent: payload.parent
    }
    if (editingRow !== null) {
      // Gọi API cập nhật dữ liệu
      await authorizedAxiosInstance.patch(`/category/${editingRow}`, payload)
    } else {
      // Gọi API thêm mới dữ liệu
      await authorizedAxiosInstance.post("/category/create", data)
    }
    toast.success(
      editingRow !== null
        ? "Cập nhật danh mục thành công"
        : "Thêm mới danh mục thành công"
    )

    setOpen(false) // Đóng modal nhưng KHÔNG reset formData
    fetchCategory(pagination.page, pagination.limit) // Load lại danh sách
  }

  const handleClose = (): void => setOpen(false)

  const fetchCategory = async (page: number, limit: number) => {
    const res = await authorizedAxiosInstance.get(
      `/category?_page=${page}&_limit=${limit}`
    )
    const { data, pagination } = res.data

    setRows(
      data.map((item: ICategory) => ({
        id: item.id,
        name: item.name,
        slug: item.slug,
        parent: item.parent ? item.parent.name : "Không có",
        desc: item.desc
      }))
    )
    setPagination((prev) => ({
      ...prev,
      total: pagination?.total || 0
    }))
  }

  const [pagination, setPagination] = React.useState({
    total: 0,
    page: 1,
    limit: 5
  })

  React.useEffect(() => {
    fetchCategory(pagination.page, pagination.limit)
  }, [pagination.page, pagination.limit])

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
          checkboxSelection
          sx={{ border: 0, textAlign: "center", width: "100%" }}
          paginationMode="server"
          rowCount={pagination.total}
          paginationModel={{
            page: pagination.page - 1,
            pageSize: pagination.limit
          }}
          onPaginationModelChange={(model) => {
            setPagination((prev) => ({
              ...prev,
              page: model.page + 1,
              limit: model.pageSize
            }))
          }}
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
            name="name"
            fullWidth
            margin="dense"
            value={formData.name}
            onChange={handleChange}
          />
          <TextField
            label="Desc"
            name="desc"
            fullWidth
            margin="dense"
            value={formData.desc}
            onChange={handleChange}
          />
          <FormControl
            fullWidth
            sx={{
              my: 1
            }}
          >
            <InputLabel id="select-label">Parent</InputLabel>
            <Select
              labelId="select-label"
              id="simple-select"
              name="parent"
              value={formData.parent?.id || ""}
              label="Parent"
              onChange={handleChange}
            >
              {parent.map((item: ICategory) => (
                <MenuItem key={item.id} value={item.id}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Slug"
            name="slug"
            fullWidth
            margin="dense"
            value={formData.slug}
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
