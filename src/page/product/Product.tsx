import * as React from "react"
import { DataGrid, GridColDef } from "@mui/x-data-grid"
import Paper from "@mui/material/Paper"
import Button from "@mui/material/Button"
import Box from "@mui/material/Box"
import IconButton from "@mui/material/IconButton"
import DeleteIcon from "@mui/icons-material/Delete"
import { toast } from "react-toastify"
import { Link } from "react-router-dom"
import authorizedAxiosInstance from "../../utils/axios"
import { RemoveRedEye } from "@mui/icons-material"
import { IProduct } from "../../interface/product"
import { deleteProductAPI } from "../../api"

const Product = () => {
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
      headerName: "Name",
      flex: 1,
      align: "center",
      headerAlign: "center"
    },
    {
      field: "category",
      headerName: "Category",
      flex: 1,

      align: "center",
      headerAlign: "center"
    },
    {
      field: "images",
      headerName: "Images",
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderCell: (params) =>
        params.value.map((item, i: number) => (
          <Box key={i}>
            <img src={item.url} alt="img" style={{ width: 50, height: 50 }} />
          </Box>
        ))
    },
    {
      field: "variants",
      headerName: "Variants",
      width: 200,
      align: "center",
      headerAlign: "center",
      renderCell: (params) =>
        params.value.map((item, i: number) => (
          <Box key={i}>
            {item.price} {item.unit.symbol}
          </Box>
        ))
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <Box>
          <Link to={`/product/${params.row.id}`}>
            <IconButton color="primary">
              <RemoveRedEye />
            </IconButton>
          </Link>

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

  const [rows, setRows] = React.useState<IProduct[]>([])

  const [pagination, setPagination] = React.useState({
    total: 0,
    page: 1,
    limit: 6
  })

  const handleDelete = async (id: number, name: string) => {
    if (confirm(`Bạn có chắc chắn xoá sản phẩm ${name} không ?`)) {
      toast
        .promise(deleteProductAPI(id), {
          pending: "Đang xóa sản phẩm"
        })
        .then((res) => {
          if (res.success) {
            toast.success("Xóa sản phẩm thành công")
            setRows((prev) => prev.filter((row) => row.id !== id))
          }
        })
    }
  }

  const fetchProducts = async (page: number, limit: number) => {
    const res = await authorizedAxiosInstance.get(
      `/product?_page=${page}&_limit=${limit}`
    )
    const { data, pagination } = res.data

    setRows(
      data.map((item: IProduct) => ({
        id: item.id,
        name: item.name,
        category: item.category.name,
        images: item.images,
        variants: item.variants
      }))
    )

    setPagination((pre) => ({
      ...pre,
      total: pagination?.total || 0
    }))
  }

  React.useEffect(() => {
    fetchProducts(pagination.page, pagination.limit)
  }, [pagination.page, pagination.limit])

  return (
    <Box>
      <Box>
        <Link to="/product/create">
          <Button variant="contained" color="primary" sx={{ mb: 1 }}>
            Thêm mới
          </Button>
        </Link>
      </Box>
      <Paper sx={{ height: 650, width: "100%" }} elevation={6}>
        <DataGrid
          rows={rows}
          columns={columns}
          checkboxSelection
          sx={{ border: 0, textAlign: "center" }}
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

export default Product
