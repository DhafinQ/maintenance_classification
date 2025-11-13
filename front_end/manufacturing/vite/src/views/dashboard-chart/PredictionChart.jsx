import PropTypes from 'prop-types';

// ==============================|| PREDICTION CHART - TEXT ONLY (LARGE AND SPACIOUS) ||============================== //

export default function PredictionChart({ predictData }) {
    const predictions = predictData?.predictions || {};
    const summary = predictData?.summary || {};
    const modelNames = ['Logistic Regression', 'Random Forest', 'XGBoost'];

    // Fungsi untuk mendapatkan label teks (Rusak/Tidak Rusak)
    const getPredictionLabel = (modelName) => {
        const label = predictions[modelName]?.label;
        return label === '1' ? 'RUSAK (1)' : 'TIDAK RUSAK (0)'; 
    };

    // Fungsi untuk mendapatkan warna teks dan background netral
    const getStylesForLabel = (/* label */) => {
        // Warna teks netral gelap
        const color = '#212121'; 
        // Warna latar netral sangat terang (abu-abu muda)
        const backgroundColor = '#F5F5F5'; 
        
        return {
            color: color,
            backgroundColor: backgroundColor,
            fontWeight: 700, 
            padding: '8px 15px', // Padding lebih besar
            borderRadius: '6px', // Sudut sedikit membulat
            fontSize: '1.1rem', // Font size label lebih besar
            textAlign: 'center',
            minWidth: '150px' // Lebar minimum kotak label yang lebih besar
        };
    };
    
    // Logika Keputusan Akhir untuk Header
    const finalDecisionLabel = summary.final_decision === '1' ? 1 : 0;
    const title =
        finalDecisionLabel === 1 ? 'KEPUTUSAN AKHIR: RUSAK' : 'KEPUTUSAN AKHIR: TIDAK RUSAK';
    
    // Warna judul diubah menjadi netral gelap (bukan lagi merah/hijau)
    const titleColor = '#212121';

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}> 
            
            {/* Header Keputusan Akhir */}
            <h3 
                style={{ 
                    margin: 0, 
                    fontSize: '1.8rem', // Font size judul lebih besar
                    color: titleColor, // Menggunakan warna netral
                    fontWeight: 700,
                    textTransform: 'uppercase'
                }}
            >
                {title}
            </h3>
            <p style={{ margin: '5px 0 20px 0', fontSize: '1rem', color: '#757575' }}>
                Keputusan Label Model Individu (0 = Tidak Rusak, 1 = Rusak)
            </p>

            {/* Container Daftar Keputusan */}
            <div 
                style={{ 
                    flexGrow: 1, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '15px', // Jarak antar baris lebih lebar
                    paddingTop: '10px'
                }}
            > 
                {modelNames.map(name => {
                    const labelText = getPredictionLabel(name);
                    const labelStyles = getStylesForLabel(labelText);
                    
                    return (
                        <div 
                            key={name}
                            style={{
                                display: 'flex', // Menggunakan Flexbox untuk kontrol yang lebih mudah
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '12px 0', // Padding vertikal lebih besar
                                borderBottom: '1px solid #EEEEEE' 
                            }}
                        >
                            {/* Nama Model (Menggunakan proporsi lebar yang lebih baik) */}
                            <span 
                                style={{ 
                                    fontWeight: 600, // Lebih tebal
                                    color: '#212121', // Lebih gelap
                                    fontSize: '1.1rem', // Font size nama model lebih besar
                                    width: '40%', // Ambil 40% lebar kontainer
                                    paddingLeft: '10px'
                                }}
                            >
                                {name}
                            </span>
                            
                            {/* Keputusan Label (Ambil sisa lebar) */}
                            <div 
                                style={{ 
                                    display: 'flex', 
                                    justifyContent: 'flex-start',
                                    width: '60%', // Ambil 60% sisa lebar kontainer
                                }}
                            >
                                <span style={labelStyles}>
                                    {labelText}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

PredictionChart.propTypes = { predictData: PropTypes.object };