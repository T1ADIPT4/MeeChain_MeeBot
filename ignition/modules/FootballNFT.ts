import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("FootballNFTModule", (m) => {
  const name = m.getParameter("name", "MeeChain Football NFT");
  const symbol = m.getParameter("symbol", "MEEFOOT");
  
  const footballNFT = m.contract("FootballNFT", [name, symbol]);

  return { footballNFT };
});
