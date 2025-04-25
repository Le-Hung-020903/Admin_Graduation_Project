import * as React from "react"
import Paper from "@mui/material/Paper"
import Button from "@mui/material/Button"
import Box from "@mui/material/Box"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import FormGroup from "@mui/material/FormGroup"
import FormControlLabel from "@mui/material/FormControlLabel"
import Checkbox from "@mui/material/Checkbox"
import Stack from "@mui/material/Stack"
import Alert from "@mui/material/Alert"
import { toast } from "react-toastify"
import { IModule } from "../../../interface/module"
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import { useParams } from "react-router"
import {
  getModulesAPI,
  getRoleDetailAPI,
  updatePermissionsAPI
} from "../../../api"
import { Link } from "react-router-dom"
import { IRole } from "../../../interface/role"

export default function EditRole() {
  const params = useParams()
  const {
    register,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<{
    name: string
    permissions: string[]
  }>({
    mode: "onBlur"
  })
  const onSubmit: SubmitHandler<{
    name: string
    permissions: string[]
  }> = (data) => {
    if (!params.id) return
    toast
      .promise(
        updatePermissionsAPI(
          { ...data, permissions: permissionsValue },
          Number(params.id)
        ),
        {
          pending: "Đang cập nhật vai trò..."
        }
      )
      .then((res) => {
        if (res.success) {
          toast.success("Cập nhật vai trò thành công!")
        }
      })
  }

  const handleSubmitForm = handleSubmit(onSubmit)

  const [rows, setRows] = React.useState<IModule[]>([])
  const [role, setRole] = React.useState<IRole | null>(null)
  const [permissionsValue, setPermissionsValue] = React.useState<string[]>([])
  const fetchModules = async () => {
    const { data } = await getModulesAPI()
    setRows(data)
  }

  const fectchdetailRole = async (id: number) => {
    const { data } = await getRoleDetailAPI(id)
    setRole(data)
    setPermissionsValue(data.permissions.map((p: { value: string }) => p.value))
  }

  const handleCheckboxChange = (checked: boolean, value: string) => {
    setPermissionsValue((prev) =>
      checked ? [...prev, value] : prev.filter((p) => p !== value)
    )
  }

  React.useEffect(() => {
    fetchModules()
    if (params.id) {
      fectchdetailRole(Number(params.id))
    }
  }, [params.id])

  return (
    <Box>
      <Box>
        <Typography variant="h4" marginBottom={5}>
          Chỉnh sửa vai trò
        </Typography>
      </Box>
      <Box>
        <TextField
          label="Vai trò"
          defaultValue={role?.name}
          focused
          {...register("name", {
            required: "Tên module bắt buộc phải nhập"
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
      <TableContainer component={Paper} elevation={7} sx={{ mt: 7 }}>
        <Table sx={{ minWidth: 650 }} size="medium" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell width={"30%"}>Chức năng</TableCell>
              <TableCell align="center">Quyền</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  "& .MuiTableCell-root": {
                    p: 1,
                    pl: 2
                  }
                }}
              >
                <TableCell
                  component="th"
                  scope="row"
                  sx={{ borderRight: "1px solid #ccc" }}
                >
                  {row.desc}
                </TableCell>

                <TableCell align="center">
                  <FormGroup>
                    <Stack direction={"row"} justifyContent={"space-between"}>
                      {row.actions.map((item, index) => {
                        return (
                          <Controller
                            name="permissions"
                            control={control}
                            defaultValue={[]}
                            key={index}
                            render={() => (
                              <FormControlLabel
                                key={index}
                                control={
                                  <Checkbox
                                    checked={permissionsValue.includes(
                                      `${row.name}.${item.name}`
                                    )}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e.target.checked,
                                        `${row.name}.${item.name}`
                                      )
                                    }
                                    value={`${row.name}.${item.name}`} // Gán giá trị là `string`
                                    size="small"
                                    color="primary"
                                  />
                                }
                                label={item.name}
                              />
                            )}
                          />
                        )
                      })}
                    </Stack>
                  </FormGroup>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Stack direction={"row"} spacing={3} sx={{ mt: 3 }}>
        <Button
          variant="contained"
          color="primary"
          className="interceptor-loading"
          onClick={handleSubmitForm}
        >
          Cập nhật vai trò
        </Button>
        <Button variant="contained" color="error">
          <Link
            to="/roles"
            style={{
              textDecoration: "none",
              color: "white"
            }}
          >
            Huỷ
          </Link>
        </Button>
      </Stack>
    </Box>
  )
}
