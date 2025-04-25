// - Kỹ thuật dùng CSS Pointer-event để chặn user spam click tại bất kỳ chỗ nào có hành động click gọi API
// - Đây là một kỹ thuật rất hay tận dụng Axios Interceptors và CSS Pointer-event để chỉ phải viết code xử lý một lần cho toàn bộ dự án
// - Cách sử dụng: Với tất cá các link hoặc button mà có hành động Call API thì thêm class "Interceptor-loading" cho nó xong.
export const interceptorLoadingElements = (calling: boolean) => {
  const elements = document.querySelectorAll(".interceptor-loading");
  for (let i = 0; i < elements.length; i++) {
    const el = elements[i] as HTMLElement; // Ép kiểu thành HTMLElement
    if (calling) {
      el.style.opacity = "0.5";
      el.style.pointerEvents = "none";
    } else {
      //   setTimeout(() => {
      el.style.opacity = "initial"; // Khôi phục trạng thái bình thường
      el.style.pointerEvents = "initial";
      //   }, 1000) // 1 giây
    }
  }
};
