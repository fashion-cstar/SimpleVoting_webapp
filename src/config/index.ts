import votingFactoryAbi from '../abi/votingFactoryAbi.json'
import votingPollAbi from '../abi/votingPollAbi.json'
import { AbstractConnector } from '@web3-react/abstract-connector'
import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { WalletLinkConnector } from '@web3-react/walletlink-connector'

export enum ChainId {
  Mainnet = 1,
  Rinkeby = 4,
  Ropsten = 3
}

export const uniChainName: { [chainId in ChainId]?:string} = {
  [ChainId.Mainnet]: "mainnet",
  [ChainId.Rinkeby]: "rinkeby",
  [ChainId.Ropsten]: "ropsten",
}

export const config = {
  networkId: ChainId.Ropsten
  // networkId: ChainId.Rinkeby
}

export const ABI = {
  votingFactoryAbi,
  votingPollAbi
}

export const VotingFactoryAddress: { [chainId in ChainId]?: string } = {
  [ChainId.Mainnet]: "",
  [ChainId.Rinkeby]: "0x7dcbec2220BCa7e6321DCBdEB13E43D8ae8bfc17",
  [ChainId.Ropsten]: "0x2d9176816ad1bfD9C4b696B7584F3204F23D766f"
}

export const NetworkName: { [chainId in ChainId]?: string } = {
  [ChainId.Mainnet]: "Ethereum Mainnet",
  [ChainId.Rinkeby]: "Rinkeby Testnet",
  [ChainId.Ropsten]: "Ropsten Testnet"
}

export const ProviderUrl: { [chainId in ChainId]?: string } = {
  [ChainId.Mainnet]: `https://mainnet.infura.io/v3/${process.env.REACT_APP_ETH_RPC_KEY}`,
  [ChainId.Rinkeby]: `https://rinkeby.infura.io/v3/${process.env.REACT_APP_ETH_RPC_KEY}`,
  [ChainId.Ropsten]: `https://ropsten.infura.io/v3/${process.env.REACT_APP_ETH_RPC_KEY}`
}

export interface WalletInfo {
  connector?: AbstractConnector
  name: string
  iconName: string
  description: string
  href: string | null
  color: string
  primary?: true
  mobile?: true
  mobileOnly?: true
}
export const injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4]
})

export const walletconnect = new WalletConnectConnector({
  rpc: {
    1: ProviderUrl[ChainId.Mainnet] ?? '',
    4: ProviderUrl[ChainId.Rinkeby] ?? '',
    3: ProviderUrl[ChainId.Ropsten] ?? '',
  },
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true
})

export const walletlink = new WalletLinkConnector({
  url: ProviderUrl[config.networkId] ?? '',
  appName: 'Uniswap',
  appLogoUrl:
    'https://mpng.pngfly.com/20181202/bex/kisspng-emoji-domain-unicorn-pin-badges-sticker-unicorn-tumblr-emoji-unicorn-iphoneemoji-5c046729264a77.5671679315437924251569.jpg'
})

export const SUPPORTED_WALLETS: { [key: string]: WalletInfo } = {
  METAMASK: {
    connector: injected,
    name: 'MetaMask',
    iconName: 'metamask.png',
    description: 'Easy-to-use browser extension.',
    href: null,
    color: '#E8831D'
  },
  WALLET_CONNECT: {
    connector: walletconnect,
    name: 'WalletConnect',
    iconName: 'walletConnectIcon.svg',
    description: 'Connect to Trust Wallet, Rainbow Wallet and more...',
    href: null,
    color: '#4196FC',
    mobile: true
  }
}