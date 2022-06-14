/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useContext, useState } from 'react'
import { toast } from 'react-toastify'
import { OptionInfo, PollInfo, VotingPoll } from 'types'
import Web3 from 'web3'
import { config, ABI, VotingFactoryAddress, ProviderUrl } from 'config'
import { IContract } from 'types'
import { useWeb3React } from '@web3-react/core'
import { useContracts } from './contracts'
import { useWallet } from './wallets'

export interface IVotingFactoryContext {
  isCreateAdmin: boolean
  votingPollList: VotingPoll[]
  updatePollInfo: (votePoll: VotingPoll) => Promise<PollInfo>
  updateVotingPollList: () => Promise<void>
  getUserVoted: (index: number) => Promise<number>
  addVotingPoll: (
    title: string,
    options: string[]
  ) => Promise<boolean>
  userVote: (
    info: VotingPoll,
    optionId: number
  ) => Promise<boolean>
}

const VotingFactoryContext = React.createContext<Maybe<IVotingFactoryContext>>(null)

export const VotingFactoryProvider = ({ children = null as any }) => {
  const { votingFactoryContract, web3 } = useContracts()
  const { account } = useWallet()
  const { library } = useWeb3React()
  const [isCreateAdmin, setCreateAdmin] = useState(false)
  const [votingPollList, setVotingPollList] = useState<VotingPoll[]>([])

  useEffect(() => {
    updateAdminInfo()
    updateVotingPollList()
  }, [account])

  const updateAdminInfo = async () => {
    if (account) {
      try {
        const res = await votingFactoryContract.contract.methods
          .isAdmin(account)
          .call()
        setCreateAdmin(res)
      } catch (err) {
        console.error(err)
        setCreateAdmin(false)
      }
    } else {
      setCreateAdmin(false)
    }
  }

  const updatePollInfo = async (votePoll: VotingPoll) => {
    let pollInfo: PollInfo = { options: [], pollId: votePoll.pollId, title: votePoll.title, userVotedNo: 0 }
    try {
      let userVotedNo: number = 0
      let p: OptionInfo[] = []
      let pollOptions = await votePoll.pollContract.contract.methods.getOptions().call()
      if (account) {
        userVotedNo = await votePoll.pollContract.contract.methods.getUserVoted(account).call()
      }
      await Promise.all(pollOptions.map(async (option: string, index: number) => {
        let voteResult = await votePoll.pollContract.contract.methods.getResult(index).call()
        p.push({ name: option, voteResult: voteResult, optionId: index })
      })
      )
      p.sort((a, b) => a.optionId - b.optionId)
      pollInfo.options = p
      pollInfo.pollId = votePoll.pollId
      pollInfo.title = votePoll.title
      pollInfo.userVotedNo = userVotedNo
      return pollInfo
    } catch (e) {
      console.error('get pollInfo error:', e)
      return pollInfo
    }
  }

  const updateVotingPollList = async () => {
    let pollCount = 0
    try {
      pollCount = await votingFactoryContract.contract.methods.getPollsCount().call()
    } catch (err) {
      console.error(err)
    }

    if (Number(pollCount) > 0) {
      const promises = new Array(Number(pollCount))
        .fill(0)
        .map((_, id) =>
          votingFactoryContract.contract.methods.votingPollsList(id).call()
        )
      try {
        let allPolls: VotingPoll[] = []
        await Promise.all(
          new Array(Number(pollCount))
            .fill(0).map(async (_, id) => {
              let item = await votingFactoryContract.contract.methods.votingPollsList(id).call()
              const web3Obj = new Web3(library?.provider || ProviderUrl[config.networkId])
              let pollContract: IContract = {
                contract: new web3Obj.eth.Contract(ABI.votingPollAbi as any, String(item[1])),
                address: String(item[1])
              }
              allPolls.push({
                title: String(item[0]),
                pollId: id,
                pollContract: pollContract
              })
              // allPolls.sort((a, b) => a.pollId - b.pollId)
              // setVotingPollList(allPolls)
            })
        )
        allPolls.sort((a, b) => a.pollId - b.pollId)
        setVotingPollList(allPolls)
      } catch (e) {
        setVotingPollList([])
        console.error('get votingPoll error:', e)
      }
    } else {
      setVotingPollList([])
    }
  }

  const getUserVoted = async (index: number) => {
    try {
      const res = await votingPollList[index].pollContract.contract.methods
        .getUserVoted(account)
        .call()
      return Number(res)
    } catch (err) {
      return 0
      // console.error(err)
    }
    return 0
  }

  const addVotingPoll = async (
    title: string,
    options: string[]
  ) => {
    try {
      await votingFactoryContract.contract.methods
        .newVotingPoll(
          title,
          options
        )
        .send({ from: account })
      await updateVotingPollList()
      toast.success('Added successfully')
      return true
    } catch (error) {
      let err: any = error
      console.error(err)
      toast.error(err.data?.message || err?.message || err)
      return false
    }
  }

  const userVote = async (
    info: VotingPoll,
    optionId: number
  ) => {
    try {
      await info.pollContract.contract.methods
        .voting(
          optionId
        )
        .send({ from: account })      
      return true
    } catch (error) {
      let err: any = error
      console.error(err)
      toast.error(err.data?.message || err?.message || err)
      return false
    }
  }

  return (
    <VotingFactoryContext.Provider
      value={{
        isCreateAdmin,
        votingPollList,
        updatePollInfo,
        updateVotingPollList,
        getUserVoted,
        addVotingPoll,
        userVote
      }}
    >
      {children}
    </VotingFactoryContext.Provider>
  )
}

export const useVotingFactory = () => {
  const context = useContext(VotingFactoryContext)

  if (!context) {
    throw new Error('Component rendered outside the provider tree')
  }

  return context
}
