import {Web3Storage} from 'web3.storage'
async function uploadtoIpfs(object,json=false){
    console.log("Welcome")
   
    const IPFSclient=makeStorageClient();
    let data=object;
    if(json)
    {
        data=JSON.stringify(object);
    } 
    const blob=new Blob([data]);
    const file=[
        new File([blob],"nftDetails")
    ];
    const cid=await IPFSclient.put(file);
    return cid;
}
function makeStorageClient () {
    return new Web3Storage({ token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDY3NjNkQjMyRUFBMjM1RGRmQmJhOURkNjg0MzcyOUJCZTI0ZDk1REQiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NjgzNTc4MjQzMzQsIm5hbWUiOiJDcm93ZEZ1bmRpbmcifQ.br1aPfVkG01QJmobmv-Jscl5GTsMiWoy161t2CyQPvs" })
  }

  export default uploadtoIpfs