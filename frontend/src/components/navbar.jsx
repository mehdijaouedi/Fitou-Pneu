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
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logoutAction, openLoginModal, user, openSignUpModal } = useAuth();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: "white", boxShadow: "none" }}>
        <Toolbar sx={{ justifyContent: "space-between", alignItems: "center" }}>
          <Box sx={{ width: "33%" }} />
          <Box sx={{ width: "33%", textAlign: "center" }}>
            <Typography variant="h5" sx={{ fontWeight: "bold", color: "black", fontFamily: "serif" }}>
              FitouPneus
            </Typography>
          </Box>
          <Box sx={{ width: "33%", display: "flex", justifyContent: "flex-end", gap: 1 }}>
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
                  <MenuItem onClick={() => { navigate("/history"); handleClose(); }}>
                    History
                  </MenuItem>
                  <MenuItem onClick={() => { logoutAction(); handleClose(); }}>
                    Logout
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
                    Login
                  </MenuItem>
                  <MenuItem onClick={() => { openSignUpModal(); handleClose(); }}>
                  Sign Up
                  </MenuItem>
                </Menu>
              </>
            )}

          </Box>
        </Toolbar>
      </AppBar>

      {/* Category Buttons */}
      <Box sx={{ backgroundColor: "white", py: 4 }}>
        <Stack direction="row" justifyContent="center" spacing={6}>
          <Button
            variant="outlined"
            onClick={() => navigate("/pneus")}
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
            Pneus
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate("/jantes")}
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
            Jantes
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate("/")}
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
            Pneus & Jantes
          </Button>
        </Stack>
      </Box>
    </>
  );
};

export default Navbar;
