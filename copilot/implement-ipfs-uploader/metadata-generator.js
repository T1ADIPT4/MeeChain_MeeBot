const fs = require('fs');

function generate(cid) {
  const data = {
    name: "MeeBot Badge",
    description: "Badge for milestone completion",
    image: `ipfs://${cid}`,
    attributes: [{ trait_type: "Milestone", value: "M5" }]
  };
  fs.writeFileSync('./metadata/badge.json', JSON.stringify(data, null, 2));
  console.log("✅ Metadata generated");
}

module.exports = { generate };
