import React, { useState } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Stack,
  Badge,
  Menu,
  MenuItem,
  Divider,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logoutAction, openLoginModal, user, openSignUpModal } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const open = Boolean(anchorEl);
  const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleMobileNavigation = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const categoryButtons = [
    { label: "Accueil", path: "/" },
    { label: "Pneus", path: "/pneus" },
    { label: "Jantes", path: "/jentes" },
    { label: "Contact", path: "/contact" },
  ];

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: "white", boxShadow: "none" }}>
        <Toolbar sx={{ justifyContent: "space-between", alignItems: "center" }}>
          {isMobile ? (
            <IconButton
              sx={{ color: "black" }}
              onClick={handleMobileMenuToggle}
            >
              <MenuIcon />
            </IconButton>
          ) : (
            <Box sx={{ width: "33%" }} />
          )}
          
          <Box sx={{ 
            width: isMobile ? "auto" : "33%", 
            textAlign: "center",
            flex: isMobile ? 1 : "none"
          }}>
            <Typography variant="h5" sx={{ fontWeight: "bold", color: "black", fontFamily: "serif" }}>
              FitPneus
            </Typography>
          </Box>
          
          <Box sx={{ 
            width: isMobile ? "auto" : "33%", 
            display: "flex", 
            justifyContent: "flex-end", 
            gap: 1 
          }}>
            <IconButton sx={{ color: "black" }} onClick={() => navigate("/cart")}>
              <Badge color="secondary">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
            <IconButton sx={{ color: "black" }} onClick={handleMenuClick}>
              <AccountCircleIcon />
            </IconButton>
            {isAuthenticated ? (
              <>
                <Menu
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  transformOrigin={{ vertical: "top", horizontal: "right" }}
                >
                  <MenuItem disabled>{user?.prenom}</MenuItem>
                  <MenuItem disabled>{user?.email}</MenuItem>
                  <Divider />
                  <MenuItem onClick={() => { navigate("/ClientHistorique"); handleClose(); }}>
                    Historique
                  </MenuItem>
                  <MenuItem onClick={() => { logoutAction(); handleClose(); }}>
                    Déconnexion
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Menu
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  transformOrigin={{ vertical: "top", horizontal: "right" }}
                >
                  <MenuItem onClick={() => { openLoginModal(); handleClose(); }}>
                    Connexion
                  </MenuItem>
                  <MenuItem onClick={() => { openSignUpModal(); handleClose(); }}>
                    Inscription
                  </MenuItem>
                </Menu>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={handleMobileMenuToggle}
      >
        <Box sx={{ width: 250, pt: 2 }}>
          <List>
            {categoryButtons.map((button) => (
              <ListItem 
                key={button.path}
                button 
                onClick={() => handleMobileNavigation(button.path)}
              >
                <ListItemText 
                  primary={button.label}
                  sx={{ textAlign: "center", fontWeight: "bold" }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Category Buttons - Desktop Only */}
      {!isMobile && (
        <Box sx={{ backgroundColor: "white", py: 4 }}>
          <Stack direction="row" justifyContent="center" spacing={6}>
            {categoryButtons.map((button) => (
              <Button
                key={button.path}
                variant="outlined"
                onClick={() => navigate(button.path)}
                sx={{
                  color: "black",
                  borderColor: "black",
                  fontSize: "1.2rem",
                  px: 4,
                  py: 1.5,
                  borderRadius: "20px",
                  fontWeight: "bold",
                }}
              >
                {button.label}
              </Button>
            ))}
          </Stack>
        </Box>
      )}
    </>
  );
};

export default Navbar;
