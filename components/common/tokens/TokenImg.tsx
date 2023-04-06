import { NextPage } from 'next'
import styles from "../../../styles/Theme.module.css";

interface IProps {
  tokenId: number,
  imageUrl?: string,
  selectedToken: any,
  type: string,
  setToken: (tokenid: any) => void
}
const TokenImg: NextPage<IProps> = ({ tokenId, imageUrl, setToken, selectedToken, type }) => {

  const dimention = type == 'obyc' ? '100px' : "150px"


  const handleClick = () => {
    // console.log(tokenId,'tpokeneada')
    setToken(tokenId)
  }

  return (
    <div>
      <img
        className={selectedToken == tokenId ? styles.selectedBorder : ''}
        onClick={handleClick}
        src={type == 'obyc' ? `https://obyc.mypinata.cloud/ipfs/QmaGv9ihX3ey3W958H64e1ZvXeFs4cs655xH5xY5xZuibD/${tokenId}.png` :
          `https://obyc.mypinata.cloud/ipfs/QmTpD7Dxr6eKzRBiXnFupZ9KGYBbiCjG7eqwGhnqWcyXCX/${tokenId}.jpg`}
        alt='obyc'
        style={{ height: dimention, width: dimention }}
      />
    </div>
  );
};

export default TokenImg;
