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
import { IAction, IModule } from "../../interface/module"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import RemoveIcon from "@mui/icons-material/Remove"
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import Alert from "@mui/material/Alert"
import { createModulesAPI } from "../../api"

const initialFormData = {
  id: 0,
  name: "",
  desc: ""
}

export default function Category() {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors }
  } = useForm<IModule>({
    mode: "onBlur"
  })
  const onSubmit: SubmitHandler<IAction> = (data) => {
    toast
      .promise(createModulesAPI(data), {
        pending: "Đang tạo module..."
      })
      .then((res) => {
        if (res.success) {
          toast.success("Tạo module thành công!")
          fetchModules()
          handleClose()
          reset()
          setInputValue("")
          setActions([])
        }
      })
  }
  const handleSubmitForm = handleSubmit(onSubmit)
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
      headerName: "Tên Module",
      flex: 2,
      align: "center",
      headerAlign: "center"
    },
    {
      field: "desc",
      headerName: "Mô tả",
      flex: 2,
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

  const [rows, setRows] = React.useState<IModule[]>([])
  const [open, setOpen] = React.useState<boolean>(false)
  const [editingRow, setEditingRow] = React.useState<number | null>(null)
  const [formData, setFormData] = React.useState<ICategory>(initialFormData)

  const [parent, setParent] = React.useState<ICategory[]>([])
  const [actions, setActions] = React.useState<IAction[]>([])
  const [inputValue, setInputValue] = React.useState<string>("")

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

  const handleDelete = async (id: number, name: string) => {
    if (confirm(`Bạn có muốn xoá danh mục ${name}`)) {
      await authorizedAxiosInstance.delete(`/category/${id}`)
      setRows((prev) => prev.filter((row) => row.id !== id))
      toast.success("Xóa danh mục thành công")
    }
  }

  const handleClose = (): void => setOpen(false)

  const fetchModules = async () => {
    const res = await authorizedAxiosInstance.get("/modules")
    const { data } = res.data

    setRows(
      data.map((item: IModule) => ({
        id: item.id,
        name: item.name,
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
    fetchModules()
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
      <Dialog
        open={open}
        onClose={handleClose}
        sx={{
          "& .MuiDialog-paper": {
            width: "550px", // Tăng độ rộng Dialog
            maxWidth: "90vw" // Đảm bảo không quá rộng trên màn hình nhỏ
          }
        }}
      >
        <DialogTitle>
          {editingRow !== null ? "Chỉnh sửa dữ liệu" : "Thêm mới dữ liệu"}
        </DialogTitle>
        <DialogContent>
          <Box>
            <TextField
              label="Name"
              fullWidth
              {...register("name", {
                required: "Tên module bắt buộc phải nhập"
              })}
              margin="dense"
            />
            {errors.name && (
              <Alert
                severity="error"
                sx={{
                  mt: "0.7em",
                  ".MuiAlert-message": { overflow: "hidden" }
                }}
              >
                {errors.name.message}
              </Alert>
            )}
          </Box>
          <Box>
            <TextField
              label="Desc"
              fullWidth
              {...register("desc", {
                required: "Tên mô tả bắt buộc phải nhập"
              })}
              margin="dense"
            />
            {errors.desc && (
              <Alert
                severity="error"
                sx={{
                  mt: "0.7em",
                  ".MuiAlert-message": { overflow: "hidden" }
                }}
              >
                {errors.desc.message}
              </Alert>
            )}
          </Box>

          <Controller
            name="actions"
            control={control}
            defaultValue={[]}
            render={({ field }) => (
              <TextField
                // value,        // Giá trị hiện tại của input
                // onChange,     // Hàm gọi khi giá trị thay đổi
                // onBlur,       // Hàm gọi khi input mất focus
                // ref,          // Ref dùng cho input
                // name          // Tên của field
                label="Action"
                fullWidth
                margin="dense"
                value={inputValue}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && inputValue.trim() !== "") {
                    const newActions = [...field.value, { name: inputValue }]
                    field.onChange(newActions) // Cập nhật react-hook-form
                    setActions(newActions) // Cập nhật state
                    setInputValue("")
                    e.preventDefault()
                  }
                }}
                onChange={(e) => setInputValue(e.target.value)}
              />
            )}
          />

          <List>
            {actions.map((action, index) => {
              return (
                <ListItem key={index}>
                  <ListItemIcon>
                    <RemoveIcon />
                  </ListItemIcon>
                  <ListItemText primary={action.name} />
                </ListItem>
              )
            })}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Hủy
          </Button>
          <Button
            type="submit"
            className="interceptor-loading"
            onClick={handleSubmitForm}
            color="primary"
          >
            {editingRow !== null ? "Lưu" : "Thêm"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
