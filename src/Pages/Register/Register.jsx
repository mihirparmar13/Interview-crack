import React, { useState } from 'react';
import { Container, Box, Button, Typography, CircularProgress, Alert } from '@mui/material';
import TextField from '@mui/material/TextField';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate, NavLink } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  // Form validation schema using Yup
  const validationSchema = Yup.object({
    firstname: Yup.string().required('First name is required'),
    lastname: Yup.string().required('Last name is required'),
    contact: Yup.string()
      .matches(/^[0-9]{10}$/, 'Contact must be a 10-digit number')
      .required('Contact is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm Password is required'),
  });

  // Formik setup for form management
  const formik = useFormik({
    initialValues: {
      firstname: '',
      lastname: '',
      contact: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      setError('');

      try {
        const { firstname, lastname, contact, email, password } = values;

        // API request to register user
        const res = await axios.post(
          'https://interviewback-ucb4.onrender.com/admin/signup',
          { firstname, lastname, contact, email, password }
        );

        toast.success('Registration successful!');
        console.log(res.data);

        // Redirect to login/home page
        navigate('/');
      } catch (error) {
        console.error('Registration Error:', error);

        // Display API error message
        const errorMsg = error.response?.data?.message || 'Registration failed. Please try again.';
        setError(errorMsg);
        toast.error(errorMsg);
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
      }}
    >
      <Box
        sx={{
          padding: 4,
          boxShadow: 3,
          borderRadius: 2,
          width: '100%',
        }}
      >
        {/* Page Title */}
        <Typography
          variant="h4"
          sx={{
            textAlign: 'center',
            fontWeight: 'bold',
            marginBottom: 2,
            color: '#1976d2',
          }}
        >
          Register
        </Typography>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ marginBottom: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={formik.handleSubmit}>
          {/* First Name Input */}
          <TextField
            fullWidth
            label="First Name"
            name="firstname"
            margin="normal"
            variant="outlined"
            value={formik.values.firstname}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.firstname && Boolean(formik.errors.firstname)}
            helperText={formik.touched.firstname && formik.errors.firstname}
          />

          {/* Last Name Input */}
          <TextField
            fullWidth
            label="Last Name"
            name="lastname"
            margin="normal"
            variant="outlined"
            value={formik.values.lastname}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.lastname && Boolean(formik.errors.lastname)}
            helperText={formik.touched.lastname && formik.errors.lastname}
          />

          {/* Contact Input */}
          <TextField
            fullWidth
            label="Contact"
            name="contact"
            margin="normal"
            variant="outlined"
            value={formik.values.contact}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.contact && Boolean(formik.errors.contact)}
            helperText={formik.touched.contact && formik.errors.contact}
          />

          {/* Email Input */}
          <TextField
            fullWidth
            label="Email"
            name="email"
            margin="normal"
            variant="outlined"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />

          {/* Password Input */}
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            margin="normal"
            variant="outlined"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
          />

          {/* Confirm Password Input */}
          <TextField
            fullWidth
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            margin="normal"
            variant="outlined"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
            helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              marginTop: 3,
              backgroundColor: '#1976d2',
              '&:hover': {
                backgroundColor: '#125ca3',
              },
            }}
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Register'}
          </Button>

          {/* Login Link */}
          <Box textAlign="center" mt={2}>
            Already have an account?{' '}
            <NavLink
              to="/"
              style={{
                textDecoration: 'none',
                color: '#1976d2',
                fontWeight: 'bold',
              }}
            >
              Login
            </NavLink>
          </Box>
        </form>
      </Box>
      <ToastContainer />
    </Container>
  );
};

export default Register;
