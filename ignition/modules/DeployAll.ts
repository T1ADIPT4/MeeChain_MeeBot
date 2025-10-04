import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import MeeTokenModule from "./MeeToken";
import MeeBadgeNFTModule from "./MeeBadgeNFT";
import FootballNFTModule from "./FootballNFT";
import MembershipNFTModule from "./MembershipNFT";
import QuestManagerModule from "./QuestManager";
import BadgeNFTUpgradeModule from "./BadgeNFTUpgrade";

export default buildModule("DeployAllModule", (m) => {
  const { meeToken } = m.useModule(MeeTokenModule);
  const { meeBadgeNFT } = m.useModule(MeeBadgeNFTModule);
  const { footballNFT } = m.useModule(FootballNFTModule);
  const { membershipNFT } = m.useModule(MembershipNFTModule);
  const { questManager } = m.useModule(QuestManagerModule);
  const { badgeNFTUpgrade } = m.useModule(BadgeNFTUpgradeModule);

  m.call(meeToken, "authorizeMinter", [questManager]);
  m.call(meeBadgeNFT, "authorizeMinter", [questManager]);
  m.call(footballNFT, "authorizeMinter", [questManager]);

  return {
    meeToken,
    meeBadgeNFT,
    footballNFT,
    membershipNFT,
    questManager,
    badgeNFTUpgrade
  };
});
