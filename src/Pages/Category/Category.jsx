import React, { useEffect, useState } from 'react';
import Drawer from '../../Components/Drawer/Drawer';
import TextField from '../../Components/TextField';
import TableComponent from '../../Components/TableComponent';
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Box, Switch, TableCell } from "@mui/material";
import { useFormik } from "formik";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import BorderColorRoundedIcon from '@mui/icons-material/BorderColorRounded';
import { BeatLoader } from "react-spinners";

const Category = () => {
  const token = localStorage.getItem("Token");
  const [category, setCategory] = useState([]);
  const [filteredCategory, setFilteredCategory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [eid, setEid] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const TableHeader = ["No", "Category Name", "Status", "Delete", "Update"];

  const formik = useFormik({
    initialValues: { categoryName: "" },
    onSubmit: async (values, { resetForm }) => {
      try {
        const url = eid
          ? `https://interviewback-ucb4.onrender.com/category/${eid}`
          : "https://interviewback-ucb4.onrender.com/category/create";
        const method = eid ? "patch" : "post";
        const res = await axios[method](url, values, {
          headers: { Authorization: token },
        });

        toast.success(res.data.message);
        resetForm();
        setEid(null);
        handleClose();
        dataFetch();
      } catch (error) {
        toast.error("An error occurred while processing your request.");
        console.error(error);
      }
    },
  });

  const dataFetch = async () => {
    setLoading(true);
    try {
      const res = await axios.get("https://interviewback-ucb4.onrender.com/category/", {
        headers: { Authorization: token },
      });
      setCategory(res.data.data);
      setFilteredCategory(res.data.data);
    } catch (error) {
      toast.error("Failed to fetch categories.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateData = (id) => {
    const selectedData = category.find((item) => item._id === id);
    setEid(id);
    formik.setValues(selectedData);
    setOpen(true);
  };

  const switchToggle = async (id) => {
    const selectedData = category.find((item) => item._id === id);
    const updatedStatus = selectedData.status === "on" ? "off" : "on";

    try {
      await axios.patch(
        `https://interviewback-ucb4.onrender.com/category/${id}`,
        { status: updatedStatus },
        { headers: { Authorization: token } }
      );
      dataFetch();
    } catch (error) {
      toast.error("Failed to update status.");
      console.error(error);
    }
  };

  const deleteData = async (id) => {
    try {
      const res = await axios.delete(`https://interviewback-ucb4.onrender.com/category/${id}`, {
        headers: { Authorization: token },
      });
      toast.success(res.data.message);
      dataFetch();
    } catch (error) {
      toast.error("Failed to delete category.");
      console.error(error);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = category.filter((cat) =>
      cat.categoryName.toLowerCase().includes(term)
    );
    setFilteredCategory(filtered);
  };

  useEffect(() => {
    dataFetch();
  }, []);

  const handleClose = () => {
    setOpen(false);
    setEid(null);
    formik.resetForm();
  };

  return (
    <Drawer>
      <Box className="mb-2">
        <React.Fragment>
          <Box className='gap-2 d-flex justify-content-between align-items-center'>
            <Box sx={{ width: '85%' }}>
              <TextField label='Search Category' value={searchTerm} onChange={handleSearch} />
            </Box>
            <Box sx={{ width: '15%' }}>
              <Button variant="contained" onClick={() => { setOpen(true) }} className="w-100 py-3">
                ADD CATEGORY
              </Button>
            </Box>
          </Box>
        </React.Fragment>
      </Box>
      {loading ? ( // Conditional rendering for loader
              <Box className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
                <BeatLoader color="#1b4fe4" />
              </Box>
            ) : (
      <Box sx={{ width: "100%" }}>
        <TableComponent
          TableHeader={TableHeader}
          TableData={filteredCategory}
          renderRow={(row, No) => (
            <>
              <TableCell>{No + 1}</TableCell>
              <TableCell>{row.categoryName}</TableCell>
              <TableCell>
                <Switch
                  checked={row.status === "on"}
                  onClick={() => switchToggle(row._id)}
                />
              </TableCell>
              <TableCell>
                <Button color="white" onClick={() => deleteData(row._id)}>
                  <DeleteRoundedIcon className="text-danger" />
                </Button>
              </TableCell>
              <TableCell>
                <Button color="white" onClick={() => updateData(row._id)}>
                  <BorderColorRoundedIcon className="text-success" />
                </Button>
              </TableCell>
            </>
          )}
        />
      </Box>
      )}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{eid ? "Update Category" : "Add Category"}</DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            <TextField
              label="Category Name"
              name="categoryName"
              onChange={formik.handleChange}
              value={formik.values.categoryName}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button variant="contained" type="submit">
              {eid ? "Update" : "Add"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      <ToastContainer />
    </Drawer>
  );
};

export default Category;