import { useState, useEffect } from "react";
import {
  useContract,
  useAddress
} from "@thirdweb-dev/react";
import type { NextPage } from "next";
import {
  originalAddressObyc,
  originalAddressObycLab,
  originalAddressMvm
} from "../../utils/consts";
import { OBYC } from "../../utils/abi";
import AllTokens from "../tokens/AllTokens";
import { CircularProgress } from "@mui/material";
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import { Alchemy, Network, OwnedNft, OwnedNftsResponse } from "alchemy-sdk";
import { getHasApproved } from "../../utils/Web3Util";
import Box from '@mui/material/Box';
import axios from "axios"

const LevelOne: NextPage = () => {

  const Tokens = AllTokens as any;

  //states
  const [status, setStatus] = useState(1)
  const [showDisclaimer, setShowDisclaimer] = useState(false)
  const [ownedNFTsObyc, setOwnedNFTsObyc] = useState<OwnedNft[]>()
  const [ownedNFTsObycPageKey, setOwnedNFTsObycPageKey] = useState("")
  const [ownedNFTsObycLab, setOwnedNFTsObycLab] = useState<OwnedNft[]>()
  const [obycToken, setObycToken] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [hasApproved, setHasApproved] = useState(false)
  const [obycLabToken, setObycLabToken] = useState("")
  const [btnText, setBtnText] = useState("Select Your OBYC Token")
  const [err, setErr] = useState(false)
  const [animation, setAnimation] = useState({
    show: false,
    src: ""
  })
  const [errMsg, setErrMsg] = useState("")

  const settings = {
    apiKey: "yCzkW-1vE5miOKVP3Ur_X48UpBzhaUMV", // Replace with your Alchemy API Key.
    network: Network.ETH_MAINNET, // Replace with your network.
  };

  const alchemy = new Alchemy(settings);


  const options2 = {
    "contractAddresses": [
      originalAddressObycLab
    ]
  }
  const address = useAddress()

  const setLevelOneData = async (address: any, obycToken: any, obycLabToken: any) => {
    let response = await axios.post("https://backend-obyc.thecbt.cyou/save-single-tokens", {
      "token": {
        "address": address,
        "mvm": 0,
        "obyc": obycToken,
        "lab": obycLabToken
      },
      "type": "1"
    })
    if (response.data.status) {
      return true
    }
    // console.log(data)
  }

  useEffect(() => {
    setIsLoading(true)
    try {
      setData()
    } catch (error) {
      setIsLoading(false)
    }
  }, [address])

  const setData = async () => {
    setHasApproved(await getHasApproved(address, originalAddressMvm))
    let flag = false
    let arr: OwnedNft[] = []
    // let response: OwnedNftsResponse

    const options = {
      "contractAddresses": [
        originalAddressObyc
      ],
      pageKey: ""
    }

    let response = await alchemy.nft.getNftsForOwner(String(address), options)
    // console.log(Math.ceil((response.totalCount) / 100), 'cell')
    // do {


    // console.log(response, 'page key')
    for (let index = 0; index < Math.ceil((response.totalCount) / 100); index++) {
      let response = await alchemy.nft.getNftsForOwner(String(address), options)
      // console.log(response, 'ffff')
      options.pageKey = response?.pageKey || ""
      arr.push(...response.ownedNfts);
      // setOwnedNFTsObyc(ownedNFTsObyc,...response.ownedNfts)
      // arr[]
      console.log(arr)
    }

    setOwnedNFTsObyc(arr)
    alchemy.nft.getNftsForOwner(String(address), options2)
      .then((res) => {
        setOwnedNFTsObycLab(res.ownedNfts)
      })
    setIsLoading(false)
  }
  //thirdweb hooks
  const { contract: obycContract } = useContract(originalAddressObyc, OBYC.output.abi)
  const { contract: obycLabContract } = useContract(originalAddressObycLab)
  const { contract: mvmContract } = useContract(originalAddressMvm)

  const handleOnClickBtn = async () => {
    // setLevelOneData()
    // mintMutantNft()
    if (status == 1 && obycToken.length == 0) {
      setErr(true);
      setErrMsg("Please Select An Obyc Token First")
    }
    else if (status == 2 && obycLabToken.length == 0) {
      setErr(true);
      setErrMsg("Please Select An Obyc Lab Token First")
    }
    else if (status == 1 && Number(obycToken) >= 0 && await isAlreadyMintedMvML1(obycToken)) {
      setErr(true);
      setErrMsg("This token has been minted already")
    }
    else if (status == 2 && Number(obycLabToken) >= 0 && !hasApproved) {
      setApproval()
    }
    else if (status == 1 && Number(obycToken) >= 0 && !hasApproved) {
      setStatus(2)
      setShowDisclaimer(true)
      setBtnText('Permission to Burn Lab Item')
    }
    else if (status == 1 && Number(obycToken) >= 0 && hasApproved) {
      setStatus(2)
      setBtnText('Select Your Obyc Lab Token and Transform')
    }
    else if (status == 2 && Number(obycLabToken) >= 0 && Number(obycToken) > 0) {
      mintMutantNft()
    }
  }

  const handleGoBack = async () => {
    setStatus(1)
    setBtnText('Select Your OBYC Token')
  }

  const handleCloseSnackBar = () => {
    setErr(false)
  };

  const mintMutantNft = async () => {
    try {
      setStatus(0)
      if (Number(obycLabToken) == 0) {
        setAnimation({
          show: true,
          src: "./mutant-1.mp4"
        })
      }
      else if (Number(obycLabToken) == 1) {
        setAnimation({
          show: true,
          src: "./machine-1.mp4"
        })
      }

      const owner = await obycContract?.call("ownerOf", Number(obycToken))
      if (String(owner) != String(address)) {
        setStatus(1)
        setErr(true);
        setErrMsg("You Are Not the Owner of this Token")
        return
      }
      // params mint obycToken,labTokenId,mvmToken,mvmL2TokenId,level
      await mvmContract?.call(
        "mint",
        obycToken,
        obycLabToken,
        Number(0),
        Number(0),
        1)
        .then((res) => {
          setStatus(1)
          setErr(true);
          setBtnText("Select Your OBYC Token")
          setErrMsg("You minted Successfully. Your Bear is transforming, it will reveal within 24hrs!")
          setLevelOneData(address, obycToken, obycLabToken)
        })
        .catch((error) => {
          console.log(error, 'errx')
          setBtnText("Select Your OBYC Token")
          setStatus(1)
          setErr(true);
          setErrMsg("Error While Minting")
        })
    } catch (error) {
      console.log(error, 'erry')
      setBtnText("Select Your OBYC Token")
      setStatus(1)
      setErr(true);
      setErrMsg("Error Cannot Continue")
    }
  };

  const setApproval = async () => {
    try {
      const approval = await obycLabContract?.call(
        "setApprovalForAll",
        mvmContract?.getAddress(),
        true
      )
      if (approval) {
        setStatus(2)
        setShowDisclaimer(false)
        setBtnText('Transform')
        setHasApproved(true)
      }
    } catch (error) {
      console.log(error, 'err')
      setShowDisclaimer(false)
      setStatus(1)
      setBtnText('Select Your OBYC Token')
      setErr(true);
      setErrMsg("Error Cannot Continue")
    }
  }

  const isAlreadyMintedMvML1 = async (_obycTokenId: any) => {
    // const response = await fetch('/api/staticdata')
    // const data = await response.json()
    // // console.log(JSON.parse(data), 'dadasdddd')
    // // console.log(JSON.parse(data).findIndex((item: any) => item.obyc == _obycTokenId), 'flag')
    // let flag = JSON.parse(data).findIndex((item: any) => item.obyc == _obycTokenId)
    // if (flag >= 0) {
    //   return true
    // }
    // return false;

    //---------------second option
    // const l1TokenPromises = []
    // const l1tTransformsPromises = []
    // const mvmL1TokensCount = await mvmContract?.call("mvmL1TokensCount")
    // for (let index = 0; index < mvmL1TokensCount; index++) {
    //   l1TokenPromises.push(mvmContract?.call("mvmL1Tokens", index))
    // }
    // const tokens = await Promise.all(l1TokenPromises)
    // for (let index = 0; index < tokens.length; index++) {
    //   l1tTransformsPromises.push(mvmContract?.call("transformInfoLevelOneByTokenId", tokens[index]))
    // }
    // const transformInfo = await Promise.all(l1tTransformsPromises)
    // for (let index = 0; index < transformInfo.length; index++) {
    //   if (await transformInfo[index]?.obycTokenId == _obycTokenId) {
    //     return true;
    //   }
    // }
    // return false;
    //-------------------------axios call
    let response = await axios.post("https://backend-obyc.thecbt.cyou/check-token", {
      "obyc": obycToken
    })
    if (response.data.status) {
      return true
    }
    return false
  }

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
      width: "100%"
    }}>
      {
        status === Number(1) && !isLoading ?
          <Tokens
            type="obyc"
            setToken={setObycToken}
            selectedToken={obycToken}
            tokenIds={ownedNFTsObyc || []}
          /> :
          status === Number(2) && !isLoading ?
            <Tokens
              type="obyclabs"
              setToken={setObycLabToken}
              selectedToken={obycLabToken}
              tokenIds={
                ownedNFTsObycLab?.filter(item => item.tokenId == "0" || item.tokenId == "1") || []
              }
            /> :
            status === Number(0) && animation.show ?
              <video
                controls={false}
                muted
                loop
                autoPlay
                playsInline
                src={animation.src}
                style={{ width: "100%", height: "400px" }}
              /> :
              <CircularProgress color="secondary" />
      }
      {
        status == 1 && !isLoading ?
          <Button
            onClick={handleOnClickBtn}
            sx={{ mt: 4 }}
            color="secondary"
            variant="contained">{btnText}
          </Button> :
          status == 2 && !isLoading ?
            <Box sx={{
              display: "flex",
              mt: 4
            }}>
              <Button
                onClick={handleGoBack}
                sx={{ mr: 2 }}
                color="warning"
                variant="contained">{"Go Back"}
              </Button>
              <Button
                onClick={handleOnClickBtn}
                color="secondary"
                variant="contained">{btnText}
              </Button>
            </Box> :
            <></>
      }
      {
        showDisclaimer ?
          <p style={{ marginTop: "18px", fontSize: "10px" }}>*need permission to burn obyclab token</p> :
          <></>
      }
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={err}
        onClose={handleCloseSnackBar}
        message={errMsg}
        key={"top" + "center"}
      />
    </div>
  );
};

export default LevelOne;
