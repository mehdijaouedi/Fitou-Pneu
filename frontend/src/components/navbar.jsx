import React from "react";
import { AppBar, Box, Toolbar, Typography, IconButton, Button, Stack } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const Navbar = () => {
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

          {/* Profile and Cart Icons */}
          <Box sx={{ width: "33%", display: "flex", justifyContent: "flex-end", gap: 1 }}>
          <IconButton sx={{ color: "black" }}>
              <ShoppingCartIcon />
            </IconButton>
            <IconButton sx={{ color: "black" }}>
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
