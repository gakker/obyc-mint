import path from "path";
import { promises as fs } from "fs";
import { ethers } from "ethers";
import { mvmContractABI } from "../../components/utils/abi"

const MvMContractLatest = new ethers.Contract(
  "0x91eC5d0FF249Eea56926502199Ca77289BC8e754",
  mvmContractABI,
  new ethers.providers.AlchemyProvider("homestead", "Lo3rCvTJMcUtYYxZNYcHYEAXHstZHV13")
);

export default async function handler(req, res) {
  if (req.method === 'GET') {
    //Find the absolute path of the json directory
    const jsonDirectory = path.join(process.cwd(), "json");
    //Read the json data file data.json
    const fileContents = await fs.readFile(jsonDirectory + "/data.json", "utf8");
    //Return the content of the data file in json format
    res.status(200).json(fileContents);
  }
  else if (req.method === 'POST') {
    console.log('heredadas')
    const jsonDirectory = path.join(process.cwd(), "json");
    // let data = await getData()
    console.log(data, 'dadas')
    const fileContents = await fs.readFile(jsonDirectory + "/data.json", "utf8");
    let data = JSON.parse(fileContents)
    data.push(req.body)
    //Read the json data file data.json
    await fs.writeFile(
      jsonDirectory + `/data.json`,
      JSON.stringify(data)
    );

    // const fileContents = await fs.readFile(jsonDirectory + "/data.json", "utf8");
    res.status(200).json(fileContents);
  }

}

// const getData = async () => {
//   let arrDataLatest = [];
//   let tokensMvMPromisesNew = [];
//   let tokenDataPromisesNew = [];
//   let tokenOwnerPromisesNew = [];
//   const levelOneTokensCountLatest = await MvMContractLatest.mvmL1TokensCount()

//   for (let index = 0; index < levelOneTokensCountLatest; index++) {
//     console.log(index, 'here')
//     tokensMvMPromisesNew.push(MvMContractLatest.mvmL1Tokens(index))
//     tokenOwnerPromisesNew.push(MvMContractLatest.ownerOf(index))
//   }

//   let tokensNew = await Promise.all(tokensMvMPromisesNew)
//   let ownersNew = await Promise.all(tokenOwnerPromisesNew)


//   for (let index = 0; index < tokensNew.length; index++) {
//     tokenDataPromisesNew.push(MvMContractLatest.transformInfoLevelOneByTokenId(ethers.BigNumber.from(tokensNew[index]).toNumber()))
//   }

//   let tokensDataNew = await Promise.all(tokenDataPromisesNew)
//   let createJsonObj = (user, mvmTokenId, obycTokenId, labType) => {
//     let obj = {
//       "user": user,
//       "mvm": mvmTokenId,
//       "obyc": obycTokenId,
//       "lab": labType
//     }
//     return obj;
//   }

//   for (let index = 0; index < levelOneTokensCountLatest; index++) {
//     let token = ethers.BigNumber.from(await tokensNew[index]).toNumber()
//     const tokenInfo = await tokensDataNew[index]
//     const owner = await ownersNew[index]
//     console.log(index, 'Getting Info New Contract')
//     arrDataLatest.push(createJsonObj(
//       owner,
//       token,
//       ethers.BigNumber.from(tokenInfo.obycTokenId).toNumber(),
//       ethers.BigNumber.from(tokenInfo.obycLabsTokenId).toNumber() == 0 ? '0' : '1'))
//   }

//   return arrDataLatest
// }
