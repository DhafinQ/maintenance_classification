import { useEffect, useState } from 'react';
import './sample-page.css';

// === Hook untuk fetch data ===
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
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [filterPrediction, setFilterPrediction] = useState('Semua');

  const machines = useFetchData('/machines/');
  const productions = useFetchData('/productions/');
  const logs = useFetchData('/logs/');

// === Fungsi filter (VERSI FINAL yang Lebih Kuat dan Bersih) ===
const filterData = (data, type) => {
  return data.filter((item) => {
    // 1. 🔍 PENCARIAN GLOBAL
    const matchSearch = Object.values(item).some((v) =>
      // Konversi ke string dengan aman dan bandingkan dengan pencarian lowercase
      String(v ?? '').toLowerCase().includes(search.toLowerCase())
    );

    // Data HARUS lolos pencarian (AND logic). Jika tidak, buang.
    if (!matchSearch) return false;

    // 2. ⚙️ FILTER PREDIKSI (Hanya untuk Logs dan jika bukan 'Semua')
    if (type === 'logs' && filterPrediction !== 'Semua') {
      const itemPredictionLower = String(item.prediction ?? '').toLowerCase();
      
      // Mengubah nilai filter state ("Rusak" atau "Tidak Rusak") ke lowercase
      const filterValueLower = filterPrediction.toLowerCase(); 

      // Data yang sudah lolos pencarian harus lolos filter prediksi.
      // Contoh: "tidak rusak" === "tidak rusak"
      return itemPredictionLower === filterValueLower;
    }

    // Jika filter Prediction adalah 'Semua' atau ini bukan tab Logs, 
    // data lolos karena sudah lolos 'matchSearch' di awal.
    return true;
  });
};

  const columns = {
    machines: ['id', 'machine_code', 'type'],
    productions: ['id', 'product_code', 'product_name'],
    logs: [
      'id',
      'machine_id',
      'product_id',
      'air_temperature',
      'process_temperature',
      'rotational_speed',
      'torque',
      'tool_wear',
      'prediction',
      'created_at',
    ],
  };

  const tableMap = [
    { label: 'Machines', rows: filterData(machines, 'machines'), cols: columns.machines },
    { label: 'Productions', rows: filterData(productions, 'productions'), cols: columns.productions },
    { label: 'Logs', rows: filterData(logs, 'logs'), cols: columns.logs },
  ];

  const activeTable = tableMap[tab];
  const totalRows = activeTable.rows.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const startIndex = (page - 1) * rowsPerPage;
  const paginatedRows = activeTable.rows.slice(startIndex, startIndex + rowsPerPage);

  const handleRowsChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  };

  return (
    <div className="main-card">
      <h2 className="title">Machine Maintenance Data</h2>

      {/* === Tabs === */}
      <div className="tabs">
        {tableMap.map((t, i) => (
          <button
            key={i}
            className={`tab-btn ${tab === i ? 'active' : ''}`}
            onClick={() => {
              setTab(i);
              setPage(1);
              setFilterPrediction('Semua');
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* === Search + Filter Bar (satu baris) === */}
      <div className="search-filter-bar">
        <input
          className="search-input"
          placeholder={`Search ${activeTable.label.toLowerCase()}...`}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

        {activeTable.label === 'Logs' && (
          <select
            className="filter-select"
            value={filterPrediction}
            onChange={(e) => {
              setFilterPrediction(e.target.value);
              setPage(1);
            }}
          >
            <option value="Semua">Semua</option>
            <option value="Rusak">Rusak</option>
            <option value="Tidak Rusak">Tidak Rusak</option>
          </select>
        )}
      </div>

      {/* === Table === */}
      <table className="data-table">
        <thead>
          <tr>
            {activeTable.cols.map((col) => (
              <th key={col}>{col.replace('_', ' ').toUpperCase()}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedRows.map((row) => (
            <tr key={row.id}>
              {activeTable.cols.map((col) => (
                <td key={col}>{row[col]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* === Pagination === */}
      <div className="pagination-container">
        <div className="rows-select">
          Rows per page:{' '}
          <select value={rowsPerPage} onChange={handleRowsChange}>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>

        <div className="page-info">
          {totalRows === 0 ? 0 : startIndex + 1}–
          {Math.min(startIndex + rowsPerPage, totalRows)} of {totalRows}
        </div>

        <div className="page-controls">
          <button disabled={page === 1} onClick={() => setPage(page - 1)}>
            ‹
          </button>
          <button
            disabled={page === totalPages || totalPages === 0}
            onClick={() => setPage(page + 1)}
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
}
