// material-ui
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

export default function Footer() {
  return (
    <Stack 
      direction="row" 
      sx={{ 
        alignItems: 'center', 
        justifyContent: 'flex-start', // Ubah agar rata kiri karena item kanan dihapus
        pt: 3, 
        mt: 'auto' 
      }}
    >
      <Typography variant="caption">
        &copy; All rights reserved Manufacturing Predictions
      </Typography>
      
      {/* Tautan ke CodedThemes, Twitter, dan Discord telah dihapus */}
      
    </Stack>
  );
}