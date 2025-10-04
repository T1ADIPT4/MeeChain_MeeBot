import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import MeeTokenModule from "./MeeToken";
import MeeBadgeNFTModule from "./MeeBadgeNFT";
import FootballNFTModule from "./FootballNFT";

export default buildModule("QuestManagerModule", (m) => {
  const { meeToken } = m.useModule(MeeTokenModule);
  const { meeBadgeNFT } = m.useModule(MeeBadgeNFTModule);
  const { footballNFT } = m.useModule(FootballNFTModule);

  const questManager = m.contract("QuestManager", [meeToken, meeBadgeNFT, footballNFT]);

  return { questManager, meeToken, meeBadgeNFT, footballNFT };
});
