import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("MeeBadgeNFTModule", (m) => {
  const meeBadgeNFT = m.contract("MeeBadgeNFT", []);

  return { meeBadgeNFT };
});
