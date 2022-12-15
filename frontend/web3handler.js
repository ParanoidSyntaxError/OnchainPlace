const contractAddress = "0xBCB77f974b9956f58380870c9e35a443507FE655";

const contractAbi = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
		{
			"indexed": true,
			"internalType": "address",
			"name": "owner",
			"type": "address"
		},
		{
			"indexed": true,
			"internalType": "address",
			"name": "approved",
			"type": "address"
		},
		{
			"indexed": true,
			"internalType": "uint256",
			"name": "tokenId",
			"type": "uint256"
		}
		],
		"name": "Approval",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
		{
			"indexed": true,
			"internalType": "address",
			"name": "owner",
			"type": "address"
		},
		{
			"indexed": true,
			"internalType": "address",
			"name": "operator",
			"type": "address"
		},
		{
			"indexed": false,
			"internalType": "bool",
			"name": "approved",
			"type": "bool"
		}
		],
		"name": "ApprovalForAll",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
		{
			"indexed": true,
			"internalType": "address",
			"name": "owner",
			"type": "address"
		},
		{
			"indexed": false,
			"internalType": "uint256",
			"name": "id",
			"type": "uint256"
		},
		{
			"indexed": false,
			"internalType": "uint256",
			"name": "totalChanges",
			"type": "uint256"
		}
		],
		"name": "Mint",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
		{
			"indexed": true,
			"internalType": "address",
			"name": "author",
			"type": "address"
		},
		{
			"indexed": false,
			"internalType": "uint256",
			"name": "position",
			"type": "uint256"
		},
		{
			"indexed": false,
			"internalType": "uint256",
			"name": "color",
			"type": "uint256"
		},
		{
			"indexed": false,
			"internalType": "uint256",
			"name": "totalChanges",
			"type": "uint256"
		}
		],
		"name": "PixelSet",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
		{
			"indexed": true,
			"internalType": "address",
			"name": "from",
			"type": "address"
		},
		{
			"indexed": true,
			"internalType": "address",
			"name": "to",
			"type": "address"
		},
		{
			"indexed": true,
			"internalType": "uint256",
			"name": "tokenId",
			"type": "uint256"
		}
		],
		"name": "Transfer",
		"type": "event"
	},
	{
		"inputs": [
		{
			"internalType": "address",
			"name": "to",
			"type": "address"
		},
		{
			"internalType": "uint256",
			"name": "tokenId",
			"type": "uint256"
		}
		],
		"name": "approve",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
		{
			"internalType": "address",
			"name": "owner",
			"type": "address"
		}
		],
		"name": "balanceOf",
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
			"name": "tokenId",
			"type": "uint256"
		}
		],
		"name": "getApproved",
		"outputs": [
		{
			"internalType": "address",
			"name": "",
			"type": "address"
		}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
		{
			"internalType": "address",
			"name": "owner",
			"type": "address"
		},
		{
			"internalType": "address",
			"name": "operator",
			"type": "address"
		}
		],
		"name": "isApprovedForAll",
		"outputs": [
		{
			"internalType": "bool",
			"name": "",
			"type": "bool"
		}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
		{
			"internalType": "uint256",
			"name": "offset",
			"type": "uint256"
		}
		],
		"name": "mint",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "mintFee",
		"outputs": [
		{
			"internalType": "uint256",
			"name": "",
			"type": "uint256"
		}
		],
		"stateMutability": "pure",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "name",
		"outputs": [
		{
			"internalType": "string",
			"name": "",
			"type": "string"
		}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
		{
			"internalType": "uint256",
			"name": "tokenId",
			"type": "uint256"
		}
		],
		"name": "ownerOf",
		"outputs": [
		{
			"internalType": "address",
			"name": "",
			"type": "address"
		}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
		{
			"internalType": "address",
			"name": "from",
			"type": "address"
		},
		{
			"internalType": "address",
			"name": "to",
			"type": "address"
		},
		{
			"internalType": "uint256",
			"name": "tokenId",
			"type": "uint256"
		}
		],
		"name": "safeTransferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
		{
			"internalType": "address",
			"name": "from",
			"type": "address"
		},
		{
			"internalType": "address",
			"name": "to",
			"type": "address"
		},
		{
			"internalType": "uint256",
			"name": "tokenId",
			"type": "uint256"
		},
		{
			"internalType": "bytes",
			"name": "data",
			"type": "bytes"
		}
		],
		"name": "safeTransferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
		{
			"internalType": "address",
			"name": "operator",
			"type": "address"
		},
		{
			"internalType": "bool",
			"name": "approved",
			"type": "bool"
		}
		],
		"name": "setApprovalForAll",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
		{
			"internalType": "uint256",
			"name": "position",
			"type": "uint256"
		},
		{
			"internalType": "uint256",
			"name": "color",
			"type": "uint256"
		}
		],
		"name": "setPixel",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
		{
			"internalType": "bytes4",
			"name": "interfaceId",
			"type": "bytes4"
		}
		],
		"name": "supportsInterface",
		"outputs": [
		{
			"internalType": "bool",
			"name": "",
			"type": "bool"
		}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "symbol",
		"outputs": [
		{
			"internalType": "string",
			"name": "",
			"type": "string"
		}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
		{
			"internalType": "uint256",
			"name": "id",
			"type": "uint256"
		}
		],
		"name": "tokenURI",
		"outputs": [
		{
			"internalType": "string",
			"name": "",
			"type": "string"
		}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalChanges",
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
		"inputs": [],
		"name": "totalSupply",
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
			"internalType": "address",
			"name": "from",
			"type": "address"
		},
		{
			"internalType": "address",
			"name": "to",
			"type": "address"
		},
		{
			"internalType": "uint256",
			"name": "tokenId",
			"type": "uint256"
		}
		],
		"name": "transferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"stateMutability": "payable",
		"type": "receive"
	}
];

