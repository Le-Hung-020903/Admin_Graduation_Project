import {
  Alert,
  Box,
  Button,
  Card,
  FormLabel,
  TextField,
  Typography,
  Zoom
} from "@mui/material"
import { SubmitHandler, useForm } from "react-hook-form"
import {
  FIELD_REQUIRE_MESSAGE,
  EMAIL_RULE,
  EMAIL_RULE_MESSAGE,
  PASSWORD_RULE,
  PASSWORD_RULE_MESSAGE
} from "../../utils/validators"
import authorizedAxiosInstance from "../../utils/axios"
import VisibilityIcon from "@mui/icons-material/Visibility"
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { AppDispatch } from "../../redux/store"
import { getPermissionAPI } from "../../redux/middleware/permission.middleware"
import { setUser } from "../../redux/slice/user.middleware"
import { useState } from "react"

type Inputs = {
  email: string
  password: string
}

export default function Login() {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const [hiddenPassword, setHiddenPassword] = useState<boolean>(true)
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<Inputs>()
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const res = await authorizedAxiosInstance.post("/auth/login", data)
    const result = res.data
    toast.success(result.message)

    if (result.success) {
      dispatch(setUser(result.data))
      localStorage.setItem("user", JSON.stringify(result.data))

      dispatch(getPermissionAPI())

      navigate("/", { replace: true })
    }
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        alignItems: "center",
        justifyContent: "center",
        background: 'url("/images/login-bg.jpg")',
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
        boxShadow: "inset 0 0 0 2000px rgba(0, 0, 0, 0.2)"
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Zoom in={true} style={{ transitionDelay: "200ms" }}>
          <Card
            variant="outlined"
            sx={{
              px: 4,
              py: 8,
              width: "400px"
            }}
          >
            <Box>
              <img src={"/images/Logo.png"} alt="Logo" />
            </Box>

            <Typography
              component="h1"
              variant="h4"
              sx={{
                width: "100%",
                fontSize: "clamp(2rem, 10vw, 2.15rem)",
                mb: 5,
                mt: 3
              }}
            >
              Sign in
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                gap: 2
              }}
            >
              <Box>
                <FormLabel htmlFor="email">Email</FormLabel>
                <TextField
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  autoComplete="email"
                  autoFocus
                  required
                  error={!!errors["email"]}
                  fullWidth
                  variant="outlined"
                  {...register("email", {
                    required: FIELD_REQUIRE_MESSAGE,
                    pattern: {
                      value: EMAIL_RULE,
                      message: EMAIL_RULE_MESSAGE
                    }
                  })}
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
                my={2}
                sx={{
                  position: "relative"
                }}
              >
                <FormLabel htmlFor="password">Password</FormLabel>
                <TextField
                  placeholder="••••••"
                  type={hiddenPassword ? "password" : "text"}
                  id="password"
                  autoComplete="current-password"
                  required
                  fullWidth
                  variant="outlined"
                  error={!!errors["password"]}
                  {...register("password", {
                    required: FIELD_REQUIRE_MESSAGE,
                    pattern: {
                      value: PASSWORD_RULE,
                      message: PASSWORD_RULE_MESSAGE
                    }
                  })}
                />
                <Box
                  onClick={() => {
                    setHiddenPassword((pre) => !pre)
                  }}
                  sx={{
                    cursor: "pointer",
                    position: "absolute",
                    top: "50%",
                    right: "5%"
                  }}
                >
                  {!hiddenPassword ? (
                    <VisibilityOffIcon sx={{ color: "gray" }} />
                  ) : (
                    <VisibilityIcon sx={{ color: "gray" }} />
                  )}
                </Box>
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
              <Button
                type="submit"
                fullWidth
                variant="contained"
                className="interceptor-loading"
              >
                Sign in
              </Button>
            </Box>
          </Card>
        </Zoom>
      </form>
    </Box>
  )
}
