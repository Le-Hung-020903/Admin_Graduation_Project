import * as React from "react"
import Box from "@mui/material/Box"
import Stack from "@mui/material/Stack"
import Button from "@mui/material/Button"
import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import Select from "@mui/material/Select"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import { SubmitHandler, useForm } from "react-hook-form"
import MenuItem from "@mui/material/MenuItem"
import CloudUploadIcon from "@mui/icons-material/CloudUpload"
import CancelIcon from "@mui/icons-material/Cancel"
import {
  IIngredient,
  IManufacturer,
  IProductFormData,
  IUnit,
  IVariant
} from "../../../interface/product"
import authorizedAxiosInstance from "../../../utils/axios"
import { ICategory } from "../../../interface/category"
import { styled } from "@mui/material"
import Alert from "@mui/material/Alert"
import MDEditor from "@uiw/react-md-editor"
import { marked } from "marked"
import DOMPurify from "dompurify"
import { NAME_RULE } from "../../../utils/validators"
import { toast } from "react-toastify"
import { createProductAPI } from "../../../api"
import { Link } from "react-router-dom"

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1
})

export default function ProductCreate() {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors }
  } = useForm<IProductFormData>({
    mode: "onBlur"
  })
  const onSubmit: SubmitHandler<IProductFormData> = (data) => {
    toast
      .promise(createProductAPI(data, files), {
        pending: "Đang tạo sản phẩm..."
      })
      .then((res) => {
        if (res.success) {
          toast.success("Tạo sản phẩm thành công!")
          reset()

          setMarkdownValue("**Mô tả sản phẩm...**")
          setImage([])
          setFiles([])

          // Nếu dùng URL.createObjectURL, cần giải phóng bộ nhớ
          image.forEach((img) => URL.revokeObjectURL(img))
        }
      })
  }

  const initialStateVariant: IVariant[] = [
    {
      name: "",
      price: 0,
      stock: 0,
      weight: 0,
      liter: 0,
      sku: "",
      unit: 0
    }
  ]
  const initialStateIngrediants: IIngredient[] = [{ name: "", info: "" }]
  const [variant, setVariant] = React.useState<IVariant[]>(initialStateVariant)
  const [ingredients, setIngredients] = React.useState<IIngredient[]>(
    initialStateIngrediants
  )
  const [categoryList, setCategoryList] = React.useState<ICategory[]>([])
  const [manufacturerList, setManufacturerList] = React.useState<
    IManufacturer[]
  >([])
  const [unitList, setUnitList] = React.useState<IUnit[]>([])
  const [image, setImage] = React.useState<string[]>([])
  const [files, setFiles] = React.useState<File[]>([])

  const [markdownValue, setMarkdownValue] = React.useState<string>(
    "**Mô tả sản phẩm...**"
  )

  const handleChange = async (value?: string) => {
    const mdValue = value || ""
    const htmlValue = await marked(mdValue)
    const sanitizedHtmlValue = DOMPurify.sanitize(htmlValue)

    // Cập nhật giá trị cho cả desc_markdown và desc_html
    setMarkdownValue(mdValue)
    setValue("desc_markdown", mdValue) // Cập nhật giá trị desc_markdown
    setValue("desc_html", sanitizedHtmlValue) // Cập nhật giá trị desc_html
  }

  const handleAddForms = (type: string) => {
    if (type === "variants") {
      setVariant([...variant, ...initialStateVariant])
    } else if (type === "ingredients") {
      setIngredients([...ingredients, ...initialStateIngrediants])
    }
  }

  const handleGetAllCategories = async () => {
    const res = await authorizedAxiosInstance.get(`/category/getAll`)
    const { data } = res
    setCategoryList(
      data.data.map((item: ICategory) => {
        return {
          id: item.id,
          name: item.name
        }
      })
    )
  }

  const handleGetAllManufacturers = async () => {
    const res = await authorizedAxiosInstance.get("/manufacturer/getAll")
    const { data } = res
    setManufacturerList(
      data.data.map((item: IManufacturer) => {
        return {
          id: item.id,
          name: item.name
        }
      })
    )
  }

  const handleGetAllUnits = async () => {
    const res = await authorizedAxiosInstance.get("/unit")
    const { data } = res
    setUnitList(
      data.data.map((item: IUnit) => {
        return {
          id: item.id,
          symbol: item.symbol
        }
      })
    )
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const filesArray: File[] = Array.from(e.target.files)

    const urls: string[] = filesArray.map((file) => URL.createObjectURL(file))
    setImage((pre: string[]) => {
      return [...pre, ...urls]
    })
    setFiles((pre: File[]) => {
      return [...pre, ...filesArray]
    })
    // Reset input để có thể chọn lại ảnh cũ
    e.target.value = ""
  }

  const removeImage = (url: string) => {
    setImage((prev) => {
      URL.revokeObjectURL(url) // Xóa URL khỏi bộ nhớ
      return prev.filter((img) => img !== url)
    })
  }

  React.useEffect(() => {
    handleGetAllCategories()
    handleGetAllManufacturers()
    handleGetAllUnits()
  }, [])
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box>
        <Typography variant="h4" marginBottom={5}>
          Thêm sản phẩm
        </Typography>
        <Box display="flex" flexDirection="column" gap={2}>
          <Box>
            <Typography
              component={"h4"}
              sx={{
                mb: 1
              }}
            >
              Tên sản phẩm
            </Typography>
            <TextField
              label="Tên"
              error={!!errors["name"]}
              {...register("name", {
                required: "Tên phải lớn hơn 3 ký tự",
                pattern: {
                  value: NAME_RULE,
                  message: "Tên mục bắt buộc phải nhập trên 3 ký tự"
                }
              })}
              sx={{ minWidth: 400 }}
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
          <Box>
            <Typography
              component={"h4"}
              sx={{
                mt: 3,
                mb: 1
              }}
            >
              Danh mục và nhà sản xuất
            </Typography>
            <Stack direction={"row"} spacing={3}>
              <FormControl sx={{ minWidth: 400 }}>
                <InputLabel id="category">Danh mục</InputLabel>
                <Select
                  labelId="category"
                  id="category"
                  error={!!errors["category_id"]}
                  label="Danh mục"
                  {...register("category_id", {
                    required: "Danh mục bắt buộc phải chọn",
                    valueAsNumber: true,
                    min: {
                      value: 1,
                      message: "Mã danh mục phải lớn hơn 0"
                    }
                  })}
                  onClick={handleGetAllCategories}
                >
                  {categoryList.map((item) => {
                    return (
                      <MenuItem key={item.id} value={item.id}>
                        {item.name}
                      </MenuItem>
                    )
                  })}
                </Select>
                {errors.category_id && (
                  <Alert
                    severity="error"
                    sx={{
                      mt: "0.7em",
                      ".MuiAlert-message": { overflow: "hidden" }
                    }}
                  >
                    {errors.category_id.message}
                  </Alert>
                )}
              </FormControl>
              <FormControl sx={{ minWidth: 400 }}>
                <InputLabel id="manufacturer">Nhà sản xuất</InputLabel>
                <Select
                  labelId="manufacturer"
                  id="manufacturer"
                  error={!!errors["manufacturer_id"]}
                  label="Nhà sản xuất"
                  {...register("manufacturer_id", {
                    required: "Nhà sản xuất bắt buộc phải chọn",
                    valueAsNumber: true,
                    min: {
                      value: 1,
                      message: "Mã nhà sản xuất phải lớn hơn 0"
                    }
                  })}
                >
                  {manufacturerList.map((item) => {
                    return (
                      <MenuItem key={item.id} value={item.id}>
                        {item.name}
                      </MenuItem>
                    )
                  })}
                </Select>
                {errors.manufacturer_id && (
                  <Alert
                    severity="error"
                    sx={{
                      mt: "0.7em",
                      ".MuiAlert-message": { overflow: "hidden" }
                    }}
                  >
                    {errors.manufacturer_id.message}
                  </Alert>
                )}
              </FormControl>
            </Stack>
          </Box>

          <Box>
            <Typography component={"h4"} sx={{ mt: 3, mb: 1 }}>
              Mô tả sản phẩm
            </Typography>

            <MDEditor
              value={markdownValue}
              {...register(`desc_markdown`)}
              onChange={handleChange}
            />
          </Box>
          <Box>
            <Typography component={"h4"} sx={{ mt: 3, mb: 1 }}>
              Biến thể
            </Typography>
            {variant.map((_, index) => (
              <Stack key={index} direction="row" spacing={2} sx={{ mb: 6 }}>
                <Box>
                  <TextField
                    label="Tên"
                    error={!!errors.variants?.[index]?.name}
                    {...register(`variants.${index}.name`, {
                      required: "Tên biến thể bắt buộc phải nhập",
                      pattern: {
                        value: NAME_RULE,
                        message: "Tên biến thể phải lớn hơn 3 ký tự"
                      }
                    })}
                  />
                  {errors.variants?.[index]?.name && (
                    <Alert
                      severity="error"
                      sx={{
                        mt: "0.7em",
                        ".MuiAlert-message": { overflow: "hidden" }
                      }}
                    >
                      {errors.variants?.[index]?.name.message}
                    </Alert>
                  )}
                </Box>
                <Box>
                  <TextField
                    label="Giá"
                    error={!!errors.variants?.[index]?.price}
                    {...register(`variants.${index}.price`, {
                      required: "Giá biến thể bắt buộc phải nhập",
                      min: {
                        value: 1,
                        message: "Giá biến thể phải lớn hơn 0"
                      }
                    })}
                  />
                  {errors.variants?.[index]?.price && (
                    <Alert
                      severity="error"
                      sx={{
                        mt: "0.7em",
                        ".MuiAlert-message": { overflow: "hidden" }
                      }}
                    >
                      {errors.variants?.[index]?.price.message}
                    </Alert>
                  )}
                </Box>
                <Box>
                  <TextField
                    label="Số lượng"
                    error={!!errors.variants?.[index]?.stock}
                    {...register(`variants.${index}.stock`, {
                      required: "Số lượng biến thể bắt buộc phải nhập",
                      min: {
                        value: 1,
                        message: "Số lượng biến thể phải lớn hơn 0"
                      }
                    })}
                  />
                  {errors.variants?.[index]?.stock && (
                    <Alert
                      severity="error"
                      sx={{
                        mt: "0.7em",
                        ".MuiAlert-message": { overflow: "hidden" }
                      }}
                    >
                      {errors.variants?.[index]?.stock.message}
                    </Alert>
                  )}
                </Box>
                <Box>
                  <TextField
                    label="Kg"
                    {...register(`variants.${index}.weight`)}
                  />
                </Box>
                <Box>
                  <TextField
                    label="Lít"
                    {...register(`variants.${index}.liter`)}
                  />
                </Box>
                <Box>
                  <TextField
                    label="Mã"
                    error={!!errors.variants?.[index]?.sku}
                    {...register(`variants.${index}.sku`, {
                      required: "Tên biến thể bắt buộc phải nhập",
                      min: {
                        value: 1,
                        message: "Tên biến thể phải lớn hơn 0"
                      }
                    })}
                  />
                  {errors.variants?.[index]?.sku && (
                    <Alert
                      severity="error"
                      sx={{
                        mt: "0.7em",
                        ".MuiAlert-message": { overflow: "hidden" }
                      }}
                    >
                      {errors.variants?.[index]?.sku.message}
                    </Alert>
                  )}
                </Box>
                <Box>
                  <FormControl sx={{ minWidth: 210 }}>
                    <InputLabel id="unit">Đơn vị</InputLabel>
                    <Select
                      labelId="unit"
                      id="unit"
                      label="Đơn vị"
                      error={!!errors.variants?.[index]?.unit_id}
                      {...register(`variants.${index}.unit_id`, {
                        required: "Mã đơn vị biến thể bắt buộc phải nhập",
                        min: {
                          value: 1,
                          message: "Mã đơn vị biến thể phải lớn hơn 0"
                        }
                      })}
                    >
                      {unitList.map((item: IUnit) => {
                        return (
                          <MenuItem key={item.id} value={item.id}>
                            {item.symbol}
                          </MenuItem>
                        )
                      })}
                    </Select>
                    {errors.variants?.[index]?.unit_id && (
                      <Alert
                        severity="error"
                        sx={{
                          mt: "0.7em",
                          ".MuiAlert-message": { overflow: "hidden" }
                        }}
                      >
                        {errors.variants?.[index]?.unit_id.message}
                      </Alert>
                    )}
                  </FormControl>
                </Box>
              </Stack>
            ))}
            <Button
              variant="contained"
              onClick={() => handleAddForms("variants")}
            >
              Thêm biến thể
            </Button>
          </Box>
          <Box>
            <Typography component={"h4"} sx={{ mt: 3, mb: 1 }}>
              Nguyên liệu
            </Typography>
            <Stack>
              {ingredients.map((_, index) => (
                <Stack key={index} direction="row" spacing={2} sx={{ mb: 2 }}>
                  <Box>
                    <TextField
                      label="Tên"
                      error={!!errors.ingredients?.[index]?.name}
                      {...register(`ingredients.${index}.name`, {
                        required: "Tên nguyên liệu bắt buộc phải nhập",
                        min: {
                          value: 1,
                          message: "Tên nguyên liệu thể phải lớn hơn 0"
                        }
                      })}
                    />
                    {errors.ingredients?.[index]?.name && (
                      <Alert
                        severity="error"
                        sx={{
                          mt: "0.7em",
                          ".MuiAlert-message": { overflow: "hidden" }
                        }}
                      >
                        {errors.ingredients?.[index]?.name.message}
                      </Alert>
                    )}
                  </Box>
                  <Box>
                    <TextField
                      label="Thông tin"
                      error={!!errors.ingredients?.[index]?.info}
                      {...register(`ingredients.${index}.info`, {
                        required: "Thông tin nguyên liệu bắt buộc phải nhập",
                        min: {
                          value: 1,
                          message: "Thông tin nguyên liệu thể phải lớn hơn 0"
                        }
                      })}
                    />
                    {errors.ingredients?.[index]?.info && (
                      <Alert
                        severity="error"
                        sx={{
                          mt: "0.7em",
                          ".MuiAlert-message": { overflow: "hidden" }
                        }}
                      >
                        {errors.ingredients?.[index]?.info.message}
                      </Alert>
                    )}
                  </Box>
                </Stack>
              ))}
            </Stack>
            <Button
              variant="contained"
              className=""
              onClick={() => handleAddForms("ingredients")}
            >
              Thêm biến thể
            </Button>
          </Box>
          <Box>
            <Typography component={"h4"} sx={{ mt: 3, mb: 1 }}>
              Thêm hình ảnh
            </Typography>
            <Stack direction={"row"}>
              {image.map((item, index) => {
                return (
                  <Box
                    // spacing={3}
                    key={index}
                    sx={{
                      position: "relative",
                      width: "400px",
                      height: "500px",
                      m: 3,
                      ml: 0,
                      borderRadius: "15px",
                      overflow: "hidden"
                    }}
                  >
                    <CancelIcon
                      onClick={() => removeImage(item)}
                      sx={{
                        position: "absolute",
                        top: "10px",
                        right: "15px",
                        fontSize: "34px",
                        cursor: "pointer",
                        color: "white"
                      }}
                    />
                    <img
                      src={item}
                      style={{
                        objectFit: "cover",
                        width: "100%",
                        height: "100%"
                      }}
                    />
                  </Box>
                )
              })}
            </Stack>
            <Button
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
              startIcon={<CloudUploadIcon />}
            >
              Upload files
              <VisuallyHiddenInput
                type="file"
                onChange={handleImageChange}
                multiple
              />
            </Button>
          </Box>
          <Stack
            direction={"row"}
            spacing={2}
            sx={{
              mt: 10,
              mb: 2
            }}
          >
            <Button
              type="submit"
              variant="contained"
              className="interceptor-loading"
            >
              Tạo sản phẩm
            </Button>
            <Button variant="contained" color="error">
              <Link
                to="/product"
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
      </Box>
    </form>
  )
}