const connectButton = document.getElementById("btn-connect");
connectButton.onclick = connect;

const Web3Modal = window.Web3Modal.default;
const WalletConnectProvider = window.WalletConnectProvider.default;
const Fortmatic = window.Fortmatic;
const evmChains = window.evmChains;

let web3Modal;

var provider;
var signer;
var address;
var contract;

var onConnected = function(){};

initialize();

function initialize() {
	const providerOptions = {
		walletconnect: {
			package: WalletConnectProvider
		},
		fortmatic: {
			package: Fortmatic
		}
	};

	web3Modal = new Web3Modal({
		cacheProvider: false,
		providerOptions,
		disableInjectedProvider: false,
	});
}

async function connect() {
	try {
		provider = await web3Modal.connect();
		
		provider.on("accountsChanged", (accounts) => {
			getSigner();
			displayConnection();
		});
	} catch(e) {
		errorMessage(e);
	}

	getSigner();
	displayConnection();
}

async function getSigner() {
	signer = undefined;
	let web3 = new ethers.providers.Web3Provider(provider);
	address = provider.selectedAddress;
	signer = web3.getSigner();
	contract = new ethers.Contract(contractAddress, contractAbi, signer);
	onConnected();
}

async function displayConnection() {
    if(signer != undefined) {
		connectButton.innerHTML = address.toString().slice(0, 5) + "..." + address.toString().slice(38, 42);
		connectButton.style.backgroundColor = "darkblue";
		connectButton.disabled = true;
		
	} else {
		connectButton.innerHTML = "Connect";
		connectButton.style.backgroundColor = "blue";
		connectButton.disabled = false;
	}
}

function checkConnection() {
	if(signer == undefined) {
		errorMessage(ErrorCode.NotConnected);
		return false;
	}
	return true;
}

async function mint(x, y) {  
	let connected = checkConnection();
	if(connected == false) {
		return;
	}

	try {
		var position = x + (y * 1000);
		var mintFee = await contract.mintFee();
		await contract.mint(position, { value: mintFee.toString() });
	} catch {
        errorMessage(ErrorCode.InvalidMint);
	}
}

async function setPixel(x, y, color) {
	let connected = checkConnection();
	if(connected == false) {
		return;
	}

    try {
		var position = x + (y * 1000);
		await contract.setPixel(position, color);
    } catch {
        errorMessage(ErrorCode.InvalidSetPixel);
    }
}