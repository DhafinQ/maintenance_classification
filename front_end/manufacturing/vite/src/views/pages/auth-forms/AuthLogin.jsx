import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// material-ui
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack'; 

// project imports (Asumsi ini adalah custom components Anda)
import AnimateButton from 'ui-component/extended/AnimateButton';
import CustomFormControl from 'ui-component/extended/Form/CustomFormControl'; 

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

// ===============================|| JWT - LOGIN ||=============================== //

export default function AuthLogin() {
    const navigate = useNavigate();
    
    // --- State untuk Form Login ---
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const [checked, setChecked] = useState(true);
    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    // --- Fungsi Submit Login ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const response = await fetch('http://localhost:8000/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || 'Login failed due to invalid credentials.');
            }

            // 1. SIMPAN Access Token
            localStorage.setItem('accessToken', data.access_token);
            
            // 2. LOGIKA PENYIMPANAN USERNAME YANG DIREVISI
            let displayName = email; // Mulai dengan email sebagai default

            // Asumsi: Backend FastAPI merespons dengan struktur seperti: { access_token: "...", user: { username: "rizkiodew", email: "..." } }
            if (data.user && data.user.username) {
                // Jika backend memberikan field username, gunakan itu
                displayName = data.user.username;
            } 
            
            // Simpan nama yang akan ditampilkan (bisa username atau email)
            localStorage.setItem('username', displayName);
            
            console.log("Login successful. Token and username saved:", displayName);

            // 3. NAVIGASI ke halaman utama
            navigate('/', { replace: true }); 

        } catch (err) {
            console.error('Login error:', err.message);
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
                {error && (
                    <Alert severity="error">{error}</Alert>
                )}
            </Stack>

            <CustomFormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel htmlFor="outlined-adornment-email-login">Email Address</InputLabel>
                <OutlinedInput 
                    id="outlined-adornment-email-login" 
                    type="email" 
                    value={email} 
                    name="email"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </CustomFormControl>

            <CustomFormControl fullWidth>
                <InputLabel htmlFor="outlined-adornment-password-login">Password</InputLabel>
                <OutlinedInput
                    id="outlined-adornment-password-login"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    name="password"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                edge="end"
                                size="large"
                            >
                                {showPassword ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                        </InputAdornment>
                    }
                    label="Password"
                />
            </CustomFormControl>

            <Grid container sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                <Grid item>
                    <FormControlLabel
                        control={<Checkbox checked={checked} onChange={(event) => setChecked(event.target.checked)} name="checked" color="primary" />}
                        label="Keep me logged in"
                    />
                </Grid>
                <Grid item>
                    <Typography variant="subtitle1" component={Link} to="#!" sx={{ textDecoration: 'none', color: 'secondary.main' }}>
                        Forgot Password?
                    </Typography>
                </Grid>
            </Grid>
            <Box sx={{ mt: 2 }}>
                <AnimateButton>
                    <Button 
                        color="secondary" 
                        fullWidth 
                        size="large" 
                        type="submit" 
                        variant="contained"
                        disabled={loading}
                    >
                        {loading ? 'Signing In...' : 'Sign In'}
                    </Button>
                </AnimateButton>
            </Box>
        </form>
    );
}