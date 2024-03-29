import React, { useEffect, useState } from "react";
import Web3Modal from "web3modal";
import axios from "axios";

import { MarketAddress, MarketAddressABI } from "./constants";

export const NFTContext = React.createContext();
// const { ethers } = require('hardhat');
const ethers = require("ethers");

const createWeb3ModalConnection = async () => {
  const web3Modal = new Web3Modal();
  const connection = await web3Modal.connect();
  return new ethers.providers.Web3Provider(connection);
};

const fetchContract = (signerOrProvider) =>
  new ethers.Contract(MarketAddress, MarketAddressABI, signerOrProvider);

export const NFTProvider = ({ children }) => {
  const nftCurrency = "ETH";
  const [currentAccount, setCurrentAccount] = useState("");
  const [isLoadingNFT, setIsLoadingNFT] = useState(false);

  const fetchNFTs = async () => {
    setIsLoadingNFT(false);

    const provider = new ethers.providers.JsonRpcProvider(
      "https://eth-goerli.g.alchemy.com/v2/JDppX-XRYTd0-MbJ70fcwUjbafYOksyI"
    );
    const contract = fetchContract(provider);
    const data = await contract.fetchMarketItems();
    const items = await Promise.all(
      data.map(async ({ tokenId, seller, owner, price: unformattedPrice }) => {
        const tokenURI = await contract.tokenURI(tokenId);
        if (
          !tokenURI.includes("https://ipfs.infura.io:5001") &&
          !tokenURI.includes("https:/ipfs.io") &&
          !tokenURI.includes(
            "https://ipfs.io/ipfs/QmZ9b88tpS6dxzFfDUaJeUVVZF8mq4gqDowKpS3Gpw4UgA"
          )
        ) {
          const {
            data: { image, name, description },
          } = await axios.get(tokenURI);
          const price = ethers.utils.formatUnits(
            unformattedPrice.toString(),
            "ether"
          );
          return {
            price,
            tokenId: tokenId.toNumber(),
            id: tokenId.toNumber(),
            seller,
            owner,
            image,
            name,
            description,
            tokenURI,
          };
        }
      })
    );
    return items;
  };

  const handleError = (error, customErrorMessage) => {
    const message = error.message || error.toString();
    if (message.includes("user rejected transaction")) {
      alert("Looks like you rejected to sign the transaction!");
    } else if (message.includes("insufficient funds")) {
      alert(
        "Insufficient funds in your wallet. Please add more funds and try again"
      );
    } else if (message.includes("nonce too low")) {
      alert(
        "Transaction nonce too low. Please wait for pending transactions to complete and try again"
      );
    } else if (message.includes("gas price too low")) {
      alert("Gas price too low. Please increase the gas price and try again");
    } else if (message.includes("gas limit too low")) {
      alert("Gas limit too low. Please increase the gas limit and try again");
    } else if (message.includes("execution reverted")) {
      alert("Transaction failed. Please check your input values and try again");
    } else {
      console.error(error);
      alert(customErrorMessage);
    }
  };

  const fetchMyNFTsOrCreatedNFTs = async (type) => {
    try {
      setIsLoadingNFT(false);

      const provider = await createWeb3ModalConnection();
      const signer = provider.getSigner();

      const contract = await fetchContract(signer);
      const data =
        type === "fetchItemsListed"
          ? await contract.fetchItemsListed()
          : await contract.fetchMyNFTs();

      const items = await Promise.all(
        data.map(
          async ({ tokenId, seller, owner, price: unformattedPrice }) => {
            const tokenURI = await contract.tokenURI(tokenId);
            const {
              data: { image, name, description },
            } = await axios.get(tokenURI);
            const price = ethers.utils.formatUnits(
              unformattedPrice.toString(),
              "ether"
            );

            return {
              price,
              tokenId: tokenId.toNumber(),
              seller,
              owner,
              image,
              name,
              description,
              tokenURI,
            };
          }
        )
      );

      return items;
    } catch (error) {
      handleError(
        error,
        "An error occurred while fetching NFTs. Please try again."
      );
    }
  };

  const createSale = async (url, formInputPrice, isReselling, id) => {
    try {
      const provider = await createWeb3ModalConnection();
      const signer = provider.getSigner();
      const contract = await fetchContract(signer);

      const price = ethers.utils.parseUnits(formInputPrice, "ether");
      const listingPrice = await contract.getListingPrice();

      let transaction;
      if (!isReselling) {
        transaction = await contract.createToken(url, price, {
          value: listingPrice.toString(),
        });
      } else {
        transaction = await contract.resellToken(id, price, {
          value: listingPrice.toString(),
        });
      }

      setIsLoadingNFT(true);
      await transaction.wait();
    } catch (error) {
      handleError(
        error,
        "An error occurred while creating the sale. Please try again."
      );
    } finally {
      setIsLoadingNFT(false);
    }
  };

  const buyNft = async (nft) => {
    try {
      const provider = await createWeb3ModalConnection();
      const signer = provider.getSigner();
      const contract = await fetchContract(signer);

      const price = ethers.utils.parseUnits(nft.price.toString(), "ether");

      // Get user's balance
      const userBalance = await provider.getBalance(signer.getAddress());

      // Check if the user's balance is sufficient
      if (userBalance.lt(price)) {
        alert("Insufficient funds to buy this NFT!");
        return false;
      }

      const transaction = await contract.createMarketSale(nft.tokenId, {
        value: price,
      });
      setIsLoadingNFT(true);
      await transaction.wait();
      setIsLoadingNFT(false);
      return true;
    } catch (error) {
      handleError(
        error,
        "An error occurred while buying the NFT. Please try again."
      );
      return false;
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) return alert("Please install MetaMask.");

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      setCurrentAccount(accounts[0]);
      window.location.reload();
    } catch (error) {
      handleError(
        error,
        "An error occurred while connecting to MetaMask. Please try again."
      );
    }
  };

  const checkIfWalletIsConnect = async () => {
    if (!window.ethereum) return alert("Please install MetaMask.");

    const accounts = await window.ethereum.request({ method: "eth_accounts" });

    if (accounts.length) {
      setCurrentAccount(accounts[0]);
    } else {
      console.log("No accounts found");
    }

    // Define the event listener functions
    const handleAccountsChanged = (newAccounts) => {
      if (newAccounts.length) {
        setCurrentAccount(newAccounts[0]);
        window.location.reload();
      } else {
        setCurrentAccount("");
        window.location.reload();
      }
    };

    const handleDisconnect = () => {
      setCurrentAccount("");
      window.location.reload();
    };

    // Add event listeners for MetaMask events
    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("disconnect", handleDisconnect);

    // Cleanup event listeners on component unmount
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
        window.ethereum.removeListener("disconnect", handleDisconnect);
      }
    };
  };

  useEffect(() => {
    checkIfWalletIsConnect();
  }, []);

  return (
    <NFTContext.Provider
      value={{
        nftCurrency,
        buyNft,
        createSale,
        fetchNFTs,
        fetchMyNFTsOrCreatedNFTs,
        connectWallet,
        currentAccount,
        isLoadingNFT,
      }}
    >
      {children}
    </NFTContext.Provider>
  );
};
