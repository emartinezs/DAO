import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/dist/types"
import { ethers } from "hardhat"

const deploxBox: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { getNamedAccounts, deployments } = hre
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    log("Deploying Box...")
    const box = await deploy("Box", {
        from: deployer,
        args: [],
        log: true,
        waitConfirmations: 1,
    })

    const timeLock = await ethers.getContract("TimeLock")
    const boxContract = await ethers.getContractAt("Box", box.address)
    const transferOwnerTx = await boxContract.transferOwnership(timeLock.address)
    await transferOwnerTx.wait(1)
}

export default deploxBox
