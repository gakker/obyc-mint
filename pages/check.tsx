import { useState } from "react";
import type { NextPage } from "next";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { originalAddressMvm } from "../components/utils/consts";
import styles from "../styles/Theme.module.css";
import Button from '@mui/material/Button';
import { getTokenStatus } from "../components/utils/Web3Util";
import { CircularProgress } from "@mui/material";
import Snackbar from '@mui/material/Snackbar';
import {
  useContract
} from "@thirdweb-dev/react";

const Check: NextPage = () => {

  const [obycTokenId, setObycTokenId] = useState<Number>()
  const [mvmTokenId, setMvmTokenId] = useState<Number>(0)
  const [mvmTokenURL, setMvmTokenURL] = useState<String>("")
  const [statusString, setStatusString] = useState<String>("")
  const [loader, setLoader] = useState<Boolean>(false)
  const [image, setImage] = useState<Boolean>(false)
  const [errMsg, setErrMsg] = useState("")
  const [err, setErr] = useState(false)

  const { contract: mvmContract } = useContract(originalAddressMvm)

  const handleCloseSnackBar = () => {
    setErr(false)
  };

  const getData = async () => {
    try {
      setLoader(true)
      let response = await getTokenStatus(Number(obycTokenId))
      if (response[0] == 1) {
        setStatusString('The OBYC Token Has Been Transformed To Level 1')
        setMvmTokenId(Number(response[1]))
        let data = await mvmContract?.call("tokenURI", Number(response[1]))
        fetch(data)
          .then(res => res.json())
          .then(res => {
            // console.log(res)
            setMvmTokenURL(res?.image)
            setImage(true)
            setLoader(false)
          })
        // console.log(data,'dasdas')
      }
      else if (response[0] == 2) {
        setStatusString('The OBYC Token Has Been Transformed To Level 2')
        setMvmTokenId(Number(response[1]))
        let data = await mvmContract?.call("tokenURI", Number(response[1]))
        // console.log(data,'dasdas')
        fetch(data)
          .then(res => res.json())
          .then(res => {
            // console.log(res)
            setMvmTokenURL(res?.image)
            setImage(true)
            setLoader(false)
          })
      }
      else if (response[0] == 3) {
        setStatusString('The OBYC Token Has Been Transformed To Level 3')
        setMvmTokenId(Number(response[1]))
        let data = await mvmContract?.call("tokenURI", Number(response[1]))
        // console.log(data,'dasdas')
        fetch(data)
          .then(res => res.json())
          .then(res => {
            // console.log(res)
            setMvmTokenURL(res?.image)
            setImage(true)
            setLoader(false)
          })
      }
    } catch (error) {
      setStatusString('The OBYC Token Has Not Been Transformed Yet')
      setImage(false)
      setLoader(false)
    }
  }

  return (
    <div className={styles.checkContainerTwo}>
      <Box sx={{ display: 'flex', justifyContent: 'center', flexGrow: 1 }}>
        <Grid className={styles.checkContainer} container>
          <Grid item md={6} sm={12} xs={12}>
            <Box sx={{
              p: 4,
              display: 'flex',
              flexDirection: 'column',
            }}>
              <p className={styles.checkHeading}>OBYC Token Check</p>
              <p className={styles.checkSubHeading}>Enter Bear number to check transformation level status!</p>
              <TextField
                id="standard-name"
                placeholder="OBYC Token ID"
                sx={{
                  fieldset: {
                    borderColor: 'white !important'
                  },
                  input: {
                    color: "#fff"
                  },
                }}
                onChange={(e) => setObycTokenId(Number(e.target.value))}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }} >
                <Button
                  onClick={getData}
                  sx={{
                    width: "50%",
                    backgroundColor: 'white',
                    color: "black",
                    mt: 3
                  }}
                  variant="contained">Check
                </Button>
              </Box>
              {
                <p>{statusString}</p>
              }
              {
                loader ?
                  <CircularProgress /> :
                  mvmTokenId >= 0 && image ?
                    <>
                      <img src={String(mvmTokenURL)} alt='obyc' style={{ height: "250px", width: "50%" }} />
                    </> :
                    <></>
              }
            </Box>
          </Grid>
          <Grid md={6} item sm={12} xs={12}>
            <img className={styles.checkLogo} src={"obyc_logo_official.png"} />
          </Grid>
        </Grid>
      </Box>
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

export default Check;
