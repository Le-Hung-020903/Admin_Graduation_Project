import * as React from "react"
import { DataGrid, GridColDef } from "@mui/x-data-grid"
import Paper from "@mui/material/Paper"
import Button from "@mui/material/Button"
import Box from "@mui/material/Box"
import IconButton from "@mui/material/IconButton"
import DeleteIcon from "@mui/icons-material/Delete"
import EditIcon from "@mui/icons-material/Edit"
import { Link } from "react-router-dom"
import { deleteRoleAPI, getRoleAPI } from "../../api"
import { IRole } from "../../interface/role"
import dayjs from "dayjs"
import { toast } from "react-toastify"
import { useSelector } from "react-redux"
import { selectPermission } from "../../redux/slice/permission.slice"
import { hasPermission } from "../../utils/hasPermission"

const paginationModel = { page: 0, pageSize: 5 }

export default function Role() {
  const [rows, setRow] = React.useState([])
  const permissions = useSelector(selectPermission)
  const handleDelete = (id: number, name: string) => {
    console.log("id", id)
    console.log("name", name)

    if (confirm(`Bạn có chắc chắn xoá vai trò ${name} này?`)) {
      toast
        .promise(deleteRoleAPI(id), {
          pending: "Đang xóa vai trò..."
        })
        .then((res) => {
          if (res.success) {
            toast.success("Xóa vai trò thành công!")
            setRow((prev) => prev.filter((row) => row.id !== id))
          }
        })
    }
  }
  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      flex: 0.5,
      align: "center",
      headerAlign: "center"
    },
    {
      field: "role",
      headerName: "Vai trò",
      flex: 1,
      align: "center",
      headerAlign: "center"
    },

    {
      field: "Created_at",
      flex: 1,
      align: "center",
      headerAlign: "center",
      headerName: "Created_at"
    },
    {
      field: "Actions",
      align: "center",
      headerName: "Actions",
      headerAlign: "center",
      flex: 1,
      renderCell: (params) => (
        <Box>
          {hasPermission(permissions, "roles.update") && (
            <Link to={`/roles/edit/${params.row.id}`}>
              <IconButton color="primary">
                <EditIcon />
              </IconButton>
            </Link>
          )}
          {hasPermission(permissions, "roles.delete") && (
            <IconButton
              color="error"
              onClick={() => handleDelete(params.row.id, params.row.role)}
            >
              <DeleteIcon />
            </IconButton>
          )}
        </Box>
      )
    }
  ]
  const fetch = async () => {
    const { data } = await getRoleAPI()
    setRow(
      data.map((role: IRole) => ({
        id: role.id,
        role: role.name,
        Created_at: dayjs(role.created_at).format("YYYY-MM-DD HH:mm:ss")
      }))
    )
  }
  React.useEffect(() => {
    fetch()
  }, [])
  return (
    <Box>
      {hasPermission(permissions, "roles.insert") && (
        <Box>
          <Link to="/roles/create">
            <Button variant="contained" color="primary" sx={{ mb: 1 }}>
              Thêm mới
            </Button>
          </Link>
        </Box>
      )}
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
