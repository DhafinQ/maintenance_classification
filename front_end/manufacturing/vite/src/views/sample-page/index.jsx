// src/views/sample-page/index.jsx
import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, TextField, Tabs, Tab } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';

// === Fungsi reusable untuk fetch data ===
const useFetchData = (endpoint) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    fetch(`http://localhost:8000${endpoint}`)
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.error(`Error fetching ${endpoint}:`, err));
  }, [endpoint]);
  return data;
};

export default function SamplePage() {
  const [tab, setTab] = useState(0);
  const [search, setSearch] = useState('');

  // === Ambil data dari API ===
  const machines = useFetchData('/machines/');
  const productions = useFetchData('/productions/');
  const logs = useFetchData('/logs/');

  // === Filter pencarian ===
  const filterData = (data) =>
    data.filter((item) =>
      Object.values(item).some((v) =>
        String(v).toLowerCase().includes(search.toLowerCase())
      )
    );

  // === Definisi kolom tiap tabel ===
  const columns = {
    machines: [
      { field: 'id', headerName: 'ID', width: 80 },
      { field: 'machine_code', headerName: 'Machine Code', width: 180 },
      { field: 'type', headerName: 'Type', width: 130 }
    ],
    productions: [
      { field: 'id', headerName: 'ID', width: 80 },
      { field: 'product_code', headerName: 'Product Code', width: 180 },
      { field: 'product_name', headerName: 'Product Name', width: 250 }
    ],
    logs: [
      { field: 'id', headerName: 'ID', width: 70 },
      { field: 'machine_id', headerName: 'Machine ID', width: 110 },
      { field: 'product_id', headerName: 'Product ID', width: 110 },
      { field: 'air_temperature', headerName: 'Air Temp (K)', width: 130 },
      { field: 'process_temperature', headerName: 'Process Temp (K)', width: 160 },
      { field: 'rotational_speed', headerName: 'RPM', width: 120 },
      { field: 'torque', headerName: 'Torque (Nm)', width: 120 },
      { field: 'tool_wear', headerName: 'Tool Wear (min)', width: 150 },
      { field: 'prediction', headerName: 'Prediction', width: 150 },
      { field: 'created_at', headerName: 'Created At', width: 180 }
    ]
  };

  // === Data tabel yang sedang aktif ===
  const tableMap = [
    { label: 'Machines', rows: filterData(machines), cols: columns.machines },
    { label: 'Productions', rows: filterData(productions), cols: columns.productions },
    { label: 'Logs', rows: filterData(logs), cols: columns.logs }
  ];

  const activeTable = tableMap[tab];

  return (
    <MainCard title="Machine Maintenance Data">
      {/* === Tab Navigation === */}
      <Tabs
        value={tab}
        onChange={(e, newValue) => setTab(newValue)}
        sx={{
          mb: 2,
          '& .MuiTab-root': { textTransform: 'none', fontWeight: 600 },
          '& .Mui-selected': { color: '#673ab7' }
        }}
      >
        {tableMap.map((t, i) => (
          <Tab key={i} label={t.label} />
        ))}
      </Tabs>

      {/* === Pencarian === */}
      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder={`Search ${activeTable.label.toLowerCase()}...`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Box>

      {/* === Tabel Data === */}
      <div style={{ height: 520, width: '100%' }}>
        <DataGrid
          getRowId={(row) => row.id}
          rows={activeTable.rows}
          columns={activeTable.cols}
          pageSize={10}
          rowsPerPageOptions={[10]}
          disableSelectionOnClick
          sx={{
            borderRadius: 2,
            boxShadow: 3,
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#f5f5f5',
              fontWeight: 'bold'
            }
          }}
        />
      </div>
    </MainCard>
  );
}
