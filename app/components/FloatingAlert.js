import React from "react";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";

export default function FloatingAlert({ message, severity, show }) {
  if (!show) return null; // If `show` is false, don't render the component.

  return (
    <Stack
      sx={{
        position: "fixed",
        top: 20,
        left: "50%",
        transform: "translateX(-50%)",
        width: "90%",
        maxWidth: "400px",
        zIndex: 9999,
      }}
      spacing={2}
    >
      <Alert severity={severity}>{message}</Alert>
    </Stack>
  );
}
