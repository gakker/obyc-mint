import { useState } from "react";
import { NextPage } from 'next'
import TokenImg from './TokenImg'
import Grid from '@mui/material/Grid';
import Pagination from '@mui/material/Pagination';
import usePagination from "../pagination/Pagination";
import { Box } from "@mui/material";

interface IProps {
  tokenIds: any[],
  selectedToken: any,
  type: string,
  setToken: (tokenid: any) => void
}

const AllTokens: NextPage<IProps> = ({ tokenIds, setToken, selectedToken, type }) => {

  const PER_PAGE = 12;
  const count = Math.ceil(tokenIds.length / PER_PAGE);
  const _DATA = usePagination(tokenIds, PER_PAGE);
  let [page, setPage] = useState(1);
  const handleChange = (e: any, p: any) => {
    setPage(p);
    _DATA.jump(p);
  };

  const Token = TokenImg as any;

  if (tokenIds.length == 0) {
    return <div style={{
      color: "white"
    }} >You Don&apos;t Have Tokens to Select</div>
  }

  return (
    <>
      <Grid sx={{ justifyContent: "center" }} container spacing={2}>
        {
          _DATA.currentData().map((item: any) => {
            return (
              <Grid
                style={{ maxWidth: "100%" }}
                key={item?.tokenId}
                item md={type == 'obyc' ? 2 : 6} sm={6} xs={6}>
                <Token
                  type={type}
                  selectedToken={selectedToken}
                  setToken={setToken}
                  key={item?.tokenId}
                  tokenId={item?.tokenId}
                  imageUrl={item?.rawMetadata.image}
                />
              </Grid>
            )
          })
        }
      </Grid>
      <Box sx={{ display: "flex", justifyContent: "center" }} >
        <Pagination
          sx={{
            mt: 5,
            "& .MuiPaginationItem-root": {
              color: "black",
              borderColor: "black",
              fontWeight: "bold"
            },
            "& .Mui-selected": {
              color: "white",
              borderColor: "white",
              fontWeight: "bold"
            }
          }}
          count={count}
          size="large"
          page={page}
          variant="outlined"
          shape="rounded"
          onChange={handleChange}
        />
      </Box>
    </>
  );
};

export default AllTokens;
