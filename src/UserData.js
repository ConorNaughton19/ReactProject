import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
} from "@mui/material";
import { db } from "./config/fire";
import useAuth from "./useAuth";
import { IconButton, TextField } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const ITEMS_PER_PAGE = 10;

const UserData = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [newReading, setNewReading] = useState({ y: "", date: "", time: "" });
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      const dbRef = db.ref(`users/${currentUser.uid}/mockLineData/0/data`);
      dbRef.on("value", (snapshot) => {
        const lineData = snapshot.val();
        if (lineData) {
          const sortedData = Object.entries(lineData).sort(
            ([a], [b]) => b - a
          );
          setData(sortedData);
        }
      });
      return () => dbRef.off();
    }
  }, [currentUser]);

  const deleteReading = (timestamp) => {
    db.ref(
      `users/${currentUser.uid}/mockLineData/0/data/${timestamp}`
    ).remove();
  };

  const updateReading = (timestamp, newValue) => {
    const value = parseFloat(newValue);
    if (isNaN(value)) {
      alert("Please enter a valid number.");
      return;
    }

    db.ref(`users/${currentUser.uid}/mockLineData/0/data/${timestamp}`).update({
      y: value,
    });
  };

  const updateNote = (timestamp, note) => {
    db.ref(`users/${currentUser.uid}/mockLineData/0/data/${timestamp}`).update({
      note,
    });
  };

  const addReading = () => {
    const glucoseValue = parseFloat(newReading.y);
    if (isNaN(glucoseValue)) {
      alert("Please enter a valid glucose reading.");
      return;
    }

    // Check if the glucose reading is positive
  if (glucoseValue <= 0) {
    alert("Please enter a positive glucose reading.");
    return;
  }

    const dateObj = new Date(`${newReading.date}T${newReading.time}`);
    const timestamp = dateObj.getTime();

    db.ref(`users/${currentUser.uid}/mockLineData/0/data/${timestamp}`).set({
      x: timestamp, // Add this line to store the timestamp as the x value
      y: glucoseValue,
      note: "",
    });

    setNewReading({ y: "", date: "", time: "" });
  };

  const changePage = (newPage) => {
    if (newPage < 1 || newPage > Math.ceil(data.length / ITEMS_PER_PAGE)) {
      return;
    }
    setCurrentPage(newPage);
  };

  const displayedData = data.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const convertDataToCSV = (data) => {
    const header = ["Timestamp", "Glucose Reading", "Note"];
    const csvRows = [];
  
    csvRows.push(header.join(","));
  
    for (const [timestamp, { y, note }] of data) {
      const date = new Date(parseInt(timestamp)).toLocaleString();
      const row = [date, y, note || ""];
      csvRows.push(row.join(","));
    }
  
    return csvRows.join("\n");
  };


  const downloadCSV = () => {
    const csvContent = convertDataToCSV(data);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
  
    link.setAttribute("href", url);
    link.setAttribute("download", "glucose_readings.csv");
    link.style.visibility = "hidden";
  
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div>
      <Box
        sx={{
          marginBottom: 2,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <TextField
          sx={{ marginRight: 1 }}
          label="Glucose Reading"
          type="number"
          value={newReading.y}
          onChange={(e) => setNewReading({ ...newReading, y: e.target.value })}
        />
        <TextField
          sx={{ marginRight: 1 }}
          label="Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={newReading.date}
          onChange={(e) =>
            setNewReading({ ...newReading, date: e.target.value })
          }
        />
        <TextField
          sx={{ marginRight: 1 }}
          label="Time"
          type="time"
          InputLabelProps={{ shrink: true }}
          value={newReading.time}
          onChange={(e) =>
            setNewReading({ ...newReading, time: e.target.value })
          }
        />
        <Button variant="contained" color="primary" onClick={addReading}>
          Add Reading
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="user data table">
          <TableHead>
            <TableRow>
              <TableCell>Timestamp</TableCell>
              <TableCell>Glucose Reading</TableCell>
              <TableCell>Note</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
  {displayedData.map(([timestamp, { y, note }]) => (
    <TableRow key={timestamp}>
      <TableCell component="th" scope="row">
        {new Date(parseInt(timestamp)).toLocaleString()}
      </TableCell>
      <TableCell>
        <TextField
          type="number"
          defaultValue={y}
          onBlur={(e) => updateReading(timestamp, e.target.value)}
        />
      </TableCell>
      <TableCell>
        <TextField
          defaultValue={note || ""}
          onBlur={(e) => updateNote(timestamp, e.target.value)}
        />
      </TableCell>
      <TableCell>
        <IconButton
          edge="end"
          color="inherit"
          onClick={() => deleteReading(timestamp)}
        >
          <DeleteIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  ))}
</TableBody>
        </Table>
      </TableContainer>
  <Box sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
    <Button
      variant="contained"
      color="primary"
      onClick={() => changePage(currentPage - 1)}
    >
      Previous Page
    </Button>
    <Box
      sx={{
        marginLeft: 1,
        marginRight: 1,
        display: "flex",
        alignItems: "center",
      }}
    >
      Page {currentPage} of {Math.ceil(data.length / ITEMS_PER_PAGE)}
    </Box>
    <Button
      variant="contained"
      color="primary"
      onClick={() => changePage(currentPage + 1)}
    >
      Next Page
    </Button>
  </Box>

  <Box sx={{ display: "flex", justifyContent: "center", marginBottom: 2 }}>
  <Button variant="contained" color="primary" onClick={downloadCSV}>
    Download CSV
  </Button>
</Box>

    </div>
  );
};

export default UserData;
