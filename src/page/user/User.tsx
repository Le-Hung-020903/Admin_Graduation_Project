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
import dayjs from "dayjs"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import FormControl from "@mui/material/FormControl"
import ListItemText from "@mui/material/ListItemText"
import Select, { SelectChangeEvent } from "@mui/material/Select"
import Checkbox from "@mui/material/Checkbox"
import OutlinedInput from "@mui/material/OutlinedInput"

import {
  createRoleAPI,
  createUserAPI,
  deleteUserAPI,
  getRoleAPI,
  getUserAPI,
  updateUserAPI
} from "../../api"
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import {
  EMAIL_RULE,
  EMAIL_RULE_MESSAGE,
  NAME_RULE,
  PASSWORD_RULE,
  PASSWORD_RULE_MESSAGE,
  PHONE_RULE,
  PHONE_RULE_MESSAGE
} from "../../utils/validators"
import Alert from "@mui/material/Alert"
import { toast } from "react-toastify"
import { IUser } from "../../interface/user"
import { IRole } from "../../interface/role"
import { getPermissionAPI } from "../../redux/middleware/permission.middleware"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch } from "../../redux/store"
import { selectPermission } from "../../redux/slice/permission.slice"
import { hasPermission } from "../../utils/hasPermission"

const initialFormData: IUser = {
  name: "",
  email: "",
  status: false,
  phone: "",
  created_at: ""
}

