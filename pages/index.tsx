import {
  useContractMetadata,
  useActiveClaimCondition,
  useNFT,
  Web3Button,
  useContract,
  useTotalCirculatingSupply,
  useContractRead,
} from "@thirdweb-dev/react";
import { BigNumber } from "ethers";
import { useState } from "react";
import type { NextPage } from "next";
import styles from "../styles/Theme.module.css";

// Put Your Edition Drop Contract address from the dashboard here
const myEditionDropContractAddress =
  "0xF2aECeE06841F0Cc984aB8d7dE5B1e9106890FDC";

// Put your token ID here
const tokenId = 2;
const tokenId2 = 3;
const tokenId3 = 4;
const url2 = "https://obyclabs.com/"
const url3 = "https://opensea.io/collection/obyc-hazmat-division"

const Home: NextPage = () => {
  const { contract: editionDrop } = useContract(myEditionDropContractAddress);

  // The amount the user claims, updates when they type a value into the input field.
  const [quantity, setQuantity] = useState<number>(1); // default to 1

  // Load contract metadata
  const { data: contractMetadata } = useContractMetadata(editionDrop);

  // Load the NFT metadata
  //xconst { data: nftMetadata } = useNFT(editionDrop, tokenId);

  // Load the active claim condition
  const { data: activeClaimCondition } = useActiveClaimCondition(
    editionDrop,
    BigNumber.from(tokenId & tokenId2)
  );

  // Loading state while we fetch the metadata
  if (!editionDrop || !contractMetadata) {
    return <div className={styles.container}>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.mintInfoContainer}>
        <div className={styles.infoSide}>
          {/* Title of your NFT Collection */}
          <h1>{contractMetadata?.name}</h1>
          {/* Description of your NFT Collection */}
          <p className={styles.description}>{contractMetadata?.description}</p>
        </div>

        <div className={styles.imageSide}>
          {/* Image Preview of NFTs */}
          <img
            className={styles.image}
            src={"logo.png"}
            alt={`${"logo.png"} preview image`}
          />

          {/* Amount claimed so far */}
          <div className={styles.mintCompletionArea}>
            <div className={styles.mintAreaLeft}>
              <p>Total Minted</p>
            </div>
            <div className={styles.mintAreaRight}>
              {activeClaimCondition ? (
                <p>
                  {/* Claimed supply so far */}
                  <h5>OBYC Holder Mint</h5>
                  <b>{"464"}</b>
                  {" / "}
                  {"1K"}
                </p>
              ) : (
                // Show loading state if we're still loading the supply
                <p>Loading...</p>
              )}
            </div>
          </div>

          {/* Show claim button or connect wallet button */}
          <>
            <p> *NOTE: Updating Qty will update all Lab Items. After selecting Qty only the Lab Item selected will be minted!
              <div></div>
              <p></p>

              <div></div>
              <div></div>
              <h3>Mint Price 0.05Ξ</h3>
              <div>Quantity</div>
            </p>
            <div className={styles.quantityContainer}>
              <button
                className={`${styles.quantityControlButton}`}
                onClick={() => setQuantity(quantity - 1)}
                disabled={quantity <= 1}
              >
                -
              </button>

              <h4>{quantity}</h4>

              <button
                className={`${styles.quantityControlButton}`}
                onClick={() => setQuantity(quantity + 1)}
                disabled={
                  quantity >=
                  parseInt(
                    activeClaimCondition?.quantityLimitPerTransaction || "0"
                  )
                }
              >
                +
              </button>


            </div>
            <p></p>

            <p></p>
            <h4>Mint L2 Toxic Salmon Barrel</h4>
            <div className={styles.mintContainer}>
              <Web3Button
                contractAddress={myEditionDropContractAddress}
                action={async (contract) =>
                  await contract.erc1155.claim(tokenId, quantity)
                }
                // If the function is successful, we can do something here.
                onSuccess={(_result) => window.open(url3, "_blank")}
                // If the function fails, we can do something here.
                onError={(error) => alert(error?.message)}
                accentColor="#060606"
                colorMode="dark"
                className="botonMint"
              >
                Mint L2 Toxic Salmon Barrel |
                Qty:{quantity}{quantity > 1 ? "s" : ""}
              </Web3Button>
              <p></p>


              <h4>Mint L2 Nanobot</h4>
              <Web3Button
                contractAddress={myEditionDropContractAddress}
                action={async (contract) =>
                  await contract.erc1155.claim(tokenId2, quantity)
                }
                // If the function is successful, we can do something here.
                onSuccess={(_result) => window.open(url3, "_blank")}
                // If the function fails, we can do something here.
                onError={(error) => alert(error?.message)}
                accentColor="#060606"
                colorMode="dark"
                className="botonMint"
              >
                Mint L2 Nanobot |
                Qty:{quantity}{quantity > 1 ? "s" : ""}
              </Web3Button>
              <p></p>


              <h4>Bio-Infused Honey Bid Coming Soon</h4>
              <Web3Button
                contractAddress={myEditionDropContractAddress}
                action={async (contract) =>
                  await contract.erc1155.claim(tokenId3, quantity)
                }
                // If the function is successful, we can do something here.
                onSuccess={(_result) => window.open(url3, "_blank")}
                // If the function fails, we can do something here.
                onError={(error) => alert(error?.message)}
                accentColor="#060606"
                colorMode="dark"
                className="botonMint"
              >
                Bio-Infused Honey Bid Coming Soon
              </Web3Button>


            </div>
          </>
        </div>
      </div>
      {/* Powered by OBYC Labs */}{" "}
      <img
        src={`/obyclabs.png`}
        alt="OBYC Logo"
        width={135}
        className={styles.buttonGapTop}
        onClick={() => window.open(url2, "_blank")}
      />
    </div>
  );
};

export default Home;