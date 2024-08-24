import React from 'react';
import { Snackbar, Alert } from '@mui/material';

const FlashMessage = ({ message, type, onClose }) => {
    return (
        <Snackbar
            open={!!message}
            autoHideDuration={6000}
            onClose={onClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }} // Position at top center
            sx={{
                position: 'fixed', // Fixed position to stay at the top
                top: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 1300, // Ensure it's above other content
            }}
        >
            <Alert onClose={onClose} severity={type} sx={{ width: '100%' }}>
                {message}
            </Alert>
        </Snackbar>
    );
};

export default FlashMessage;
