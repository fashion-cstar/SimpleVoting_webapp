import React, { useContext, useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import Web3 from 'web3'
import { config, ABI, VotingFactoryAddress, ProviderUrl } from 'config'
import { IContract } from 'types'
import { Contract } from 'web3-eth-contract'

export interface IContractContext {
  web3: Web3
  votingFactoryContract: IContract
}

const ContractContext = React.createContext<Maybe<IContractContext>>(null)

const defaultWeb3 = new Web3((window as any).ethereum || ProviderUrl[config.networkId])

export const ContractProvider = ({ children = null as any }) => {
  const { library } = useWeb3React()

  const [web3, setWeb3] = useState<Web3>(defaultWeb3)
  const [votingFactoryContract, setVotingFactoryContract] = useState<Contract>(
    new defaultWeb3.eth.Contract(ABI.votingFactoryAbi as any, VotingFactoryAddress[config.networkId])
  )

  useEffect(() => {
    const web3Obj = new Web3(Web3.givenProvider);
    setWeb3(web3Obj)
    setVotingFactoryContract(
      new web3Obj.eth.Contract(ABI.votingFactoryAbi as any, VotingFactoryAddress[config.networkId])
    )
  }, [library])

  return (
    <ContractContext.Provider
      value={{
        web3,
        votingFactoryContract: {
          contract: votingFactoryContract,
          address: VotingFactoryAddress[config.networkId] ?? '',
        }
      }}
    >
      {children}
    </ContractContext.Provider>
  )
}

export const useContracts = () => {
  const context = useContext(ContractContext)

  if (!context) {
    throw new Error('Component rendered outside the provider tree')
  }

  return context
}
