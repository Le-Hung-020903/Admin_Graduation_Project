import Typography from "@mui/material/Typography"
import Stack from "@mui/material/Stack"

const Unauthorized = () => {
  return (
    <Stack
      direction={"column"}
      alignItems={"center"}
      justifyContent={"center"}
      mt={8}
    >
      <Typography variant="h3">Bạn không có quyền truy cập</Typography>
      <Typography variant="h4" mt={4}>
        Vui lòng liên hệ quản trị viên để được nâng cấp quyền sử dụng hệ thống
      </Typography>
    </Stack>
  )
}

export default Unauthorized
