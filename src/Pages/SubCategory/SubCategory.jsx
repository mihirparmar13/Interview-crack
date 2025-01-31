import React, { useEffect, useState } from 'react'
import Drawer from '../../Components/Drawer/Drawer'
import TextField from '../../Components/TextField';
import TableComponent from '../../Components/TableComponent';
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Box, Switch, TableCell, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import { useFormik } from "formik";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import BorderColorRoundedIcon from '@mui/icons-material/BorderColorRounded';
import { BeatLoader } from "react-spinners";



const SubCategory = () => {
  const token = localStorage.getItem("Token");
  const [subcategory, setSubCategory] = useState([]);
  const [filterSubcategory, setfiltersubcategory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [eid, setEid] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const TableHeader = [
    "No",
    "SubCategory Name",
    "Category Name",
    "Status",
    "Delete",
    "Update",
  ];

  const formik = useFormik({
    initialValues: {
      subCategoryname: "",
      categoryID: "",
    },
    onSubmit: async (values, { resetForm }) => {
      try {
        const url = eid
          ? `https://interviewback-ucb4.onrender.com/subcategory/${eid}`
          : "https://interviewback-ucb4.onrender.com/subcategory/create";
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
        toast.error("An error occurred.");
        console.error(error);
      }
    },
  });

  const dataFetch = async () => {
    setLoading(true);
    try {
      const res = await axios.get("https://interviewback-ucb4.onrender.com/subcategory/",{
          headers: { Authorization: token },
        }
      );
      setSubCategory(res.data.data);
      setfiltersubcategory(res.data.data);
    } catch (error) {
      toast.error("Failed to fetch subcategories.");
      console.error(error);
    } finally {
      setLoading(false);
    }
      
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(
        "https://interviewback-ucb4.onrender.com/category/",
        {
          headers: { Authorization: token },
        }
      );
      setCategories(res.data.data);
    } catch (error) {
      toast.error("Failed to fetch categories.");
      console.error(error);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = subcategory.filter((sub) =>
      sub.subCategoryname.toLowerCase().includes(term) ||
      sub.categoryID?.categoryName?.toLowerCase().includes(term)
    );
    setfiltersubcategory(filtered);
  };

  const updateData = (id) => {
    const selectedData = subcategory.find((item) => item._id === id);
    setEid(id);
    formik.setValues({
      subCategoryname: selectedData.subCategoryname || "",
      categoryID: selectedData.categoryID?._id || "",
    });
    setOpen(true);
  };

  const switchToggle = async (id) => {
    const selectedData = subcategory.find((item) => item._id === id);
    const updatedStatus = selectedData.status === "on" ? "off" : "on";

    try {
      await axios.patch(
        `https://interviewback-ucb4.onrender.com/subcategory/${id}`,
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
      const res = await axios.delete(
        `hhttps://interviewback-ucb4.onrender.com/subcatagory/${id}`,
        {
          headers: { Authorization: token },
        }
      );
      toast.success(res.data.message);
      dataFetch();
    } catch (error) {
      toast.error("Failed to delete subcategory.");
      console.error(error);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setEid(null);
    formik.resetForm();
  };

  useEffect(() => {
    dataFetch();
    fetchCategories();
  }, []);

  return (
    <Drawer>
      <Box className="mb-2">
        <React.Fragment>
          <Box className='gap-2 d-flex justify-content-between align-items-center'>
            <Box sx={{ width: '85%' }}>
              <TextField label='Search Sub-Category' value={searchTerm} onChange={handleSearch} />
            </Box>
            <Box sx={{ width: '15%' }}>
              <Button variant="contained" onClick={() => { setOpen(true) }} className="w-100 py-3">
                ADD SUB CATEGORY
              </Button>
            </Box>
          </Box>
        </React.Fragment>
      </Box>
      {loading ? ( 
        <Box className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
          <BeatLoader color="#1b4fe4" />
        </Box>
      ) : (
      <Box sx={{ width: "100%" }}>
        <TableComponent
          TableHeader={TableHeader}
          TableData={subcategory}
          renderRow={(row, No) => (
            <>
              <TableCell>{No + 1}</TableCell>
              <TableCell>{row.subCategoryname}</TableCell>
              <TableCell>{row.categoryID?.categoryName}</TableCell>
              <TableCell>
                <Switch
                  checked={row.status === "on"}
                  onClick={() => switchToggle(row._id)}
                />
              </TableCell>
              <TableCell align="left">
                <Button
                  onClick={() => deleteData(row._id)}
                >
                  <DeleteRoundedIcon className="text-danger" />
                </Button>
              </TableCell>
              <TableCell align="left">
                <Button
                  onClick={() => updateData(row._id)}
                >
                  <BorderColorRoundedIcon className="text-success" />
                </Button>
              </TableCell>
            </>
          )}
        />
      </Box>
      )}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {eid ? "Update SubCategory" : "Add SubCategory"}
        </DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            <TextField
              label="SubCategory Name"
              name="subCategoryname"
              onChange={formik.handleChange}
              value={formik.values.subCategoryname}
              fullWidth
            />
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Category</InputLabel>
              <Select
                name="categoryID"
                value={formik.values.categoryID}
                onChange={formik.handleChange}
              >
                {categories.map((category) => (
                  <MenuItem key={category._id} value={category._id}>
                    {category.categoryName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
  )
}

export default SubCategory
