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
import Typography from "@mui/material/Typography"
import { Link, useNavigate } from "react-router-dom"
import { formattedAmount } from "../../utils/formatMoney"

export default function Order() {
  const navigate = useNavigate()

  const [pagination, setPagination] = React.useState({
    total: 0,
    page: 1,
    limit: 3
  })

  const defaultFilter = {
    status: "",
    sort: "DESC"
  }
  const [filter, setFilter] = React.useState(defaultFilter)

  const handleFilter = () => {
    const params = new URLSearchParams()
    if (filter.status) params.set("_status", filter.status)
    if (filter.sort) params.set("_sort", filter.sort)
    navigate(`?${params.toString()}`)

    fetchOrderApi(filter.status.trim(), filter.sort.trim())
  }

  const handleClearFilter = () => {
    setFilter(defaultFilter)
    navigate("?")
    fetchOrderApi("", "DESC")
  }

  const [rows, setRow] = React.useState<IOrder[]>([])

  // Xử lý thay đổi input
  const handleChange = (
    e:
      | SelectChangeEvent
      | React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target
    setFilter((prev) => ({ ...prev, [name]: value }))
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

  const fetchOrderApi = React.useCallback(
    async (status: string = "", sort: string = "DESC") => {
      const res = await getOrderAPI(
        pagination.page,
        pagination.limit,
        sort,
        status
      )
      const { data, pagination: paginationData } = res

      setRow(
        data.map((item: IOrder) => ({
          id: item.id,
          Recipient_name: item.name,
          Status: item.status,
          Total_price: formattedAmount(Number(item.final_price)),
          Product_item: item.product,
          more: item.more,
          Payment_method: item.payment_method
        }))
      )

      setPagination((pre) => ({
        ...pre,
        total: paginationData?.total || 0
      }))
    },
    [pagination.page, pagination.limit]
  )

  React.useEffect(() => {
    fetchOrderApi("", "DESC")
  }, [fetchOrderApi])

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
              name={"status"}
              value={filter.status || ""}
              label="trạng thái"
              onChange={handleChange}
            >
              <MenuItem value={"All"}>Tất cả</MenuItem>
              <MenuItem value={"PENDING"}>Chờ xử lý</MenuItem>
              <MenuItem value={"WAITING_CONFIRMATION"}>Chờ xác nhận</MenuItem>
              <MenuItem value={"SHIPPED"}>Đang giao hàng</MenuItem>
              <MenuItem value={"DELIVERED"}>Đã giao</MenuItem>
              <MenuItem value={"CANCELED"}>Đã hủy</MenuItem>
              <MenuItem value={"CONFIRMED"}>Đã xác nhận</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ minWidth: 200 }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Thời gian</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              name={"sort"}
              value={filter.sort || ""}
              label="Thời gian"
              onChange={handleChange}
            >
              <MenuItem value={"DESC"}>Mới nhất</MenuItem>
              <MenuItem value={"ASC"}>Cũ nhất</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box>
          <Button variant="contained" color="primary" onClick={handleFilter}>
            {rows.length === 0 ? "Đang lọc..." : "Lọc đơn hàng"}
          </Button>
        </Box>
        {filter.status && (
          <Box>
            <Chip
              label="Xoá bộ lọc"
              variant="outlined"
              onClick={handleClearFilter}
            />
          </Box>
        )}
      </Stack>
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
    </Box>
  )
}
