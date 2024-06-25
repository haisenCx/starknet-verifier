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
  const GpsStatementVerifier = await ethers.getContractFactory('GpsStatementVerifier');
  const gpsStatementVerifier = await GpsStatementVerifier.deploy(deployGasParams);
  console.log('Deploy GpsStatementVerifier Transaction hash:', gpsStatementVerifier.deploymentTransaction().hash);
  await gpsStatementVerifier.waitForDeployment();
  console.log('GpsStatementVerifier deployed:', gpsStatementVerifier.target);

  // deploy CallProxy
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
