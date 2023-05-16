// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;


import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

struct Item {
  uint256 price;
  address currentOwner;
  address Artist;
}
contract NFT_MarketPlace is ERC721URIStorage, Ownable{
    //Number of Nfts created and also their id
    uint public tokenId;
    //using safemath library to prevent the overflow 
     using SafeMath for uint256;
    //mapping form token id to the owner of the NFT 
     mapping(uint256 => Item) private allNfts;
      //mapping form token id to the owner of the NFT which are listed for sale
     mapping(uint256 => Item) private _listings;
    //EVENT ewhen transfer takes place from one addrs to other
    // if tokenURI is not an empty string => an NFT was created
  // if price is not 0 => an NFT was listed
  // if price is 0 && tokenURI is an empty string => NFT was transferred (either bought, or the listing was canceled)
    event NFTransfer(uint256 tokenID, address from,  address indexed to,  string indexed tokenURI, uint256 price);
    //royalty fee in percentage %
    uint256 public royalty;

     constructor(uint256 _royalty) ERC721("NFT MetaVerse MarketPlace", "MetaNFT") {
        royalty=_royalty;
     }
     //function to change the royalty only by owner of nftMarketPlace
    function changeRoyalty(uint256 _royalty)public onlyOwner {
        royalty=_royalty;
    }
    // @dev function to create a new nft
     function createNFT(string memory tokenURI) public  {
      tokenId+=1;
      _safeMint(msg.sender, tokenId);
      _setTokenURI(tokenId, tokenURI);
      allNfts[tokenId]=Item(0,msg.sender,msg.sender);
      emit NFTransfer(tokenId, address(0),msg.sender, tokenURI, 0);
  }





  //fun tion to list the nft for sale 
    function listNFT(uint256 _tokenID, uint256 _price) public {
      Item memory listing=allNfts[_tokenID];
       address ownerCurrent=listing.currentOwner;
    require(_price > 0, "NFTMarket: price must be greater than 0");
    require(ownerCurrent==msg.sender,"You are not the owner of the nft");
    transferFrom(msg.sender, address(this), _tokenID);
    address artist=listing.Artist;
   
    _listings[_tokenID] = Item(_price, ownerCurrent,artist);
    emit NFTransfer(_tokenID, msg.sender, address(this), "", _price);
  }

  //if Owner wants to cancel the listing of the nft
    function cancelListing(uint256 _tokenID) public {
     Item memory listing = _listings[_tokenID];
     require(listing.price > 0, "NFTMarket: nft not listed for sale");
     require(listing.currentOwner==msg.sender, "You are not the owner of the nft");
     ERC721(address(this)).transferFrom(address(this), msg.sender, _tokenID);
     clearListing(_tokenID);
     emit NFTransfer(_tokenID, address(this), msg.sender, "", 0);
  }

  //function to buy an NFT
    function buyNFT(uint256 _tokenID) public payable {
     Item memory listing = _listings[_tokenID];
     require(listing.price > 0, "NFTMarket: nft not listed for sale");
     require(msg.value == listing.price, "NFTMarket: incorrect price");
     ERC721(address(this)).transferFrom(address(this), msg.sender, _tokenID);
     clearListing(_tokenID);
     //paying to the current owner
     (bool success1, ) = payable(listing.currentOwner).call{value: ((msg.value).mul(95)).div(100)}("");
     require(success1,"Error in buying nft 1");
     // paying royalty to the original artist
     (bool success2, ) = payable(listing.Artist).call{value: ((msg.value).mul(royalty)).div(100)}("");
     require(success2,"Error in buying nft 2");
     allNfts[_tokenID].currentOwner=msg.sender;
     emit NFTransfer(_tokenID, address(this), msg.sender, "", 0);
  }

  function clearListing(uint256 tokenID) private {
    _listings[tokenID].price = 0;
  }


  // Function to receive Ether. msg.data must be empty
    receive() external payable {}

    // Fallback function is called when msg.data is not empty
    fallback() external payable {}

}