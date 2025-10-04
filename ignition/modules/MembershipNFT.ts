import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("MembershipNFTModule", (m) => {
  const membershipNFT = m.contract("MembershipNFT", []);

  return { membershipNFT };
});
