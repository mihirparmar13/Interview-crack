import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, TextField, Button, Alert } from '@mui/material';
import { useFormik } from 'formik';
import axios from 'axios';
import { NavLink, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { HashLoader } from 'react-spinners';
import * as Yup from 'yup'; // Import Yup for validation

const Login = () => {
  let Token = localStorage.getItem("Token");
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState('');

  useEffect(() => {
    if (Token) {
      navigate('/admin');
    }
  }, [Token, navigate]);

  // Form validation schema using Yup
  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema, // Add validation schema here
    onSubmit: async (values) => {
      setLoader(true);
      try {
        const res = await axios.post(
          'https://interviewback-ucb4.onrender.com/admin/login',
          values
        );
        localStorage.setItem('Token', res.data.token);
        toast.success(res.data.message, {
          theme: "dark",
        });
        navigate('/admin');
      } catch (error) {
        setError('Invalid email or password.');
      } finally {
        setLoader(false);
      }
    },
  });

  if (loader) {
    return (
      <Box
        sx={{
          width: '100%',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <HashLoader color="#162de4" />
      </Box>
    );
  }

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
        <Typography
          variant="h4"
          sx={{
            textAlign: 'center',
            fontWeight: 'bold',
            marginBottom: 2,
            color: '#1976d2',
          }}
        >
          Admin Panel
        </Typography>
        {error && (
          <Alert severity="error" sx={{ marginBottom: 2 }}>
            {error}
          </Alert>
        )}
        <form onSubmit={formik.handleSubmit}>
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
          >
            Login
          </Button>
          <Box textAlign="center" mt={2}>
            Don't have an account? {' '}
            <NavLink 
            to="/register"
            style={{
              textDecoration: 'none',
              color: '#1976d2',
              fontWeight: 'bold',
            }}
            >
              Register</NavLink>
          </Box>
        </form>
      </Box>
    </Container>
  );
};

export default Login;
