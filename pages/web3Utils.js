// Import Web3 library for interacting with Ethereum blockchain
import Web3 from "web3";
// Import the contract ABI (Application Binary Interface) from a JSON file
import CONTRACT_ABI from "./contractAbi.json";

// Define the contract address for the smart contract
const CONTRACT_ADDRESS = "0x5feD74B8d1fF747f937469e3a712bdB5D046D37F";

// Function to connect the user's wallet
export const connectWallet = async () => {
    // Check if window.ethereum (MetaMask) is available
    if (window.ethereum) {
        // Create a new Web3 instance with the injected provider
        const web3Instance = new Web3(window.ethereum);
        // Request user's account access
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        // Get the first account in the user's wallet
        const account = accounts[0];
        // Create a contract instance with the ABI and contract address
        const contractInstance = new web3Instance.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
        // Return the created Web3 instance, user's account and contract instance
        return { web3Instance, account, contractInstance };
    } else {
        // Throw an error if MetaMask is not installed
        throw new Error("Please install MetaMask to use this application");
    }
};

// Function to emit a certificate using the smart contract
export const emitirCertificado = async (contract, id, nombre, carrera, account) => {
    // Set the gas limit for the transaction
    const gasLimit = 21000;
    // Call the emitirCertificado function from the smart contract and send the transaction
    await contract.methods.emitirCertificado(id, nombre, carrera).send({ from: account });
};

// Function to verify a certificate using the smart contract
export const verificarCertificado = async (contract, id) => {
    // Call the verificarCertificado function from the smart contract and get the certificate information
    const certInfo = await contract.methods.verificarCertificado(id).call();
    // Return the fetched certificate information
    return certInfo;
};
