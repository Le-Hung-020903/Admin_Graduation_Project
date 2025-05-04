import React, { useEffect, useState } from "react"
import Select from "@mui/material/Select"
import MenuItem from "@mui/material/MenuItem"
import Checkbox from "@mui/material/Checkbox"
import Backdrop from "@mui/material/Backdrop"
import Modal from "@mui/material/Modal"
import Fade from "@mui/material/Fade"
import Radio from "@mui/material/Radio"
import RadioGroup from "@mui/material/RadioGroup"
import FormControlLabel from "@mui/material/FormControlLabel"
import FormControl from "@mui/material/FormControl"
import AddIcon from "@mui/icons-material/Add"
import Stack from "@mui/material/Stack"
import TextField from "@mui/material/TextField"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import InputLabel from "@mui/material/InputLabel"
import { IAddress } from "../interface/order"
import { createAddressAPI, getAddressAPI } from "../api"
import { toast } from "react-toastify"

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "10px"
}

type Addresses = {
  name: string
  slug: string
  type: string
  name_with_type: string
  code: string
}

interface Props {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  setSelectedAddress: React.Dispatch<React.SetStateAction<IAddress | null>>
  selectedAddressId: number | null
  setSelectedAddressId: React.Dispatch<React.SetStateAction<number | null>>
}

