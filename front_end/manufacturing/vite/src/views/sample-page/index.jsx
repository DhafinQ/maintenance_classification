import { useEffect, useState } from 'react';
import './sample-page.css';

// === Hook untuk fetch data dengan token ===
const useFetchData = (endpoint) => {
  const [data, setData] = useState([]);

  const fetchData = () => {
    const accessToken = localStorage.getItem('accessToken');
    const headers = {};
    if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;

    fetch(`http://localhost:8000${endpoint}`, { headers })
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.error(`Error fetching ${endpoint}:`, err));
  };

  // Menambahkan fetchData ke dependencies untuk initial fetch
  useEffect(() => {
    fetchData();
  }, [endpoint]); 

  return [data, fetchData];
};

export default function SamplePage() {
  const [tab, setTab] = useState(0);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [filterPrediction, setFilterPrediction] = useState('Semua');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // add | edit
  const [formData, setFormData] = useState({});
  const [selectedId, setSelectedId] = useState(null);

  const [machines, refetchMachines] = useFetchData('/machines/');
  const [productions, refetchProductions] = useFetchData('/productions/');
  const [logs, refetchLogs] = useFetchData('/logs/');

  const tableMap = [
    {
      label: 'Machines',
      endpoint: '/machines/',
      rows: machines,
      cols: ['id', 'machine_code', 'type'],
    },
    {
      label: 'Productions',
      endpoint: '/productions/',
      rows: productions,
      cols: ['id', 'product_code', 'product_name'],
    },
    {
      label: 'Logs',
      endpoint: '/logs/',
      rows: logs,
      cols: [
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
    },
  ];

  const activeTable = tableMap[tab];
  const refetchFn =
    tab === 0 ? refetchMachines : tab === 1 ? refetchProductions : refetchLogs;

  // === Filter Data ===
  const filteredRows = activeTable.rows.filter((item) => {
    const matchSearch = Object.values(item).some((v) =>
      String(v ?? '').toLowerCase().includes(search.toLowerCase())
    );
    if (!matchSearch) return false;

    if (activeTable.label === 'Logs' && filterPrediction !== 'Semua') {
      return (
        String(item.prediction ?? '').toLowerCase() ===
        filterPrediction.toLowerCase()
      );
    }
    return true;
  });

  const totalRows = filteredRows.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const startIndex = (page - 1) * rowsPerPage;
  const paginatedRows = filteredRows.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  // === CRUD Handler ===
  // Disesuaikan agar formData inisial hanya berisi kolom yang akan diedit/ditambahkan
  const handleOpenModal = (mode, row = {}) => {
    const initialData = mode === 'add' 
      ? activeTable.cols.filter(col => col !== 'id' && col !== 'created_at').reduce((acc, col) => ({ ...acc, [col]: '' }), {}) 
      : row;
      
    setModalMode(mode);
    setFormData(initialData); 
    setSelectedId(row.id || null);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setFormData({});
    setSelectedId(null);
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Disesuaikan untuk memetakan 'product_code' ke 'code' untuk FastAPI
  const handleSubmit = async () => {
    const accessToken = localStorage.getItem('accessToken');
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    };
    const url = `http://localhost:8000${activeTable.endpoint}${
      modalMode === 'edit' ? selectedId + '/' : ''
    }`;

    const method = modalMode === 'edit' ? 'PUT' : 'POST';

    let bodyData = formData;

    // KASUS KHUSUS: PRODUCTION. Memetakan product_code ke code sesuai ProductCreate model di FastAPI
    if (activeTable.label === 'Productions') {
        const { product_code, product_name, ...otherData } = formData;
        bodyData = {
            ...otherData,
            code: product_code, // Ini adalah perbaikan utama untuk Error 422
            product_name: product_name,
        };
        // Hapus field yang tidak diperlukan FastAPI saat POST/PUT
        delete bodyData.id;
        delete bodyData.created_at; 
    } else {
        // Untuk tabel lain, hapus id/created_at saat mode 'add'
        if (modalMode === 'add') {
             delete bodyData.id;
             delete bodyData.created_at;
        }
    }

    try {
      const res = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(bodyData),
      });
      
      if (!res.ok) {
          // Tangani response error (termasuk 422)
          const errorBody = await res.json();
          console.error('Server Validation Error:', errorBody);
          throw new Error(`Status ${res.status}: ${JSON.stringify(errorBody.detail)}`);
      }
      
      handleCloseModal();
      refetchFn();
    } catch (error) {
      console.error('Error submitting form:', error);
      alert(`Gagal menyimpan data: ${error.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus data ini?')) return;

    const accessToken = localStorage.getItem('accessToken');
    const headers = { Authorization: `Bearer ${accessToken}` };

    try {
      await fetch(`http://localhost:8000${activeTable.endpoint}${id}/`, {
        method: 'DELETE',
        headers,
      });
      refetchFn();
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  };

  const handleRowsChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  };

  // === UI ===
  return (
    <div className="main-card">
      <h2 className="title">Machine Maintenance Data</h2>

      {/* Tabs */}
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

      {/* Search + Filter + Add Button */}
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

        <button
          className="add-btn"
          onClick={() => handleOpenModal('add')}
        >
          + Tambah {activeTable.label}
        </button>
      </div>

      {/* Table */}
      <table className="data-table">
        <thead>
          <tr>
            {activeTable.cols.map((col) => (
              <th key={col}>{col.replace('_', ' ').toUpperCase()}</th>
            ))}
            <th>ACTION</th>
          </tr>
        </thead>
        <tbody>
          {paginatedRows.map((row) => (
            <tr key={row.id}>
              {activeTable.cols.map((col) => (
                <td key={col}>{row[col]}</td>
              ))}
              <td className="action-cell">
                <button
                  className="edit-btn"
                  onClick={() => handleOpenModal('edit', row)}
                >
                  ✏️
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(row.id)}
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
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
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
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

      {/* Modal */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3>
              {modalMode === 'add'
                ? `Tambah ${activeTable.label}`
                : `Edit ${activeTable.label}`}
            </h3>
            <div className="modal-form">
              {activeTable.cols
                .filter((col) => col !== 'id')
                .map((col) => (
                  <div key={col} className="form-group">
                    <label>{col.replace('_', ' ').toUpperCase()}</label>
                    <input
                      name={col}
                      value={formData[col] || ''}
                      onChange={handleFormChange}
                      placeholder={col}
                    />
                  </div>
                ))}
            </div>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={handleCloseModal}>
                Batal
              </button>
              <button className="save-btn" onClick={handleSubmit}>
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}