import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material';
import { db } from "./config/fire";
import useAuth from "./useAuth";
import { token } from "./theme";


const UserData = () => {
  const [data, setData] = useState([]);
  const { currentUser } = useAuth();
  const theme = useTheme();
  const colors = token(theme.palette.mode);

  useEffect(() => {
    if (currentUser) {
      const dbRef = db.ref(`users/${currentUser.uid}/MockBarData`);
      dbRef.on('value', (snapshot) => {
        const lineData = snapshot.val();
        if (lineData) {
          const dataArray = Object.entries(lineData).map(([key, value]) => {
            return { key, ...value };
          });
          setData(dataArray);
        }
      });
  
      return () => dbRef.off();
    }
  }, [currentUser]);

  const handleDownload = () => {
    const csvData = data.map((item) => `${item.DAY},${item.HEALTHY},${item.HIGH},${item.LOW}`).join('\n');
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'GlucoseReadingsTable.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCellClick = (key, field, value) => {
    const dbRef = db.ref(`users/${currentUser.uid}/MockBarData/${key}/${field}`);
    dbRef.set(value);
  };

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Day</th>
            <th>Healthy</th>
            <th>High</th>
            <th>Low</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.key}>
              <td onClick={() => handleCellClick(item.key, 'DAY', prompt('Enter a new day', item.DAY))}>{item.DAY}</td>
              <td onClick={() => handleCellClick(item.key, 'HEALTHY', prompt('Enter a new healthy value', item.HEALTHY))}>{item.HEALTHY}</td>
              <td onClick={() => handleCellClick(item.key, 'HIGH', prompt('Enter a new high value', item.HIGH))}>{item.HIGH}</td>
              <td onClick={() => handleCellClick(item.key, 'LOW', prompt('Enter a new low value', item.LOW))}>{item.LOW}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleDownload}>Download as CSV</button>
    </div>
  );
};

UserData.propTypes = {
  currentUser: PropTypes.object,
};

export default UserData;
