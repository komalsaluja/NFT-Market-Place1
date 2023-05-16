import React from 'react'
import {useState,useContext,useEffect,useRef} from 'react'
import {Web3Storage} from 'web3.storage'
import uploadtoIpfs from '../utils/uploadtoIpfs'
import ConnectWallet from '../utils/ConnectWallet'
import Web3Modal from "web3modal";
import createNft from "../utils/createNft"
import axios from 'axios';
const Create = () => {
    const [image,setImage]=useState();
    const [name,setName]=useState();
    const [description,setDescription]=useState();
    const [loading,setLoading]=useState(false);
    const web3ModalRef = useRef();

    async function uploadMetaData(){
        setLoading(true);
        const imageCid= await uploadtoIpfs(image);
        console.log(imageCid);
        const obj={
            name:name,
            description:description,
            image:"https://ipfs.io/ipfs/"+imageCid+"/nftDetails"
        }
        const metaDataCid=await uploadtoIpfs(obj,true);
        
        console.log(metaDataCid);
        web3ModalRef.current = new Web3Modal({
            network: "mumbai",
            providerOptions: {},
            disableInjectedProvider: false,
          });
        const signer=await ConnectWallet(web3ModalRef,true)
        const metadataURI="https://ipfs.io/ipfs/"+metaDataCid+"/nftDetails";
    await createNft(signer,metadataURI);
    setLoading(false);
    window.alert("NFT minted successfully");


    }

    return (
        <div>
            <input type="text" placeholder="Name" className="border-2	 border-black	w-[50vw] m-5" onChange={(e)=>setName(e.target.value)} name="Name"></input>
            <textarea type="text" placeholder="Bio" className="border-2	 border-black	w-[50vw] m-5" onChange={(e)=>setDescription(e.target.value)} name="description"></textarea>
            <input type="file" placeholder="Name" className="border-2	 border-black	w-[50vw] m-5" name="Image" onChange={(e)=>{e.preventDefault();setImage(e.target.files[0]);console.log(image)}}></input>
            <button placeholder='Submit' onClick={uploadMetaData}>
                {loading?"loading...":"submit"}
                </button>
        </div>
    )
}

export default Create
