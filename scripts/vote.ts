import { developmentChains, proposalsFile, VOTING_PERIOD } from "../helper-hardhat-config"
import fs from "fs"
import { ethers, network } from "hardhat"
import { moveBlocks } from "../utils/move-blocks"

const index = 0

async function vote(proposalIndex: number) {
    const proposals = JSON.parse(fs.readFileSync(proposalsFile, "utf8"))
    const proposalId = proposals[network.config.chainId!.toString()][proposalIndex]
    const governor = await ethers.getContract("GovernorContract")

    //0=Against, 1=For, 2=Abstain
    const voteWay = 1
    const reason = "I like it"
    const voteTxResponse = await governor.castVoteWithReason(proposalId, voteWay, reason)
    await voteTxResponse.wait(1)

    if (developmentChains.includes(network.name)) {
        await moveBlocks(VOTING_PERIOD + 1)
    }
    const state = await governor.state(proposalId)
    console.log("Voting period finished!")
    console.log(`Proposal state: ${state.toString()}`)
}

vote(index)
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error)
        process.exit(1)
    })
