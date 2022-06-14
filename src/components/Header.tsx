/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react'
import { useWallet } from 'contexts'
import { getShortWalletAddress } from 'utils'
import { useHistory, useLocation } from 'react-router-dom'
import { ConnectWallet } from './ConnectWallet'

export const Header = () => {
  const history = useHistory()
  const location = useLocation()
  const { connected, account, connect, disconnect } = useWallet()
  return (
    <div className='w-full flex justify-end'>
      <div className='p-8'>
        {connected ? (
          <div className='flex flex-col'>
            <div className='text-[#303030] text-[16px] font-normal'>
              {getShortWalletAddress(account || '')}
            </div>
            <div className='text-[20px] text-black font-normal cursor-pointer py-1' onClick={() => disconnect()}>Disconnect Wallet</div>
          </div>
        ) : (
          <ConnectWallet width="227px" />
        )}
      </div>
    </div>
  )
}
