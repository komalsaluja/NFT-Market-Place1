import { Contract, providers, utils } from "ethers";
import { abi, NFT_CONTRACT_ADDRESS } from "../constants";
async function createNft(signer, tokenURI) {
  const nftContract = new Contract(NFT_CONTRACT_ADDRESS, abi, signer);
  const tx = await nftContract.createNFT(tokenURI);
  await tx.wait();
}
export default createNft;
