require("dotenv").config();
const API_URL = process.env.API_URL;

const PUBLIC_KEY = process.env.PUBLIC_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(API_URL);

const contract = require("../artifacts/contracts/MyNFT.sol/MyNFT.json");

console.log(JSON.stringify(contract.abi));

const contractAddress = "0xcb4C110C2652c403Fd0c3F4A20aE3a9FaEE6D5Be";
const nftContract = new web3.eth.Contract(contract.abi, contractAddress);

//create transaction
async function mintNFT(tokenURI) {
  const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, "latest"); //get latest nonce

  //the transaction
  const tx = {
    from: PUBLIC_KEY,
    to: contractAddress,
    nonce: nonce,
    gas: 500000,
    data: nftContract.methods.mintNFT(PUBLIC_KEY, tokenURI).encodeABI(),
  };

  const signPromise = web3.eth.accounts.signTransaction(tx, PRIVATE_KEY);
  signPromise
    .then((signedTx) => {
      web3.eth.sendSignedTransaction(
        signedTx.rawTransaction,
        function (err, hash) {
          if (!err) {
            console.log(
              "The hash of your transaction is: ",
              hash,
              "\nCheck Alchemy's Mempool to view the status of your transaction!"
            );
          } else {
            console.log(
              "Something went wrong when submitting your transaction:",
              err
            );
          }
        }
      );
    })
    .catch((err) => {
      console.log(" Promise failed:", err);
    });
}

mintNFT(
  "https://gateway.pinata.cloud/ipfs/Qmab7hc6sGEkqsdpLY2fYxqforvQr2LQEX8gUQfm5bVUjx?_gl=1*8s4u1q*_ga*MTM4MTMyMzg5Mi4xNjc1MzMyMjcx*_ga_5RMPXG14TE*MTY3NTMzMjI3MS4xLjEuMTY3NTMzMjM4Mi4yMi4wLjA."
);
