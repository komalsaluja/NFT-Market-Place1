// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  const nftMarketPlace=await hre.ethers.getContractFactory("NFT_MarketPlace");
  const nftMarket=await nftMarketPlace.deploy(10);
  await nftMarket.deployed();

  console.log("Contract Address",nftMarket.address);//0x8cD355D99067F1106EC3c684F6dfab5CF26Fbf11
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
