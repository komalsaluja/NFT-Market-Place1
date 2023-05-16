import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import React, { useEffect, useRef, useState } from "react";
import Web3Modal from "web3modal";
import { Contract, providers, utils } from "ethers";
import connectWallet from "../utils/ConnectWallet";
import { abi, NFT_CONTRACT_ADDRESS } from "../constants";
import axios from "axios";
import Card1 from "../components/Card1";
import Navbar1 from "../components/Navbar1";
export default function Home() {
  const [walletConnected, setWalletConnected] = useState(false);
  // loading is set to true when we are waiting for a transaction to get mined
  const [loading, setLoading] = useState(false);
  const web3ModalRef = useRef();
  const [signer, setSigner] = useState();
  const [provider, setProvider] = useState();
  async function connectwallet() {
    await connectWallet(web3ModalRef);
  }
  useEffect(() => {
    console.log("Index Page");
    // if wallet is not connected, create a new instance of Web3Modal and connect the MetaMask wallet
    if (!walletConnected) {
      // Assign the Web3Modal class to the reference object by setting it's `current` value
      // The `current` value is persisted throughout as long as this page is open

      web3ModalRef.current = new Web3Modal({
        network: "mumbai",
        providerOptions: {},
        disableInjectedProvider: false,
      });
      connectwallet();

      // set an interval to get the number of token Ids minted every 5 seconds
    }
  }, [walletConnected]);
  return (
    <div>
      <Navbar1 />
      <Card1 />
    </div>
  );
}

export async function getStaticProps() {
  console.log("getStaticProps");
  const provider = new providers.JsonRpcProvider(
    "https://polygon-mumbai.g.alchemy.com/v2/1S6XGWvLFLSWTjf6oRTAm7CmdxD3uwG2"
  );
  const contract = new Contract(NFT_CONTRACT_ADDRESS, abi, provider);
  const getAllListing = contract.filters.NFTransfer(
    null,
    null,
    NFT_CONTRACT_ADDRESS,
    null,
    null
  );
  const allListing = await contract.queryFilter(getAllListing);
  const currentListing = allListing.map(async (e) => {
    const id = e.args.tokenID;
    let obj;
    const checkListing = await contract.ownerOf(id);
    if (checkListing == NFT_CONTRACT_ADDRESS) {
      const tokenURI = await contract.tokenURI(id);
      axios.get(tokenURI).then(function (response) {
        obj = response.data;
        console.log(response.data);
      });
      return {
        name: obj.name,
        description: obj.description,
        imageuri: obj.image,
      };
    }
  });

  return {
    props: {
      currentListing,
    },
    revalidate: 10,
  };
}
