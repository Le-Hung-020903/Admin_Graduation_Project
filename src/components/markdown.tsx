// import React from "react"
// import Box from "@mui/material/Box"
// import MDEditor from "@uiw/react-md-editor"
// import { marked } from "marked"
// import DOMPurify from "dompurify"

// const Markdown = () => {
//   const [value, setValue] = React.useState<string>("**Mô tả sản phẩm...**")
//   const handleChange = async (value?: string) => {
//     const mdValue = value || ""
//     const htmlValue = await marked(mdValue)
//     const xss = DOMPurify.sanitize(htmlValue)
//     setValue(mdValue)
//   }
//   return (
//     <Box className="container">
//       <MDEditor value={value} onChange={handleChange} />
//     </Box>
//   )
// }

// export default Markdown
