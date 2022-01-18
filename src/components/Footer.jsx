import { Box, Typography } from "@mui/material";
import React from "react";

export default function Footer() {
    return (
      <Box sx={{  bgcolor: "#013220",height: 40 }}>
        <Typography variant="h5" color="white" textAlign="center">
          Ivan Zhyuliuk, 2022
        </Typography>
      </Box>
    );
  }