import React, { useEffect, useState, useRef } from "react";
import connectWallet from "../utils/ConnectWallet";
import Web3Modal from "web3modal";
import { Contract, providers, utils } from "ethers";
import { ethers } from "ethers";
import { abi, NFT_CONTRACT_ADDRESS } from "../constants";
import axios from "axios";
import Head from "next/head";

const Home = ({ nonListedowned, listedOwned }) => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [nonListedData, setNonListedData] = useState([]);
  const web3ModalRef = useRef();
  const [listedData, setListedData] = useState([]);
  const [loading, setLoading] = useState(false);
  const dataRef = useRef();
  // console.log('------------------------------------');
  // console.log(listedData);
  // console.log('------------------------------------');
  // console.log('----Non listed data is printed-------------------');
  // console.log(nonListedData);
  // console.log('------------------------------------');

  async function loadDataUtility() {
    const provider = await connectWallet(web3ModalRef);

    const signer = provider.getSigner();

    const address = await signer.getAddress();
    console.log("Utility");
    console.log(address);
    const contract = new Contract(NFT_CONTRACT_ADDRESS, abi, provider);
    const getAllOwnedNfts = contract.filters.NFTransfer(
      null,
      null,
      address,
      null,
      null
    );
    const getAllListedNfts = contract.filters.NFTransfer(
      null,
      null,
      NFT_CONTRACT_ADDRESS,
      null,
      null
    );
    const allNFTs = await contract.queryFilter(getAllOwnedNfts);
    const allListedNfts = await contract.queryFilter(getAllListedNfts);
    /////////////////////////
    const ownedNfts = await Promise.all(
      allNFTs.map(async (e) => {
        let obj;
        const id = e.args.tokenID;
        const checkListing = await contract.ownerOf(id);
        if (checkListing == address) {
          const tokenURI = await contract.tokenURI(id);
          await axios.get(tokenURI).then(function (response) {
            obj = response.data;
            // console.log(obj)
          });
          return {
            name: obj.name,
            description: obj.description,
            imageuri: obj.image,
          };
        }
      })
    );

    //////////////////////////////////

    const ownedListedNfts = await Promise.all(
      allListedNfts.map(async (e) => {
        const id = e.args.tokenID;
        let obj;
        const checkListing = await contract.ownerOf(id);
        if (checkListing == NFT_CONTRACT_ADDRESS) {
          const owner = e.args.from;
          if (owner == address) {
            const tokenURI = await contract.tokenURI(id);
            await axios.get(tokenURI).then(function (response) {
              obj = response.data;
              //  console.log(obj)
            });
            console.log(obj);
            return {
              name: obj.name,
              description: obj.description,
              price: e.args.price,
              imageuri: obj.image,
            };
          }
        }
      })
    );

    /////////////////////////////////////////

    console.log("Ready to rock and roll Game Starts");

    console.log("Non Listed Owned data");
    dataRef.current = {
      listed: ownedListedNfts,
      nonListed: ownedNfts,
    };
    console.log(dataRef.current.nonListed);
  }
  async function helper() {
    const provider = await connectWallet(web3ModalRef);

    const signer = provider.getSigner();

    const address = await signer.getAddress();

    console.log(address, "---------------");
    await loadDataUtility();
  }

  async function loadData() {
    try {
      await helper();
      setWalletConnected(true);
    } catch (e) {
      console.error(e);
    }
    setWalletConnected(true);
  }

  useEffect(() => {
    if (!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: "mumbai",
        providerOptions: {},
        disableInjectedProvider: false,
      });

      loadData();
    }
  }, [walletConnected]);

  return (
    <div>
      <Head>
        <title>NFT MarketPlace</title>
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-KK94CHFLLe+nY2dmCWGMq91rCGa5gtU4mk92HdvYe+M/SXH301p5ILy+dN9+nJOZ"
          crossorigin="anonymous"
        />
      </Head>
    </div>
  );
};

// export async function getStaticProps() {
//     console.log("getStaticProps")
//   const provider = new providers.JsonRpcProvider(
//     "https://polygon-mumbai.g.alchemy.com/v2/1S6XGWvLFLSWTjf6oRTAm7CmdxD3uwG2"
//   );

//   const signer = new ethers.Wallet("e5956f11b0324f42ace2c6813e9bfa276409bb2f0c7d87da08c3e43f61d104fd", provider);
//   const address=await signer.getAddress();
//   const contract=new Contract(NFT_CONTRACT_ADDRESS,abi,provider);
//   const getAllOwnedNfts= contract.filters.NFTransfer(null,null,address,null,null);
//    const getAllListedNfts=contract.filters.NFTransfer(null,null,NFT_CONTRACT_ADDRESS,null,null);
//   const allNFTs=await contract.queryFilter(getAllOwnedNfts);
//   const allListedNfts=await contract.queryFilter(getAllListedNfts);

//   const ownedNfts=await Promise.all(allNFTs.map(async (e)=>{
//     let obj;
//     const id=e.args.tokenID;
//     const checkListing=await contract.ownerOf(id);
//     if(checkListing==address){
//         const tokenURI=await contract.tokenURI(id);
// await axios.get(tokenURI).then(function (response) {
// obj=response.data;
// console.log(obj)
// });
// return{
// name:obj.name,
// description:obj.description,
// imageuri:obj.image,
// } }}));

// const ownedListedNfts=await Promise.all(allListedNfts.map(async (e)=>{
//     const id=e.args.tokenID;
//     let obj;
//     const checkListing=await contract.ownerOf(id);

//     if(checkListing==NFT_CONTRACT_ADDRESS ){
//         const owner=e.args.from;
//         if(owner==address)
//         {
//             const tokenURI=await contract.tokenURI(id);
//             await axios.get(tokenURI).then(function (response) {
//               obj= response.data;
//          console.log(obj)
// });
//      console.log(obj)
//             return{
//              name:obj.name,
//              description:obj.description,
//              price:e.args.price,
//              imageuri:obj.image,
//             }
//         }

//     }
//   }))
// console.log(ownedNfts)
// console.log(ownedListedNfts)
//   const nonListedowned=JSON.stringify(ownedNfts);
//   const listedOwned=JSON.stringify(ownedListedNfts);

// console.log(await signer.getAddress())
//     return{
//         props: {
//            nonListedowned,
//             listedOwned,
//         },
//         revalidate: 10
//     }
// }

export default Home;
