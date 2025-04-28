export const formattedAmount = (amount: number): string => {
  const numAmount = Number(amount)
  if (isNaN(numAmount) || numAmount < 0) return "Không có giá"
  return numAmount.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND"
  })
}
