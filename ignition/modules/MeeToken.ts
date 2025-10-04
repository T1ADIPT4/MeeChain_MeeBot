import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("MeeTokenModule", (m) => {
  const meeToken = m.contract("MeeToken", []);

  return { meeToken };
});
