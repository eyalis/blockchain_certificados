// pages/index.js

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

import { connectWallet, emitirCertificado, verificarCertificado } from "./web3Utils";

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

const CONTRACT_ABI = [
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_id",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "_nombre",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_carrera",
                "type": "string"
            }
        ],
        "name": "emitirCertificado",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "certificados",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "nombre",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "carrera",
                "type": "string"
            },
            {
                "internalType": "bool",
                "name": "emitido",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "contadorCertificados",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_id",
                "type": "uint256"
            }
        ],
        "name": "verificarCertificado",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            },
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

const App = () => {
    const [web3, setWeb3] = useState(null);
    const [account, setAccount] = useState(null);
    const [contract, setContract] = useState(null);

    const [id, setId] = useState("");
    const [nombre, setNombre] = useState("");
    const [carrera, setCarrera] = useState("");
    const [mensaje, setMensaje] = useState("");

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

    const handleEmitirCertificado = async () => {
        if (contract) {
            try {

                const gasLimit = 21000; // Ajusta el límite de gas a tu valor deseado

                await contract.methods
                    .emitirCertificado(id, nombre, carrera)
                    .send({ from: account });

                setMensaje("Certificado emitido con éxito");
            } catch (error) {
                setMensaje("Error al emitir el certificado");
            }
        } else {
            setMensaje("Por favor, conecte su billetera");
        }
    };

    const handleVerificarCertificado = async () => {
        if (contract) {
            try {
                const certInfo = await contract.methods.verificarCertificado(id).call();
                setNombre(certInfo[0]);
                setCarrera(certInfo[1]);
                setMensaje(certInfo[2] ? "Certificado válido" : "Certificado no válido");
            } catch (error) {
                setMensaje("Error al verificar el certificado");
            }
        } else {
            setMensaje("Por favor, conecte su billetera");
        }
    };

    return (
        <StyledContainer maxWidth="sm">

            <Box mt={4}>
                <Typography variant="h4" align="center">
                    Certificados Universitarios
                </Typography>
            </Box>

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


            {!web3 && (
                <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<AccountBalanceWallet />}
                    onClick={handleConnectWallet}
                >
                    Conectar billetera
                </Button>
            )}

            {web3 && (
                <>
                    <Typography variant="subtitle1" align="center" mt={2}>
                        Cuenta conectada: {account}
                    </Typography>
                    <Box mt={4}>
                        <form>
                            <TextField
                                type="number"
                                label="ID"
                                value={id}
                                onChange={(e) => setId(e.target.value)}
                            />
                            <TextField
                                label="Nombre"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                            />
                            <TextField
                                label="Carrera"
                                value={carrera}
                                onChange={(e) => setCarrera(e.target.value)}
                            />
                            <Stack spacing={2} direction="row">
                                <Button variant="contained" color="primary" onClick={handleEmitirCertificado}>
                                    Emitir certificado
                                </Button>
                                <Button variant="contained" color="secondary" onClick={handleVerificarCertificado}>
                                    Verificar certificado
                                </Button>
                            </Stack>
                        </form>
                    </Box>
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