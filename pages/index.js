// pages/index.js

import React, { useState } from "react";
import Web3 from "web3";
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
const CONTRACT_ADDRESS = "0xD043Ff0BAc82081fFCD3D73885c869d26a7898bc"; //acá poner la dirección de ethereum

const App = () => {
    const [web3, setWeb3] = useState(null);
    const [account, setAccount] = useState(null);
    const [contract, setContract] = useState(null);

    const [id, setId] = useState("");
    const [nombre, setNombre] = useState("");
    const [carrera, setCarrera] = useState("");
    const [mensaje, setMensaje] = useState("");

    const connectWallet = async () => {
        if (window.ethereum) {
            const web3Instance = new Web3(window.ethereum);
            setWeb3(web3Instance);

            const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
            setAccount(accounts[0]);

            const contractInstance = new web3Instance.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
            setContract(contractInstance);
        } else {
            alert("Por favor, instale MetaMask para usar esta aplicación");
        }
    };

    const emitirCertificado = async () => {
        if (contract) {
            try {
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

    const verificarCertificado = async () => {
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
                    Registro de Certificados Universitarios
                </Typography>
            </Box>

            {!web3 && (
                <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<AccountBalanceWallet />}
                    onClick={connectWallet}
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
                                <Button variant="contained" color="primary" onClick={emitirCertificado}>
                                    Emitir certificado
                                </Button>
                                <Button variant="contained" color="secondary" onClick={verificarCertificado}>
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