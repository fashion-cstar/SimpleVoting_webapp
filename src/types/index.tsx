import { Contract } from 'web3-eth-contract'
import { BigNumber } from 'ethers'

export interface IContract {
  contract: Contract
  address: string
}

export interface OptionInfo {
  name: string
  voteResult: number
  optionId: number
}

export interface VotingPoll {
  title: string
  pollId: number
  pollContract: IContract
}

export interface PollInfo {
  title: string
  pollId: number  
  options: OptionInfo[]
  userVotedNo: number  
}