export default function User() {
  const dispatch = useDispatch<AppDispatch>()
  const permissions = useSelector(selectPermission)
  const [rows, setRow] = React.useState<IUser[]>([])
  const [open, setOpen] = React.useState<boolean>(false)
  const [roles, setRoles] = React.useState<IRole[]>([])
  const [id, setId] = React.useState<number[]>([])
  const [editingRow, setEditingRow] = React.useState<number | null>(null)
  const [formData, setFormData] = React.useState<IUser>(initialFormData)
  const [pagination, setPagination] = React.useState({
    total: 0,
    page: 1,
    limit: 6
  })

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors }
  } = useForm<IUser>({
    mode: "onBlur"
  })

  const onSubmit: SubmitHandler<IUser> = (data) => {
    const { name, email, status, phone, password } = data
    const formattedData = {
      name,
      email,
      status,
      phone,
      password
    }
    if (editingRow === null) {
      toast
        .promise(createUserAPI(formattedData), {
          pending: "Đang tạo người dùng..."
        })
        .then((res) => {
          if (res.success) {
            toast.success("Tạo người dùng thành công!")
            fetchUser(1, 6)
            reset()
            handleClose()
          }
        })
    } else {
      toast
        .promise(
          updateUserAPI(
            {
              name,
              email,
              status,
              phone
            },
            formData.id ? formData.id : 0
          ),
          {
            pending: "Đang cập nhật người dùng..."
          }
        )
        .then((res) => {
          if (res.success) {
            toast.success("Cập nhật người dùng thành công!")
            fetchUser(1, 6)
            handleClose()
          }
        })
    }
  }

  const handleSubmitForm = handleSubmit(onSubmit)

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      flex: 0.3,
      align: "center",
      headerAlign: "center"
    },
    {
      field: "name",
      headerName: "Tên",
      flex: 1,
      align: "center",
      headerAlign: "center"
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1.5,
      align: "center",
      headerAlign: "center"
    },
    {
      field: "status",
      headerName: "Trạng thái",
      flex: 0.8,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        return (
          <Alert
            severity={params.row.status ? "success" : "error"}
            sx={{
              mt: "0.7em",
              ".MuiAlert-message": { overflow: "hidden" }
            }}
          >
            {String(params.row.status)}
          </Alert>
        )
      }
    },
    {
      field: "phone",
      headerName: "Số điện thoại",
      flex: 0.8,
      align: "center",
      headerAlign: "center"
    },
    {
      field: "roles",
      headerName: "Vai trò",
      flex: 1.5,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const selectedRoles = Array.isArray(params.row.roles)
          ? params.row.roles.map((r: IRole) => r.id)
          : []

        const handleChange = (event: SelectChangeEvent<number[]>) => {
          const selectedValues = event.target.value as number[]
          setId(selectedValues)
          const userId = params.row.id
          const role_ids = selectedValues
          toast.promise(createRoleAPI(role_ids, userId), {}).then((res) => {
            if (res.success) {
              toast.success(`Thêm vai trò cho ${params.row.name} thành công`)
              dispatch(getPermissionAPI())
            }
          })
        }
        return (
          <FormControl sx={{ m: 1, width: 200, height: 80 }}>
            <InputLabel>Vai trò</InputLabel>
            <Select
              multiple
              value={selectedRoles}
              onChange={handleChange}
              input={<OutlinedInput label="Vai trò" />}
              renderValue={
                (selected) =>
                  roles
                    .filter((role) => selected.includes(role.id))
                    .map((role) => role.name)
                    .join(", ") // hiển thị name
              }
            >
              {roles.map((role) => (
                <MenuItem key={role.id} value={role.id}>
                  <Checkbox checked={id.includes(role.id)} />
                  <ListItemText primary={role.name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )
      }
    },
    {
      field: "created_at",
      headerName: "Ngày tạo",
      flex: 1,
      align: "center",
      headerAlign: "center"
    },
    {
      field: "Actions",
      headerName: "Actions",
      align: "center",
      headerAlign: "center",
      flex: 0.7,
      width: 150,
      renderCell: (params) => (
        <Box>
          {hasPermission(permissions, "users.update") && (
            <IconButton color="primary" onClick={() => handleOpen(params.row)}>
              <EditIcon />
            </IconButton>
          )}
          {hasPermission(permissions, "users.delete") && (
            <IconButton
              color="error"
              onClick={() => handleDelete(params.row.id, params.row.name)}
            >
              <DeleteIcon />
            </IconButton>
          )}
        </Box>
      )
    }
  ]

  const handleOpen = (row = null) => {
    if (row) {
      setEditingRow(row.id)
      setFormData(row)
      reset(row) // Reset form với dữ liệu mới
    } else {
      setEditingRow(null)
      setFormData(initialFormData)
      reset(initialFormData) // Reset về giá trị mặc định
    }
    setOpen(true)
  }

  const handleClose = () => setOpen(false)

  const handleDelete = (id: number, name: string) => {
    if (confirm(`Bạn có chắc chắn muốn mã ${name} xóa không?`)) {
      toast
        .promise(deleteUserAPI(id), {
          pending: "Đang xóa mã khuyến mãi"
        })
        .then((res) => {
          if (res.success) {
            toast.success(res.message)
            setRow((pre) => {
              return pre.filter((row) => row.id !== id)
            })
          }
        })
    }
  }

  const fetchUser = async (page: number, limit: number) => {
    const { data, pagination } = await getUserAPI(page, limit)
    setRow(
      data.map((item: IUser) => ({
        id: item.id,
        name: item.name,
        email: item.email,
        status: item.status,
        phone: item.phone,
        roles: item.roles,
        created_at: dayjs(item.created_at).format("DD/MM/YYYY HH:mm:ss")
      }))
    )
    setPagination((pre) => ({
      ...pre,
      total: pagination?.total || 0
    }))
    setId(data.flatMap((item: IUser) => item.roles.map((r) => r.id)))
  }

  const fetchRole = async () => {
    const { data } = await getRoleAPI()
    setRoles(
      data.map((role: IRole) => {
        return {
          id: role.id,
          name: role.name
        }
      })
    )
  }

  React.useEffect(() => {
    fetchUser(pagination.page, pagination.limit)
    fetchRole()
  }, [pagination.page, pagination.limit])

  return (
    <Box>
      {hasPermission(permissions, "users.insert") && (
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
      )}
      <Paper sx={{ height: 600, width: "100%" }} elevation={6}>
        <DataGrid
          rows={rows}
          columns={columns}
          checkboxSelection
          sx={{ border: 0, textAlign: "center" }}
          rowHeight={70}
          paginationMode="server"
          rowCount={pagination.total}
          pageSizeOptions={[5, 10]}
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
      {/* <form onSubmit={handleSubmit(onSubmit)}> */}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-modal="true"
        disableAutoFocus={false}
        disableEnforceFocus={false}
        disableRestoreFocus={false}
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
              label="Tên"
              defaultValue={formData.name}
              fullWidth
              error={!!errors["name"]}
              margin="dense"
              {...register("name", {
                required: "Tên người dùng giá bắt buộc phải nhập",
                pattern: {
                  value: NAME_RULE,
                  message: "Tên người dùng phải lớn hơn 3 ký tự"
                }
              })}
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
          <Box
            sx={{
              mt: 2
            }}
          >
            <TextField
              label="Email"
              defaultValue={formData.email}
              error={!!errors["email"]}
              {...register("email", {
                required: "Email bắt buộc phải nhập",
                pattern: {
                  value: EMAIL_RULE,
                  message: EMAIL_RULE_MESSAGE
                }
              })}
              fullWidth
              margin="dense"
            />
            {errors.email && (
              <Alert
                severity="error"
                sx={{
                  mt: "0.7em",
                  ".MuiAlert-message": { overflow: "hidden" }
                }}
              >
                {errors.email.message}
              </Alert>
            )}
          </Box>
          <Box
            sx={{
              my: 2
            }}
          >
            <Controller
              name="status"
              control={control}
              rules={{ required: "Trạng thái bắt buộc phải chọn" }}
              render={({ field }) => (
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select {...field} label="Status" value={field.value ?? ""}>
                    <MenuItem value={"true"}>True</MenuItem>
                    <MenuItem value={"false"}>False</MenuItem>
                  </Select>
                </FormControl>
              )}
            />
          </Box>
          <Box
            sx={{
              mt: 2,
              mb: 0.4
            }}
          >
            <TextField
              label="Số điện thoại"
              defaultValue={formData.phone}
              error={!!errors["phone"]}
              {...register("phone", {
                required: "Số điện thoại bắt buộc phải nhập",
                pattern: {
                  value: PHONE_RULE,
                  message: PHONE_RULE_MESSAGE
                }
              })}
              fullWidth
              margin="dense"
            />
            {errors.phone && (
              <Alert
                severity="error"
                sx={{
                  mt: "0.7em",
                  ".MuiAlert-message": { overflow: "hidden" }
                }}
              >
                {errors.phone.message}
              </Alert>
            )}
          </Box>
          {!editingRow && (
            <Box
              sx={{
                mt: 2,
                mb: 0.4
              }}
            >
              <TextField
                label="Mật khẩu"
                error={!!errors["password"]}
                {...register("password", {
                  required: "Mật khẩu bắt buộc phải nhập",
                  pattern: {
                    value: PASSWORD_RULE,
                    message: PASSWORD_RULE_MESSAGE
                  }
                })}
                fullWidth
                margin="dense"
              />
              {errors.password && (
                <Alert
                  severity="error"
                  sx={{
                    mt: "0.7em",
                    ".MuiAlert-message": { overflow: "hidden" }
                  }}
                >
                  {errors.password.message}
                </Alert>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Hủy
          </Button>
          <Button
            type="submit"
            className="interceptor-loading"
            onClick={handleSubmitForm}
          >
            {editingRow !== null ? "Lưu" : "Thêm"}
          </Button>
        </DialogActions>
      </Dialog>
      {/* </form> */}
    </Box>
  )
}
