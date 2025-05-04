import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import Button from "@mui/material/Button"
import { useNavigate } from "react-router-dom"

const GoBack = () => {
  const navigate = useNavigate()

  const handleGoBack = () => {
    navigate(-1) // Quay lại trang trước đó
  }
  return (
    <Button
      startIcon={<ArrowBackIcon />}
      variant="outlined"
      onClick={handleGoBack}
      sx={{
        mb: 3, // margin bottom
        textTransform: "none", // không viết hoa chữ
        "&:hover": {
          backgroundColor: "#f5f5f5" // màu nền khi hover
        }
      }}
    >
      Go back
    </Button>
  )
}

export default GoBack
