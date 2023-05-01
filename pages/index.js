// Import required dependencies
import React, { useState } from "react";
import {
    Container,
    TextField,
    Button,
    Box,
    Typography,
    Alert,
    Stack,
} from "@mui/material";
import { styled } from "@mui/system";
import { AccountBalanceWallet } from "@mui/icons-material";
import QRCode from "qrcode.react";
import Link from "@mui/material/Link";

// Import utility functions for interacting with the smart contract
import { connectWallet, emitirCertificado, verificarCertificado } from "./web3Utils";

// Apply custom styles to the container
const StyledContainer = styled(Container)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    "& .MuiTextField-root": {
        marginBottom: theme.spacing(2),
    },
    "& .MuiButton-root": {
        marginBottom: theme.spacing(2),
    },
}));

// Main App component
const App = () => {
    // Declare state variables
    const [web3, setWeb3] = useState(null);
    const [account, setAccount] = useState(null);
    const [contract, setContract] = useState(null);

    const [id, setId] = useState("");
    const [nombre, setNombre] = useState("");
    const [carrera, setCarrera] = useState("");
    const [mensaje, setMensaje] = useState("");

    // Function to handle wallet connection
    const handleConnectWallet = async () => {
        try {
            const { web3Instance, account, contractInstance } = await connectWallet();
            setWeb3(web3Instance);
            setAccount(account);
            setContract(contractInstance);
        } catch (error) {
            alert(error.message);
        }
    };

    // Function to handle certificate issuance
    const handleEmitirCertificado = async () => {
        if (contract) {
            try {
                const gasLimit = 21000; // Set the desired gas limit for the transaction

                // Call the smart contract function to issue a certificate
                await contract.methods
                    .emitirCertificado(id, nombre, carrera)
                    .send({ from: account });

                setMensaje("Certificate issued successfully");
            } catch (error) {
                setMensaje("Error issuing the certificate");
            }
        } else {
            setMensaje("Please, connect your wallet");
        }
    };

    // Function to handle certificate verification
    const handleVerificarCertificado = async () => {
        if (contract) {
            try {
                // Call the smart contract function to verify a certificate
                const certInfo = await contract.methods.verificarCertificado(id).call();
                setNombre(certInfo[0]);
                setCarrera(certInfo[1]);
                setMensaje(certInfo[2] ? "Valid certificate" : "Invalid certificate");
            } catch (error) {
                setMensaje("Error verifying the certificate");
            }
        } else {
            setMensaje("Please, connect your wallet");
        }
    };

    // Render the main component
    return (
        <StyledContainer maxWidth="sm">
            {/* Display the title */}
            <Box mt={4}>
                <Typography variant="h4" align="center">
                    University Certificates
                </Typography>
            </Box>

            {/* Display the QR code */}
            <Box mt={4}>
                <Typography
                    variant="h6"
                    align="center"
                    sx={{ fontSize: "1rem", paddingBottom: "1rem" }}
                >
                </Typography>
                <Box display="flex" justifyContent="center" alignItems="center" mb={4}>
                    <Link href="https://testnet.bscscan.com/address/0x5fed74b8d1ff747f937469e3a712bdb5d046d37f">
                        <QRCode
                            value="https://testnet.bscscan.com/address/0x5fed74b8d1ff747f937469e3a712bdb5d046d37f"
                        />
                    </Link>
                </Box>
            </Box>

            {/* Display "Connect Wallet" button if wallet is not connected */}
            {!web3 && (
                <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<AccountBalanceWallet />}
                    onClick={handleConnectWallet}
                >
                    Connect wallet
                </Button>
            )}

            {/* Display form and actions if wallet is connected */}
            {web3 && (
                <>
                    <Typography variant="subtitle1" align="center" mt={2}>
                        Connected account: {account}
                    </Typography>
                    <Box mt={4}>
                        <form>
                            {/* Certificate ID input */}
                            <TextField
                                type="number"
                                label="ID"
                                value={id}
                                onChange={(e) => setId(e.target.value)}
                            />
                            {/* Student's name input */}
                            <TextField
                                label="Name"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                            />
                            {/* Degree input */}
                            <TextField
                                label="Degree"
                                value={carrera}
                                onChange={(e) => setCarrera(e.target.value)}
                            />
                            {/* Action buttons */}
                            <Stack spacing={2} direction="row">
                                <Button variant="contained" color="primary" onClick={handleEmitirCertificado}>
                                    Issue certificate
                                </Button>
                                <Button variant="contained" color="secondary" onClick={handleVerificarCertificado}>
                                    Verify certificate
                                </Button>
                            </Stack>
                        </form>
                    </Box>
                    {/* Display message, if any */}
                    {mensaje && (
                        <Alert severity="info" sx={{ mb: 2 }}>
                            {mensaje}
                        </Alert>
                    )}
                </>
            )}
        </StyledContainer>
    );
};

export default App;