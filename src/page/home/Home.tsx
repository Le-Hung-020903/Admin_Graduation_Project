import Grid from "@mui/material/Grid"
import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"
import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import GroupIcon from "@mui/icons-material/Group"
import InventoryIcon from "@mui/icons-material/Inventory"
import AttachMoneyIcon from "@mui/icons-material/AttachMoney"
import ProductionQuantityLimitsIcon from "@mui/icons-material/ProductionQuantityLimits"
import { useEffect, useState } from "react"
import { IStatSummary } from "../../interface/stats"
import { getStatsAPI } from "../../api"
import { formattedAmount } from "../../utils/formatMoney"
import BarChartPage from "../../components/BarChart"

const Home = () => {
  const [stats, setStats] = useState<IStatSummary | null>(null)
  useEffect(() => {
    const fetchStats = async () => {
      const res = await getStatsAPI()
      setStats(res.data)
    }
    fetchStats()

    const interval = setInterval(() => {
      fetchStats()
    }, 60000)
    return () => clearInterval(interval)
  }, [])
  return (
    <Box>
      <Typography variant="h4">
        Tổng quan về website thực phẩm sạch Minh Anh
      </Typography>

      <Box
        sx={{
          mt: 2
        }}
      >
        <Grid container spacing={2} justifyContent={"space-between"}>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Paper elevation={3}>
              <Stack
                direction={"row"}
                spacing={2}
                alignItems="center"
                sx={{
                  p: 6
                }}
              >
                <Box
                  sx={{
                    backgroundColor: "#e0e0e0", // màu xám
                    borderRadius: "50%", // làm tròn
                    width: 50,
                    height: 50,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <GroupIcon />
                </Box>
                <Stack>
                  <Typography variant="h6" fontWeight={"bold"}>
                    {stats?.totalUsers ?? 0}
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      textWrap: "nowrap"
                    }}
                  >
                    Tổng số người dùng
                  </Typography>
                </Stack>
              </Stack>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Paper elevation={3}>
              <Stack
                direction={"row"}
                spacing={2}
                alignItems="center"
                sx={{
                  p: 6
                }}
              >
                <Box
                  sx={{
                    backgroundColor: "#e0e0e0", // màu xám
                    borderRadius: "50%", // làm tròn
                    width: 50,
                    height: 50,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <InventoryIcon />
                </Box>
                <Stack>
                  <Typography variant="h6" fontWeight={"bold"}>
                    {stats?.totalOrders ?? 0}
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      textWrap: "nowrap"
                    }}
                  >
                    Tổng số đơn hàng
                  </Typography>
                </Stack>
              </Stack>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Paper elevation={3}>
              <Stack
                direction={"row"}
                spacing={2}
                alignItems="center"
                sx={{
                  p: 6
                }}
              >
                <Box
                  sx={{
                    backgroundColor: "#e0e0e0", // màu xám
                    borderRadius: "50%", // làm tròn
                    width: 50,
                    height: 50,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <ProductionQuantityLimitsIcon />
                </Box>
                <Stack>
                  <Typography variant="h6" fontWeight={"bold"}>
                    {stats?.totalProduct ?? 0}
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      textWrap: "nowrap"
                    }}
                  >
                    Tổng số sản phẩm
                  </Typography>
                </Stack>
              </Stack>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Paper elevation={3}>
              <Stack
                direction={"row"}
                spacing={2}
                alignItems="center"
                sx={{
                  p: 6
                }}
              >
                <Box
                  sx={{
                    backgroundColor: "#e0e0e0", // màu xám
                    borderRadius: "50%", // làm tròn
                    width: 50,
                    height: 50,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <AttachMoneyIcon />
                </Box>
                <Stack>
                  <Typography variant="h6" fontWeight={"bold"}>
                    {formattedAmount(Number(stats?.totalMoney)) ?? "0"}
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      textWrap: "nowrap"
                    }}
                  >
                    Tổng số tiền
                  </Typography>
                </Stack>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Box>
      <Box
        sx={{
          mt: 10
        }}
      >
        <BarChartPage />
      </Box>
    </Box>
  )
}

export default Home
