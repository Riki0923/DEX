const Link = artifacts.require("Link");
const Wallet = artifacts.require("Wallet");

module.exports = function (deployer) {
  deployer.deploy(Link);
};

