import { Card, Typography } from "@mui/material";
import React from "react";
import { data } from "react-router-dom";

function PneuCard({data}) {
  return (
    <Card
      sx={{
        width: 220,
        height: 190,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 2,
        borderRadius: 4,
      }}
    >
      <img
        src={ data?.images ? data?.images[0].path:data.image }
        alt="Product"
        style={{ width: 103, height: 100, objectFit: "cover", marginBottom: 8 }}
      />
      <Typography variant="subtitle1" fontWeight="bold">
        {data.name}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {data.price} €
      </Typography>
    </Card>
  );
}

export default PneuCard;
