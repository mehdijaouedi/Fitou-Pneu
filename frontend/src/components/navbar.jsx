import React from "react";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Stack,
  Badge
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router-dom";
import { useCart } from "../store/slice/CartContext.jsx"; // Adjust path if needed

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* Top Navbar */}
      <AppBar position="static" sx={{ backgroundColor: "white", boxShadow: "none" }}>
        <Toolbar sx={{ justifyContent: "space-between", alignItems: "center" }}>
          {/* Empty box to push logo to center */}
          <Box sx={{ width: "33%" }} />

          {/* Logo */}
          <Box sx={{ width: "33%", textAlign: "center" }}>
            <Typography variant="h5" sx={{ fontWeight: "bold", color: "black", fontFamily: "serif" }}>
              FitouPneus
            </Typography>
          </Box>

          {/* Empty box to center the logo */}

          {/* Profile and Cart Icons */}
          <Box sx={{ width: "33%", display: "flex", justifyContent: "flex-end", gap: 1 }}>
            <IconButton sx={{ color: "black" }} onClick={() => navigate("/cart")}>
              <Badge  color="secondary">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
            <IconButton sx={{ color: "black" }} onClick={() => navigate("/profile")}>
              <AccountCircleIcon />
            </IconButton>
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
