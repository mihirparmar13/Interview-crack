import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import { Drawer as MuiDrawer } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Category, ControlPointDuplicate, Help, Logout, SpaceDashboard } from '@mui/icons-material';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Button } from 'react-bootstrap';
const drawerWidth = 240;

let pages = [
  {
    name: "Dashboard",
    path: "/admin",
    icone: <SpaceDashboard />
  },
  {
    name: "Category",
    path: "/admin/Category",
    icone: <Category />
  },
  {
    name: "SubCategory",
    path: "/admin/SubCategory",
    icone: <ControlPointDuplicate />
  }, {
    name: "Q & A",
    path: "/admin/Qa",
    icone: <Help />
  }
];
function Drawer(props) {
  let navigate = useNavigate()
  let Token = localStorage.getItem("Token");
  console.log(Token);

  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);


  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };


  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  const location = useLocation();

  // Update the header title based on the current path
  const getPageTitle = (path) => {
    const currentPage = pages.find(page => page + 1 .path === path);
    return currentPage ? currentPage.name : 'Dashboard'; // Default title if not found
  };
  const getPageitle = (path) => {
    const currentPage = pages.find(page => page.path === path);
    if (currentPage.name != 'Dashboard') {
      return currentPage ? ' / ' + currentPage.name : 'Dashboard';
    }
  };

  const drawer = (
    <div>
      <Toolbar sx={{
        backgroundColor: '#1976D2',
        color: 'white',
        fontSize: '22px',
        fontWeight: '500',
      }}>
        Interview Portal
      </Toolbar>
      <Divider />
      <List>
        {pages.map((item, index) => {
          const isActive = location.pathname === item.path;

          return (
            <Link
              to={item.path}
              key={item.path} // Use item.path as the key
              style={{ textDecoration: "none", color: "black" }}
            >
              <ListItem disablePadding>
                <ListItemButton
                  sx={{
                    backgroundColor: isActive ? "#1976D2" : "transparent",
                    margin: "10px",
                    borderRadius: "3px",
                    color: isActive ? "white" : "black",
                    "&:hover": {
                      backgroundColor: isActive ? "#1976D2" : "lightgray",
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: isActive ? "white" : "",
                    }}
                  >
                    {item.icone}
                  </ListItemIcon>
                  <ListItemText primary={item.name} />
                </ListItemButton>
              </ListItem>
            </Link>
          );
        })}
      </List>
    </div>
  );

  // Remove this const when copying and pasting into your project.
  const container = window !== undefined ? () => window().document.body : undefined;

  let logoutPanel = () => {
    localStorage.removeItem("Token")
    navigate("/login")
  }
  useEffect(() => {
    if (!Token) {
      navigate("/login");
    }
  }, [Token]);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">

            {/* Header Current Path */}
            {getPageTitle(location.pathname)}
            {getPageitle(location.pathname)}

          </Typography>
          <NavLink to="/">
            <Button onClick={logoutPanel}>
              <Logout sx={{ color: "white" }} />
              {/* variant="contained" onClick={logoutPanel}>logoutPanel */}
            </Button>
          </NavLink>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <MuiDrawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth
            },
          }}
        >
          {drawer}
        </MuiDrawer>
        <MuiDrawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth
            },
          }}
          open
        >
          {drawer}
        </MuiDrawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar />
        {props.children}
      </Box>
    </Box>
  );
}

Drawer.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * Remove this when copying and pasting into your project.
   */
  window: PropTypes.func,
};

export default Drawer;
