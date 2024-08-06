/* global ethers */
/* eslint prefer-const: "off" */

async function deployFacetRegistry() {
  const gasPrice = (await ethers.provider.getFeeData()).gasPrice;
  console.log('gasPrice:', gasPrice);
  const accounts = await ethers.getSigners();
  console.log('accounts:', accounts);
  const contractOwner = accounts[0];
  const deployGasParams = {
    gasLimit: 4200000,
    maxFeePerGas: (gasPrice * 12n) / 10n,
  };

   // deploy GpsStatementVerifier
   /**
    * -----Sepolia  ---------------
    * https://sepolia.etherscan.io/address/0xf56da225ec19fb33efb3788f1f230782a5048e92
    * 
        Arg [0] : bootloaderProgramContract (address): 0xf356ff7ac747327eae51bf22014e77f728a8e905
        Arg [1] : memoryPageFactRegistry_ (address): 0x0d71ee5b9e16db3f6e20121a68535df9433794af
        Arg [2] : cairoVerifierContracts (address[]): [
                  "0x1e2c1F5D7a2b96051a4db01f7aB73418347F1199",
                  "0xF6bAe46aA71e5207c1A981b227c04598772372e0",
                  "0xa42ef0e446df9eae607b3219567c34f5a747656e",
                  "0x54864f841c2445e1bfa7ec17e5b160a53ad70b2f",
                  "0x4454c51336189d9a5f1bf30b86693c57e317a2c1",
                  "0x8543ca0e9994058b150bf306f6840915d98adbda",
                  "0xa60978cf874ca52e3802f967f49cc76362ebc114",
                  "0x9df59eda1afd6c1e21718242878c4f664ee7e888"
                ];
        Arg [3] : hashedSupportedCairoVerifiers (uint256): 
        Arg [4] : simpleBootloaderProgramHash (uint256): 
        Arg [5] : referenceVerifier (address): 0x0000000000000000000000000000000000000000
        Arg [6] : referralDurationSeconds (uint256): 7798272
    */
  const bootloaderProgramContract = "0xf356ff7ac747327eae51bf22014e77f728a8e905";
  const memoryPageFactRegistry_ = "0x0d71ee5b9e16db3f6e20121a68535df9433794af";
  const cairoVerifierContracts = [
      "0x1e2c1F5D7a2b96051a4db01f7aB73418347F1199",
      "0xF6bAe46aA71e5207c1A981b227c04598772372e0",
      "0xa42ef0e446df9eae607b3219567c34f5a747656e",
      "0x54864f841c2445e1bfa7ec17e5b160a53ad70b2f",
      "0x4454c51336189d9a5f1bf30b86693c57e317a2c1",
      "0x8543ca0e9994058b150bf306f6840915d98adbda",
      "0xa60978cf874ca52e3802f967f49cc76362ebc114",
      "0x9df59eda1afd6c1e21718242878c4f664ee7e888"
    ];
  const hashedSupportedCairoVerifiers =BigInt("0x058e3ba2823801572d1cb4908bae7ffe408b4cb778f352dc5c52a8e4c2c29fd0");
  const simpleBootloaderProgramHash = BigInt("0x00d875840ac697dbeedb3d4c8f2a61889bc1d5f1af91e67a7cc7360e8faf35bf");
  const referenceVerifier = "0x0000000000000000000000000000000000000000";
  const referralDurationSeconds = 7798272;
  const GpsStatementVerifier = await ethers.getContractFactory('GpsStatementVerifier');
  const gpsStatementVerifier = await GpsStatementVerifier.deploy(   
    bootloaderProgramContract,
    memoryPageFactRegistry_,
    cairoVerifierContracts,
    hashedSupportedCairoVerifiers,
    simpleBootloaderProgramHash,
    referenceVerifier,
    referralDurationSeconds,
    deployGasParams);
  console.log('Deploy GpsStatementVerifier Transaction hash:', gpsStatementVerifier.deploymentTransaction().hash);
  await gpsStatementVerifier.waitForDeployment();
  console.log('GpsStatementVerifier deployed:', gpsStatementVerifier.target);

  //deploy CallProxy
  const CallProxy = await ethers.getContractFactory('CallProxy');
  const callProxy = await CallProxy.deploy(deployGasParams);
  console.log('Deploy CallProxy Transaction hash:', callProxy.deploymentTransaction().hash);
  await callProxy.waitForDeployment();
  console.log('CallProxy deployed:', callProxy.target);

  // deploy Proxy
  const Proxy = await ethers.getContractFactory('Proxy');
  const proxy = await Proxy.deploy(1000, deployGasParams);
  console.log('Deploy Proxy Transaction hash:', proxy.deploymentTransaction().hash);
  await proxy.waitForDeployment();
  console.log('Proxy deployed:', proxy.target);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
if (require.main === module) {
  deployFacetRegistry()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

exports.deployFacetRegistry = deployFacetRegistry;
