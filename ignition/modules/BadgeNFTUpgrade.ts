import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import MeeTokenModule from "./MeeToken";
import MeeBadgeNFTModule from "./MeeBadgeNFT";

export default buildModule("BadgeNFTUpgradeModule", (m) => {
  const { meeToken } = m.useModule(MeeTokenModule);
  const { meeBadgeNFT } = m.useModule(MeeBadgeNFTModule);

  const badgeNFTUpgrade = m.contract("BadgeNFTUpgrade", [meeToken, meeBadgeNFT]);

  return { badgeNFTUpgrade, meeToken, meeBadgeNFT };
});
