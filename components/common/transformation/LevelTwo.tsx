import { useState } from "react";
import {
  useContract,
  useOwnedNFTs,
  useAddress,
} from "@thirdweb-dev/react";
import type { NextPage } from "next";
import {
  originalAddressObycLab,
  originalAddressMvm
} from "../../utils/consts";
import { OBYC } from "../../utils/abi";
import AllTokens from "../tokens/AllTokens";
import { CircularProgress } from "@mui/material";
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import { ethers } from "ethers";

const Leveltwo: NextPage = () => {

  const Tokens = AllTokens as any;
  //thirdweb hooks
  const address = useAddress()
  const { contract: mvmContract } = useContract(originalAddressMvm)
  const {
    data: ownedNFTs,
    isLoading
  } = useOwnedNFTs(mvmContract, address)

  const { contract: obycLabContract } = useContract(originalAddressObycLab)
  const {
    data: ownedNFTsObycLab,
    isLoading: isLoadingObycLab
  } = useOwnedNFTs(obycLabContract, address)

  //usestates
  const [status, setStatus] = useState(1)
  const [mvmToken, setMvmToken] = useState("")
  const [obycLabToken, setObycLabToken] = useState("")
  const [btnText, setBtnText] = useState("Select Your MvM Level One Token")
  const [err, setErr] = useState(false)
  const [errMsg, setErrMsg] = useState("")
  const [animation, setAnimation] = useState({
    show: false,
    src: ""
  })

  const handleOnClickBtn = () => {
    if (status == 1 && mvmToken.length == 0) {
      setErr(true);
      setErrMsg("Please Select An MvM Token First")
    }
    else if (status == 2 && obycLabToken.length == 0) {
      setErr(true);
      setErrMsg("Please Select An Obyc Lab Token First")
    }
    else if (status == 1 && Number(mvmToken) >= 0) {
      setStatus(2)
      setBtnText('Select Your Obyc Lab Token and Transform')
    }
    else if (status == 2 && Number(obycLabToken) > 0 && Number(mvmToken) >= 0) {
      //transform logic
      mintMutantNft()
    }
  }

  const handleCloseSnackBar = () => {
    setErr(false)
  };

  const mintMutantNft = async () => {
    try {
      setStatus(0)
      if (Number(obycLabToken) == 2) {
        setAnimation({
          show: true,
          src: "./machine-2.mp4"
        })
      }
      else if (Number(obycLabToken) == 3) {
        setAnimation({
          show: true,
          src: "./mutant-2.mp4"
        })
      }

      const owner = await mvmContract?.call("ownerOf", Number(mvmToken))
      if (String(owner) != String(address)) {
        setStatus(1)
        setErr(true);
        setErrMsg("You Are Not the Owner of this Token")
        return
      }
      const hasApproval = await obycLabContract?.call(
        "isApprovedForAll",
        address,
        mvmContract?.getAddress()
      );

      if (!isCorrectLabTokenForL2Mint(obycLabToken, mvmToken)) {
        setStatus(1)
        setErr(true);
        setErrMsg("Wrong Lab Item Selected for Transformation")
        return
      }

      if (await isAlreadyMintedMvML2(mvmToken)) {
        setStatus(1)
        setErr(true);
        setErrMsg("Already Minted This Token Id")
        return
      }

      if (!hasApproval) {
        // Set approval
        await obycLabContract?.call(
          "setApprovalForAll",
          mvmContract?.getAddress(),
          true
        );
      }

      // params mint obycToken,labTokenId,mvmToken,mvmL2TokenId,level
      await mvmContract?.call("mint", Number(0), obycLabToken, Number(mvmToken), Number(0), 2)
        .then((res) => {
          setStatus(1)
          setErr(true);
          setErrMsg("Minted Successfully!")
        })
        .catch(() => {
          setStatus(1)
          setErr(true);
          setErrMsg("Error While Minting")
        })
    } catch (error) {
      setStatus(1)
      setErr(true);
      setErrMsg("Error While Minting")
    }
  };

  const isCorrectLabTokenForL2Mint = async (_obycLabTokenId: any, _mvmTokenId: any) => {
    const transformInfoLevelOne = await mvmContract?.call("transformInfoLevelOneByTokenId", _mvmTokenId)
    if (transformInfoLevelOne?.obycLabsTokenId == 0 && _obycLabTokenId == 2) {
      return true;
    } else if (transformInfoLevelOne?.obycLabsTokenId == 1 && _obycLabTokenId == 3
    ) {
      return true;
    }
    return false;
  }

  const isAlreadyMintedMvML2 = async (_mvmTokenId: any) => {
    const mvmL2TokensCount = await mvmContract?.call("mvmL2TokensCount")
    for (let index = 0; index < mvmL2TokensCount; index++) {
      const mvmL2Token = await mvmContract?.call("mvmL2Tokens", index)
      const transformInfoLevelThree = await mvmContract?.call("transformInfoLevelTwoByTokenId", mvmL2Token)
      if (transformInfoLevelThree.mvmLevelTwoTokenId == _mvmTokenId) {
        return true;
      }
    }
    return false;
  }

  return (
    <></>
    // <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
    //   {
    //     status === Number(1) && !isLoading ?
    //       <Tokens
    //         type="obyc"
    //         setToken={setMvmToken}
    //         selectedToken={mvmToken}
    //         tokenIds={
    //           ownedNFTs?.filter(
    //             item => {
    //               if (Array.isArray(item.metadata.attributes)) {
    //                 item?.metadata.attributes[8].value == "Level 1"
    //                 return item
    //               }
    //             })
    //           || []}
    //       /> :
    //       status == 2 && !isLoadingObycLab ?
    //         <Tokens
    //           type="obyclabs"
    //           setToken={setObycLabToken}
    //           selectedToken={obycLabToken}
    //           tokenIds={ownedNFTsObycLab?.filter(item => item.metadata.id == "2" || item.metadata.id == "3") || []}
    //         /> :
    //         status === Number(0) && animation.show ?
    //           <video
    //             controls={false}
    //             muted
    //             loop
    //             autoPlay
    //             playsInline
    //             src={animation.src}
    //             style={{ width: "100%", height: "400px" }}
    //           /> :
    //           <CircularProgress color="secondary" />
    //   }
    //   {
    //     status == 1 && !isLoading ?
    //       <Button
    //         onClick={handleOnClickBtn}
    //         sx={{ mt: 4 }}
    //         color="secondary"
    //         variant="contained">{btnText}
    //       </Button> :
    //       status == 2 && !isLoadingObycLab ?
    //         <Button
    //           onClick={handleOnClickBtn}
    //           sx={{ mt: 4 }}
    //           color="secondary"
    //           variant="contained">{btnText}
    //         </Button> :
    //         <></>
    //   }
    //   <Snackbar
    //     anchorOrigin={{ vertical: "top", horizontal: "center" }}
    //     open={err}
    //     onClose={handleCloseSnackBar}
    //     message={errMsg}
    //     key={"top" + "center"}
    //   />
    // </div>
  );
};

export default Leveltwo;