const Address: React.FC<Props> = ({
  open,
  setOpen,
  setSelectedAddress,
  selectedAddressId,
  setSelectedAddressId
}) => {
  // Đóng modal
  const handleClose = () => setOpen(false)

  // Lấy tất cả địa chỉ về
  const [address, setAddress] = useState<IAddress[]>([])

  // Set địa chỉ khi select
  //   const [selectedAddress, setSelectedAddress] = useState<IAddress | null>(null)
  //   console.log("selectedAddress", selectedAddress)

  const [listProvince, setListProvince] = useState<Addresses[]>([])
  const [listDistricts, setListDistricts] = useState<Addresses[]>([])
  const [listWards, setListWards] = useState<Addresses[]>([])

  // Đổi modal
  const [openEditAddress, setOpenEditAddress] = useState<boolean>(false)
  const handleOpenEditAddress = () => setOpenEditAddress(!openEditAddress)

  // Hàm lấy tất cả địa chỉ về
  const fetchAddress = async () => {
    const res = await getAddressAPI()
    setAddress(res.data)
  }

  const [location, setLocation] = useState({
    name: "",
    phone: "",
    province_code: "",
    province: "",
    district_code: "",
    district: "",
    ward: "",
    ward_code: "",
    location: "",
    is_default: false
  })

  // Hàm xử lý khi bấm "Cập nhật"
  const handleUpdateAddress = (id: number) => {
    console.log("Địa chỉ cần cập nhật:", id)
  }

  // Hàm lưu địa chỉ mới
  const handleSubmitAddress = () => {
    const data = {
      phone: location.phone,
      name: location.name,
      province: location.province,
      district: location.district,
      ward: location.ward,
      street: location.location,
      is_default: location.is_default
    }
    toast.promise(createAddressAPI(data), {}).then((res) => {
      if (res.success) {
        fetchAddress()
        setOpenEditAddress(!openEditAddress)
      }
    })
  }

  useEffect(() => {
    const fetchProvince = async () => {
      const res = await fetch(`https://province-api-vn.vercel.app/provinces`)
      const data = await res.json()
      setListProvince(data)
    }
    fetchProvince()
  }, [])

  useEffect(() => {
    const fetchDistricts = async () => {
      const res = await fetch(
        `https://province-api-vn.vercel.app/districts?parent_code=${location.province_code}`
      )
      const data = await res.json()
      setListDistricts(data)
    }
    fetchDistricts()
  }, [location.province_code])

  useEffect(() => {
    const fetchWards = async () => {
      const res = await fetch(
        `https://province-api-vn.vercel.app/wards?parent_code=${location.district_code}`
      )
      const data = await res.json()
      setListWards(data)
    }
    fetchWards()
  }, [location.district_code])

  useEffect(() => {
    fetchAddress()
  }, [])

  return (
    <Box>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500
          }
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <Typography
              id="transition-modal-title"
              variant="h6"
              component="h2"
              sx={{
                mb: 4
              }}
            >
              {openEditAddress ? "Add new address" : "Delivery address"}
            </Typography>
            {openEditAddress ? (
              <Box>
                {/* Form thêm địa chỉ */}
                <Box>
                  <Box>
                    <Typography>Full name:</Typography>
                    <TextField
                      id="outlined-basic"
                      label="name"
                      value={location.name}
                      variant="outlined"
                      onChange={(e) =>
                        setLocation((pre) => ({
                          ...pre,
                          name: e.target.value
                        }))
                      }
                      sx={{
                        mt: 1,
                        width: "100%"
                      }}
                    />
                  </Box>
                  <Box
                    sx={{
                      mt: 2
                    }}
                  >
                    <Typography>Phone number:</Typography>
                    <TextField
                      id="outlined-basic"
                      label="phone"
                      value={location.phone}
                      onChange={(e) =>
                        setLocation((pre) => ({
                          ...pre,
                          phone: e.target.value
                        }))
                      }
                      variant="outlined"
                      sx={{
                        mt: 1,
                        width: "100%"
                      }}
                    />
                  </Box>
                  <Box
                    sx={{
                      mt: 2
                    }}
                  >
                    <Typography>Address:</Typography>
                    <FormControl
                      fullWidth
                      sx={{
                        mt: 1
                      }}
                    >
                      <InputLabel id="province-select-label">
                        Province
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={location.province_code || ""}
                        label="Province"
                        onChange={(e) => {
                          const selectedCode = e.target.value
                          const selectedProvince = listProvince.find(
                            (item) => item.code === selectedCode
                          )
                          if (!selectedProvince) return
                          setLocation((prev) => ({
                            ...prev,
                            province: selectedProvince?.name_with_type,
                            province_code: selectedProvince?.code
                          }))
                        }}
                      >
                        <MenuItem value="" disabled>
                          Select Province
                        </MenuItem>
                        {listProvince.map((item) => (
                          <MenuItem key={item.code} value={item.code}>
                            {item.name_with_type}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                  <Box
                    sx={{
                      mt: 2
                    }}
                  >
                    <FormControl
                      fullWidth
                      sx={{
                        mt: 1
                      }}
                    >
                      <InputLabel id="province-select-label">
                        District
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={location.district_code || ""}
                        label="District"
                        onChange={(e) => {
                          const selectedCode = e.target.value
                          const selectedDistrict = listDistricts.find(
                            (i) => i.code === selectedCode
                          )
                          if (!selectedDistrict) return
                          setLocation((prev) => ({
                            ...prev,
                            district: selectedDistrict?.name_with_type,
                            district_code: selectedDistrict?.code
                          }))
                        }}
                      >
                        <MenuItem value="" disabled>
                          Select District
                        </MenuItem>
                        {listDistricts.map((item) => (
                          <MenuItem key={item.code} value={item.code}>
                            {item.name_with_type}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                  <Box
                    sx={{
                      mt: 2
                    }}
                  >
                    <FormControl
                      fullWidth
                      sx={{
                        mt: 1
                      }}
                    >
                      <InputLabel id="province-select-label">Ward</InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={location.ward_code || ""}
                        label="Province"
                        onChange={(e) => {
                          const selectedCode = e.target.value
                          const selectedWard = listWards.find(
                            (i) => i.code === selectedCode
                          )
                          if (!selectedWard) return
                          setLocation((prev) => ({
                            ...prev,
                            ward: selectedWard?.name_with_type,
                            ward_code: selectedWard?.code
                          }))
                        }}
                      >
                        <MenuItem value="" disabled>
                          Select Ward
                        </MenuItem>
                        {listWards.map((item) => (
                          <MenuItem key={item.code} value={item.code}>
                            {item.name_with_type}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                  <Box
                    sx={{
                      mt: 2
                    }}
                  >
                    <TextField
                      value={location.location}
                      id="outlined-basic"
                      label="Street"
                      variant="outlined"
                      onChange={(e) =>
                        setLocation((pre) => ({
                          ...pre,
                          location: e.target.value
                        }))
                      }
                      sx={{
                        width: "100%"
                      }}
                    />
                  </Box>
                  <Box
                    sx={{
                      mt: 2
                    }}
                  >
                    <FormControl>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={location.is_default}
                            onChange={(e) =>
                              setLocation((pre) => ({
                                ...pre,
                                is_default: e.target.checked
                              }))
                            }
                          />
                        }
                        label="Đặt làm địa chỉ mặc định"
                      />
                    </FormControl>
                  </Box>
                </Box>
                {/* Form input ở đây */}
                <Stack
                  spacing={2}
                  direction={"row"}
                  justifyContent={"flex-end"}
                  alignItems={"center"}
                  sx={{
                    mt: 2
                  }}
                >
                  <Button variant="outlined" onClick={handleOpenEditAddress}>
                    Go back
                  </Button>
                  <Button variant="contained" onClick={handleSubmitAddress}>
                    Save
                  </Button>
                </Stack>
              </Box>
            ) : (
              <Box>
                {/* Danh sách địa chỉ */}
                <FormControl sx={{ width: "100%" }}>
                  <RadioGroup
                    aria-labelledby="address-radio-buttons-group"
                    value={selectedAddressId}
                    onChange={(e) => {
                      const id = Number(e.target.value)
                      const selectedAddress = address.find((i) => i.id === id)
                      setSelectedAddressId(Number(e.target.value))
                      setSelectedAddress(selectedAddress ?? null)
                    }}
                    name="radio-buttons-group"
                  >
                    {address.map((item) => (
                      <Box key={item.id} sx={{ mb: 2 }}>
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <FormControlLabel
                            value={item.id}
                            control={<Radio />}
                            label={
                              <Stack>
                                <Typography fontWeight={600}>
                                  {item.name} | {item.phone}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{
                                    textTransform: "capitalize",
                                    fontSize: "12px"
                                  }}
                                >
                                  {`${item.street}, ${item.ward}, ${item.district}, ${item.province}`}
                                </Typography>
                              </Stack>
                            }
                          />
                          <Button
                            variant="text"
                            size="small"
                            onClick={() => handleUpdateAddress(Number(item.id))}
                            sx={{
                              whiteSpace: "nowrap"
                            }}
                          >
                            Cập nhật
                          </Button>
                        </Stack>
                      </Box>
                    ))}
                  </RadioGroup>
                </FormControl>

                {/* Nút Thêm địa chỉ (nằm bên trong Box chung) */}
                <Box mt={2}>
                  <Button
                    variant="outlined"
                    onClick={handleOpenEditAddress}
                    startIcon={<AddIcon />}
                    sx={{
                      color: "#1976d2",
                      borderColor: "#1976d2",
                      textTransform: "none",
                      fontWeight: 600,
                      borderRadius: "8px",
                      padding: "6px 16px"
                    }}
                  >
                    Thêm địa chỉ
                  </Button>
                </Box>
              </Box>
            )}
          </Box>
        </Fade>
      </Modal>
    </Box>
  )
}

export default Address
