import { Route, Routes } from 'react-router-dom';
import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import Category from './Pages/Category/Category';
import Dashboard from './Pages/Dashboard/Dashboard';
import Qa from './Pages/QA/Qa';
import SubCategory from './Pages/SubCategory/SubCategory';
import NoFound from './Pages/NoFound/NoFound';
import Login from './Pages/Login/Login'
import { ToastContainer } from 'react-toastify';
import Register from './Pages/Register/Register';

function App() {
  return (
    <>
    <ToastContainer theme='dark'/>
    <Routes>
        <Route index element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/admin/category" element={<Category />} />
        <Route path="/admin/subcategory" element={<SubCategory />} />
        <Route path="/admin/qa" element={<Qa />} />
        <Route path="*" element={<NoFound />} />
      </Routes>
    </>
  )
}

export default App;
