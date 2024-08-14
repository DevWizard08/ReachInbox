// src/components/CreateAccount.js
import React from 'react';
import { Container, Typography, TextField, Button } from '@mui/material';

function CreateAccount() {
    const handleCreateAccount = (e) => {
        e.preventDefault();
        console.log('Account creation submitted');
    };

    return (
        <Container maxWidth="sm" className="text-center">
            <Typography variant="h4" className="mb-4">Create Account</Typography>
            <form onSubmit={handleCreateAccount}>
                <TextField
                    label="Email"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    required
                />
                <TextField
                    label="Password"
                    type="password"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    required
                />
                <Button type="submit" variant="contained" color="primary" className="mt-4">
                    Create Account
                </Button>
            </form>
        </Container>
    );
}

export default CreateAccount;
