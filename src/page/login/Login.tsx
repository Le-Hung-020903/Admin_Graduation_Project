import {
  Alert,
  Box,
  Button,
  Card,
  Checkbox,
  FormControlLabel,
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
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"

type Inputs = {
  email: string
  password: string
}

export default function Login() {
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<Inputs>()
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const res = await authorizedAxiosInstance.post("/auth/login", data)
    const result = res.data
    toast.success(result.message)
    navigate("/")
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        alignItems: "center",
        justifyContent: "center",
        background: 'url("/login-bg.jpg")',
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
        boxShadow: "inset 0 0 0 2000px rgba(0, 0, 0, 0.2)"
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Zoom in={true} style={{ transitionDelay: "200ms" }}>
          <Card variant="outlined">
            <Typography
              component="h1"
              variant="h4"
              sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
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
              <Box>
                <TextField
                  placeholder="••••••"
                  type="password"
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
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
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
