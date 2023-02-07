import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/dist/types"
import { MIN_DELAY } from "../helper-hardhat-config"

const deployTimeLock: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { getNamedAccounts, deployments } = hre
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    log("Deploying Timelock...")
    const timeLock = await deploy("TimeLock", {
        from: deployer,
        args: [MIN_DELAY, [], []],
        log: true,
        waitConfirmations: 1,
    })
}

export default deployTimeLock
