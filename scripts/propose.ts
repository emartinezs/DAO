import { ethers, network } from "hardhat"
import {
    NEW_STORE_VALUE,
    FUNC,
    PROPOSAL_DESCRIPTION,
    developmentChains,
    VOTING_DELAY,
    proposalsFile,
} from "../helper-hardhat-config"
import { moveBlocks } from "../utils/move-blocks"
import fs from "fs"
import { networkInterfaces } from "os"

export async function propose(functionToCall: string, args: any[], proposalDescription: string) {
    const governor = await ethers.getContract("GovernorContract")
    const box = await ethers.getContract("Box")

    const encodedFunctionCall = box.interface.encodeFunctionData(functionToCall, args)
    console.log(`Proposing ${functionToCall} on ${box.address} with ${args}`)
    console.log(`Proposal description: \n ${proposalDescription}`)
    const proposeTx = await governor.propose(
        [box.address],
        [0],
        [encodedFunctionCall],
        proposalDescription
    )
    const proposeReceipt = await proposeTx.wait(1)

    if (developmentChains.includes(network.name)) {
        await moveBlocks(VOTING_DELAY + 1)
    }

    const proposalId = proposeReceipt.events[0].args.proposalId
    let proposals = JSON.parse(fs.readFileSync(proposalsFile, "utf8"))
    const chainId = network.config.chainId!.toString()
    if (!(chainId in proposals)) {
        proposals[chainId] = []
    }
    proposals[chainId].push(proposalId.toString())

    fs.writeFileSync(proposalsFile, JSON.stringify(proposals))
}

propose(FUNC, [NEW_STORE_VALUE], PROPOSAL_DESCRIPTION)
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error)
        process.exit(1)
    })
