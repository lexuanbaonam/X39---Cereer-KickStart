import React, { useEffect, useRef } from 'react';
import {
  Button,
  TextField,
  Box,
  Typography,
  Container,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { styled } from '@mui/system';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import * as Yup from 'yup';
// MUI Date Picker
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/vi';

const FormContainer = styled(Box)(() => ({
  marginTop: '64px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  backgroundColor: '#ffffff',
  padding: '32px',
  borderRadius: '8px',
  boxShadow: '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)',
}));

// Define Yup validation schema
const validationSchema = Yup.object({
  personalEmail: Yup.string()
    .email('Email không hợp lệ')
    .required('Email cá nhân là bắt buộc'),
  companyEmail: Yup.string() // Thêm validation cho companyEmail
    .email('Email công ty không hợp lệ')
    .required('Email công ty là bắt buộc'),
  name: Yup.string()
    .min(2, 'Họ và tên phải có ít nhất 2 ký tự')
    .required('Họ và tên là bắt buộc'),
  phoneNumber: Yup.string()
    .matches(/^\+?[0-9]{7,15}$/, 'Số điện thoại không hợp lệ')
    .required('Số điện thoại là bắt buộc'),
  dob: Yup.date()
    .max(new Date(), 'Ngày sinh không thể nằm trong tương lai')
    .required('Ngày sinh là bắt buộc'),
  jobPosition: Yup.string()
    .required('Vui lòng chọn chức vụ'),
});

const CreateProfile = ({ setCurrentPage, authToken, onProfileCreated }) => {
  const [availableJobPositions, setAvailableJobPositions] = React.useState([]);
  const [fetchingJobPositions, setFetchingJobPositions] = React.useState(false);
  const fetchingJobPositionsRef = useRef(false);

  useEffect(() => {
    const fetchJobPositions = async () => {
      if (fetchingJobPositionsRef.current) return;
      fetchingJobPositionsRef.current = true;
      setFetchingJobPositions(true);
      try {
        const res = await fetch('https://back-end-hk2p.onrender.com/api/job-positions/all', {
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` },
        });
        const data = await res.json();
        if (res.ok) setAvailableJobPositions(data.jobPositions);
        else toast.error(data.message || 'Lỗi khi tải danh sách chức vụ.');
      } catch (error) {
        console.error('Fetch job positions error:', error);
        toast.error('Lỗi mạng khi tải danh sách chức vụ.');
      } finally {
        setFetchingJobPositions(false);
        fetchingJobPositionsRef.current = false;
      }
    };

    if (!authToken) {
      toast.error('Không có token xác thực. Vui lòng đăng nhập lại.');
      setCurrentPage('/login');
    } else {
      fetchJobPositions();
    }
  }, [authToken, setCurrentPage]);

  const formik = useFormik({
    initialValues: {
      personalEmail: '',
      companyEmail: '', // Thêm trường companyEmail vào initialValues
      name: '',
      phoneNumber: '',
      dob: null,
      jobPosition: '',
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      // Adjust payload to match backend expectations
      const payload = {
        personalEmail: values.personalEmail,
        companyEmail: values.companyEmail, // Sử dụng giá trị từ form
        name: values.name,
        phoneNumber: values.phoneNumber,
        dob: values.dob.format('YYYY-MM-DD'),
        departs: [],
        jobPosition: values.jobPosition, // send as string
      };
      console.log('Creating profile payload:', payload);

      try {
        const res = await fetch('https://back-end-hk2p.onrender.com/api/users/create-profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (res.ok) {
          toast.success(data.message || 'Hồ sơ đã được tạo thành công!');
          onProfileCreated();
        } else {
          console.error('Create profile error response:', data);
          toast.error(data.message || 'Tạo hồ sơ thất bại với lỗi phía server.');
        }
      } catch (error) {
        console.error('Lỗi khi tạo hồ sơ:', error);
        toast.error('Lỗi mạng hoặc không mong muốn khi tạo hồ sơ.');
      } finally {
        setSubmitting(false);
      }
    },
  });

  if (fetchingJobPositions) {
    return (
      <Container component="main" maxWidth="xs">
        <FormContainer>
          <CircularProgress />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Đang tải danh sách chức vụ...
          </Typography>
        </FormContainer>
      </Container>
    );
  }

  return (
    <Container component="main" maxWidth="sm">
      <FormContainer>
        <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
          Tạo Hồ Sơ Người Dùng
        </Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="vi">
          <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
            <TextField
              fullWidth
              id="personalEmail"
              name="personalEmail"
              label="Email Cá Nhân"
              value={formik.values.personalEmail}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.personalEmail && Boolean(formik.errors.personalEmail)}
              helperText={formik.touched.personalEmail && formik.errors.personalEmail}
              margin="normal"
            />
            <TextField
              fullWidth
              id="companyEmail" // Thêm trường companyEmail
              name="companyEmail"
              label="Email Công Ty"
              value={formik.values.companyEmail}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.companyEmail && Boolean(formik.errors.companyEmail)}
              helperText={formik.touched.companyEmail && formik.errors.companyEmail}
              margin="normal"
            />
            <TextField
              fullWidth
              id="name"
              name="name"
              label="Họ và Tên"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
              margin="normal"
            />
            <TextField
              fullWidth
              id="phoneNumber"
              name="phoneNumber"
              label="Số Điện Thoại"
              value={formik.values.phoneNumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
              helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
              margin="normal"
            />
            <DatePicker
              label="Ngày Sinh"
              value={formik.values.dob}
              onChange={(newValue) => formik.setFieldValue('dob', newValue)}
              inputFormat="DD/MM/YYYY"
              mask="__/__/____"
              sx={{ width: '100%', mt: 2 }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  margin="normal"
                  error={formik.touched.dob && Boolean(formik.errors.dob)}
                  helperText={formik.touched.dob && formik.errors.dob}
                />
              )}
            />
            <FormControl fullWidth margin="normal" error={formik.touched.jobPosition && Boolean(formik.errors.jobPosition)}>
              <InputLabel id="jobPosition-label">Chức vụ</InputLabel>
              <Select
                labelId="jobPosition-label"
                id="jobPosition"
                name="jobPosition"
                value={formik.values.jobPosition}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                label="Chức vụ"
              >
                <MenuItem value=""><em>Chọn chức vụ</em></MenuItem>
                {availableJobPositions.map((position) => (
                  <MenuItem key={position._id} value={position._id}>
                    {position.title}
                  </MenuItem>
                ))}
              </Select>
              {formik.touched.jobPosition && formik.errors.jobPosition && (
                <Typography variant="caption" color="error">
                  {formik.errors.jobPosition}
                </Typography>
              )}
            </FormControl>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 10, bgcolor: '#4a90e2', '&:hover': { bgcolor: '#357abd' } }}
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Tạo Hồ Sơ'}
            </Button>
          </Box>
        </LocalizationProvider>
      </FormContainer>
    </Container>
  );
};

export default CreateProfile;
