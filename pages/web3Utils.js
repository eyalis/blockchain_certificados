import Web3 from "web3";
import CONTRACT_ABI from "./contractAbi.json";

const CONTRACT_ADDRESS = "0x5feD74B8d1fF747f937469e3a712bdB5D046D37F";

export const connectWallet = async () => {
    if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        const account = accounts[0];
        const contractInstance = new web3Instance.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
        return { web3Instance, account, contractInstance };
    } else {
        throw new Error("Por favor, instale MetaMask para usar esta aplicación");
    }
};

export const emitirCertificado = async (contract, id, nombre, carrera, account) => {
    const gasLimit = 21000;
    await contract.methods.emitirCertificado(id, nombre, carrera).send({ from: account });
};

export const verificarCertificado = async (contract, id) => {
    const certInfo = await contract.methods.verificarCertificado(id).call();
    return certInfo;
};
