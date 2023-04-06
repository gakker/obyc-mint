import type { AppProps } from "next/app";
import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react";
import Head from "next/head";
import ThirdwebGuideFooter from "../components/GitHubLink";
import { Header } from '../components/common'
import { rpcGoerli, rpcMainnet } from "../components/utils/consts";
import "../styles/globals.css";

// This is the chainId your dApp will work on.
const activeChainId = ChainId.Mainnet;

function MyApp({ Component, pageProps }: AppProps) {
  const AnyComponent = Component as any;
  return (
    <ThirdwebProvider
      desiredChainId={activeChainId}
      chainRpc={{ [ChainId.Mainnet]: rpcMainnet }} >
      <Header />
      <Head>
        <title>OBYC Labs™</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="description"
          content="Mutants vs. Machines is the three-tiered evolution of 10,000 OBYC Bears who consumed toxic salmon (Mutants) or were exposed to Nanobots (Machines). All of the 7,777 genesis OBYC bears can transform into L1 Mutants OR Machines. Once a path is chosen, you cannot change back. L2 is an enhancement to your L1 - only 1,107 Mutants and 1,106 Machines can evolve. L3 is the ultimate and rarest tier of legendary evolution and it can only be injected into 5 Mutants and 5 Machines."
        />
        <meta
          name="keywords"
          content="OBYC Labs, Mutants vs. Machines"
        />
      </Head>
      <AnyComponent {...pageProps} />
      <ThirdwebGuideFooter />
    </ThirdwebProvider>
  );
}

export default MyApp;
