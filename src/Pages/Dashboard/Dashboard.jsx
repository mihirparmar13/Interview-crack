import React, { useEffect, useState } from 'react';
import Drawer from '../../Components/Drawer/Drawer';
import { Card, Col, Container, Row } from 'react-bootstrap';
import { Box, Typography } from '@mui/material';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

const Dashboard = () => {
  let [category, setcategory] = useState([]);
  let [subcategory, setsubcategory] = useState([]);
  let [questions, setquestions] = useState([]);
  let token = localStorage.getItem("Token");

  useEffect((e) => {
    async function getdata() {
      try {
        let res = await axios.get("https://interviewback-ucb4.onrender.com/category/", {
          headers: {
            Authorization: token
          }
        })
        let ress = await axios.get("https://interviewback-ucb4.onrender.com/subcategory/", {
          headers: {
            Authorization: token
          }
        })
        let resss = await axios.get("https://interviewback-ucb4.onrender.com/questions/", {
          headers: {
            Authorization: token
          }
        })
        setcategory(res.data.data);
        setsubcategory(ress.data.data);
        setquestions(resss.data.data);
        // console.log(res.data.data);

      } catch (error) {
        console.log(error);

      }
    }
    getdata();
  }, [])

  return (
    <Drawer>
      <Container className="mt-4">
        <Row >
          {/* Category Box */}
          <Col md={4}>
            <Card className="shadow-sm">
              <Card.Body>
                <Box display="flex" flexDirection="column" alignItems="center">
                  <Typography variant="h5" className="fw-bold" gutterBottom>Total Category</Typography>
                  <Typography variant="h3" className="fw-bold" color="dark">{category.length}</Typography>
                </Box>
              </Card.Body>
            </Card>
          </Col>

          {/* Sub-category Box */}
          <Col md={4}>
            <Card className="shadow-sm">
              <Card.Body>
                <Box display="flex" flexDirection="column" alignItems="center">
                  <Typography variant="h5" className="fw-bold" gutterBottom>Total Sub-category</Typography>
                  <Typography variant="h3" className="fw-bold" color="dark">{subcategory.length}</Typography>
                </Box>
              </Card.Body>
            </Card>
          </Col>

          {/* Total Q/A Set Box */}
          <Col md={4}>
            <Card className="shadow-sm">
              <Card.Body>
                <Box display="flex" flexDirection="column" alignItems="center">
                  <Typography variant="h5" className="fw-bold" gutterBottom>Total Q/A</Typography>
                  <Typography variant="h3" className="fw-bold" color="dark">{questions.length}</Typography>
                </Box>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </Drawer>
  );
};

export default Dashboard;
