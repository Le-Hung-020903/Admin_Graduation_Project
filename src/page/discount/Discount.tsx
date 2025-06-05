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
import { DemoContainer } from "@mui/x-date-pickers/internals/demo"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker"
import {
  createDiscountAPI,
  deleteDiscountAPI,
  getDiscountAPI,
  updateDiscountAPI
} from "../../api"
import { IDiscount } from "../../interface/discount"
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import { NAME_RULE } from "../../utils/validators"
import Alert from "@mui/material/Alert"
import { toast } from "react-toastify"
import { useSelector } from "react-redux"
import { selectPermission } from "../../redux/slice/permission.slice"
import { hasPermission } from "../../utils/hasPermission"

const initialFormData: IDiscount = {
  content: "",
  code_discount: "",
  start_date: "",
  end_date: "",
  percent: 1,
  created_at: ""
}

export default function Discount() {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors }
  } = useForm<IDiscount>({
    mode: "onBlur"
  })

  const onSubmit: SubmitHandler<IDiscount> = (data) => {
    const { start_date, end_date, content, percent, code_discount } = data
    const formattedData = {
      content,
      percent,
      code_discount,
      start_date: dayjs(start_date).format("YYYY-MM-DD HH:mm:ss"),
      end_date: dayjs(end_date).format("YYYY-MM-DD HH:mm:ss")
    }
    if (editingRow !== null) {
      toast
        .promise(
          updateDiscountAPI(formData.id ? formData.id : 0, formattedData),
          {
            pending: "Đang cập nhật mã khuyễn mãi"
          }
        )
        .then((res) => {
          if (res.success) {
            toast.success("Cập nhật mã khuyễn mãi thành công!")
            fetchDiscount(pagination.page, pagination.limit)
            handleClose()
          }
        })
    } else {
      toast
        .promise(createDiscountAPI(formattedData), {
          pending: "Đang tạo mã khuyễn mãi"
        })
        .then((res) => {
          if (res.success) {
            toast.success("Tạo mã khuyễn mãi thành công!")
            fetchDiscount(pagination.page, pagination.limit)
            reset()
          }
        })
    }
  }
  const permissions = useSelector(selectPermission)
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
      field: "content",
      headerName: "name",
      flex: 1,
      align: "center",
      headerAlign: "center"
    },
    {
      field: "code_discount",
      headerName: "code discount",
      flex: 1,
      align: "center",
      headerAlign: "center"
    },
    {
      field: "start_date",
      headerName: "start date",
      flex: 1,
      align: "center",
      headerAlign: "center"
    },
    {
      field: "end_date",
      headerName: "end date",
      flex: 1,
      type: "number",
      align: "center",
      headerAlign: "center"
    },
    {
      field: "percent",
      headerName: "percent",
      flex: 0.5,
      type: "number",
      align: "center",
      headerAlign: "center"
    },
    {
      field: "created_at",
      flex: 1,
      align: "center",
      headerAlign: "center",
      headerName: "created at"
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
          {hasPermission(permissions, "discounts.update") && (
            <IconButton color="primary" onClick={() => handleOpen(params.row)}>
              <EditIcon />
            </IconButton>
          )}

          {hasPermission(permissions, "discounts.delete") && (
            <IconButton
              color="error"
              onClick={() => handleDelete(params.row.id, params.row.content)}
            >
              <DeleteIcon />
            </IconButton>
          )}
        </Box>
      )
    }
  ]
  const [rows, setRow] = React.useState<IDiscount[]>([])
  const [open, setOpen] = React.useState<boolean>(false)
  const [editingRow, setEditingRow] = React.useState<number | null>(null)
  const [formData, setFormData] = React.useState<IDiscount>(initialFormData)

  const handleOpen = (row = null) => {
    if (row) {
      setEditingRow(row.id)
      setFormData(row)
    } else {
      setEditingRow(null)
      setFormData(initialFormData)
    }
    setOpen(true)
  }

  const handleClose = () => setOpen(false)

  const [pagination, setPagination] = React.useState({
    total: 0,
    page: 1,
    limit: 5
  })

  const handleDelete = (id: number, name: string) => {
    if (confirm(`Bạn có chắc chắn muốn mã ${name} xóa không?`)) {
      toast
        .promise(deleteDiscountAPI(id), {
          pending: "Đang xóa mã khuyến mãi"
        })
        .then((res) => {
          if (res.success) {
            toast.success("Xóa mã khuyến mãi thành công!")
            setRow((pre) => {
              return pre.filter((row) => row.id !== id)
            })
            fetchDiscount(pagination.page, pagination.limit)
          }
        })
    }
  }

  const fetchDiscount = async (page: number, limit: number) => {
    const { data, pagination } = await getDiscountAPI(page, limit)
    setRow(
      data.map((item: IDiscount) => ({
        id: item.id,
        content: item.content,
        code_discount: item.code_discount,
        start_date: dayjs(item.start_date).format("YYYY-MM-DD HH:mm:ss"),
        end_date: dayjs(item.end_date).format("YYYY-MM-DD HH:mm:ss"),
        percent: item.percent,
        created_at: dayjs(item.created_at).format("YYYY-MM-DD HH:mm:ss")
      }))
    )

    setPagination((pre) => ({
      ...pre,
      total: pagination?.total || 0
    }))
  }

  React.useEffect(() => {
    fetchDiscount(pagination.page, pagination.limit)
  }, [pagination.page, pagination.limit])
  return (
    <Box>
      <Box>
        {hasPermission(permissions, "discounts.insert") && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleOpen()}
            sx={{ mb: 1 }}
          >
            Thêm mới
          </Button>
        )}
      </Box>
      <Paper sx={{ height: 650, width: "100%" }} elevation={6}>
        <DataGrid
          rows={rows}
          columns={columns}
          checkboxSelection
          sx={{ border: 0, textAlign: "center" }}
          rowHeight={70}
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
      {/* <form onSubmit={handleSubmit(onSubmit)}> */}
      <Dialog
        open={open}
        onClose={handleClose}
        // keepMounted
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
              label="Content"
              defaultValue={formData.content}
              fullWidth
              error={!!errors["content"]}
              margin="dense"
              {...register("content", {
                required: "Nội dung mã giảm giá bắt buộc phải nhập",
                pattern: {
                  value: NAME_RULE,
                  message: "Nội dung mã phải lớn hơn 3 ký tự"
                }
              })}
            />
            {errors.content && (
              <Alert
                severity="error"
                sx={{
                  mt: "0.7em",
                  ".MuiAlert-message": { overflow: "hidden" }
                }}
              >
                {errors.content.message}
              </Alert>
            )}
          </Box>
          <Box
            sx={{
              mt: 2
            }}
          >
            <TextField
              label="Code discount"
              defaultValue={formData.code_discount}
              error={!!errors["code_discount"]}
              {...register("code_discount", {
                required: "Nội dung mã giảm giá bắt buộc phải nhập",
                pattern: {
                  value: NAME_RULE,
                  message: "Tên mã phải lớn hơn 3 ký tự"
                }
              })}
              fullWidth
              margin="dense"
            />
            {errors.code_discount && (
              <Alert
                severity="error"
                sx={{
                  mt: "0.7em",
                  ".MuiAlert-message": { overflow: "hidden" }
                }}
              >
                {errors.code_discount.message}
              </Alert>
            )}
          </Box>
          <Box
            sx={{
              mt: 2,
              my: 0.4
            }}
          >
            <Controller
              name="start_date"
              control={control}
              rules={{ required: "Vui lòng chọn ngày bắt đầu" }}
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={["DateTimePicker"]}>
                    <DateTimePicker
                      label="Start Date"
                      {...field}
                      value={field.value ? dayjs(field.value) : null} // ✅ Chuyển thành dayjs nếu có giá trị
                      defaultValue={
                        formData.start_date ? dayjs(formData.start_date) : null
                      }
                      onChange={field.onChange} // ✅ React Hook Form tự xử lý state
                      slotProps={{
                        textField: {
                          error: !!errors.start_date,
                          helperText: errors.start_date?.message
                        }
                      }}
                    />
                  </DemoContainer>
                </LocalizationProvider>
              )}
            />
          </Box>
          <Box
            sx={{
              mt: 2,
              mb: 0.4
            }}
          >
            <Controller
              name="end_date"
              control={control}
              rules={{ required: "Vui lòng chọn ngày kết thúc" }}
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={["DateTimePicker"]}>
                    <DateTimePicker
                      label="End Date"
                      {...field}
                      value={field.value ? dayjs(field.value) : null} // ✅ Chuyển thành dayjs nếu có giá trị
                      defaultValue={
                        formData.end_date ? dayjs(formData.end_date) : null
                      }
                      onChange={field.onChange} // ✅ React Hook Form tự xử lý state
                      slotProps={{
                        textField: {
                          error: !!errors.end_date,
                          helperText: errors.end_date?.message
                        }
                      }}
                    />
                  </DemoContainer>
                </LocalizationProvider>
              )}
            />
          </Box>
          <Box
            sx={{
              mt: 2
            }}
          >
            <TextField
              label="precent"
              error={!!errors["percent"]}
              defaultValue={formData.percent}
              {...register("percent", {
                required: "Phần trăm giảm giá bắt buộc phải nhập",
                min: {
                  value: 1,
                  message: "Phần trăm mã giảm giá phải lớn hơn 0"
                }
              })}
              fullWidth
              margin="dense"
            />
            {errors.percent && (
              <Alert
                severity="error"
                sx={{
                  mt: "0.7em",
                  ".MuiAlert-message": { overflow: "hidden" }
                }}
              >
                {errors.percent.message}
              </Alert>
            )}
          </Box>
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
