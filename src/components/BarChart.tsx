import React, { useEffect } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts"
import { IStatRevenue } from "../interface/stats"
import { getStatRevenueAPI } from "../api"
const BarChartPage = () => {
  const [statRevenue, setStatRevenue] = React.useState<IStatRevenue[]>([])
  useEffect(() => {
    const fetchStats = async () => {
      const res = await getStatRevenueAPI()
      setStatRevenue(res.data)
    }
    fetchStats()

    const interval = setInterval(() => {
      fetchStats()
    }, 60000)
    return () => clearInterval(interval)
  }, [])
  return (
    <ResponsiveContainer width="100%" height={500}>
      <BarChart
        data={statRevenue}
        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis tickFormatter={(value) => `${(value / 1_000).toFixed(1)} K`} />
        <Tooltip
          formatter={(value: number) => `${value.toLocaleString("vi-VN")} VND`}
        />
        <Bar dataKey="revenue" name="Doanh thu" fill="#4CAF50" />
      </BarChart>
    </ResponsiveContainer>
  )
}

export default BarChartPage
