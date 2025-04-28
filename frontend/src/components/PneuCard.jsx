import { Card, Typography, Box } from "@mui/material";
import React from "react";

function PneuCard({ data }) {
  const productImage = data?.images?.[0].path ? data.images[0].path : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjmvwItjeJ4l4wDoieU_TTjdoYuhTr5FBpJA&s";

  return (
    <Card
      sx={{
        width: 240,
        height: 300,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        padding: 2,
        borderRadius: 4,
        boxShadow: 3,
      }}
    >
      <Box
        sx={{
          width: "100%",
          paddingTop: "75%", // 4:3 aspect ratio
          position: "relative",
          mb: 2,
        }}
      >
        <img
          src={productImage}
          alt={data.name || "Product"}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: 8,
          }}
        />
      </Box>

      <Typography variant="subtitle1" fontWeight="bold" textAlign="center" noWrap>
        {data.name}
      </Typography>

      <Typography
        variant="body2"
        color="text.secondary"
        textAlign="center"
        sx={{ mt: 1, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}
      >
        {data.description}
      </Typography>
         {/* Uncomment if you want to show the date added */}
      {/* <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontSize: "0.75rem" }}>
        {new Date(data.dateAdded).toLocaleDateString()}
      </Typography> */}

      <Typography variant="h6" fontWeight="bold" sx={{ mt: 1 }}>
        {data.price} €
      </Typography>
    </Card>
  );
}

export default PneuCard;
