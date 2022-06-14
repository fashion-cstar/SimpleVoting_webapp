/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import {    
    Dialog,
    DialogTitle,
    DialogContent
} from '@material-ui/core'
import { AbstractConnector } from '@web3-react/abstract-connector'
import { SUPPORTED_WALLETS } from '../config'
import { useWallet } from 'contexts'
import CloseIcon from '@material-ui/icons/Close'

interface IWalletModal {
    isOpen: boolean
    // selectConnector: (connector: AbstractConnector) => void
    handleClose: () => void
}

export const WalletModal = ({ isOpen, /* selectConnector,*/ handleClose }: IWalletModal) => {
    const { connect } = useWallet()

    const handleSelectWallet = (connector: AbstractConnector | undefined, key:string) => {
        if (connector) connect(connector, key)
    }

    return (
        <div>
            <Dialog
                onClose={() => handleClose()}
                aria-labelledby="customized-dialog-title"
                open={isOpen}                
                PaperProps={{ style: { borderRadius: '24px' } }}
            >
                {/* <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title"> */}
                <DialogTitle>
                    <div className='px-8 md:px-10 pt-8 md:pt-10'>
                        <div className='flex justify-between gap-6 md:gap-10'>
                            <div className='text-[24px] font-semibold text-[#474747]'>Connect a Wallet</div>
                            <div className='cursor-pointer hidden md:block' onClick={handleClose}>
                                <CloseIcon />
                            </div>
                        </div>
                    </div>
                </DialogTitle>
                <DialogContent>
                    <div className='w-full flex flex-col gap-5 px-8 md:px-10 pb-8 md:pb-10'>
                        {Object.keys(SUPPORTED_WALLETS).map(key => {
                            const option = SUPPORTED_WALLETS[key]
                            return (
                                <div key={key} className='w-full flex justify-between items-center px-4 md:px-5 h-[60px] md:h-[67px] bg-white rounded-[12px] cursor-pointer hover:border-slate-400 hover:border' onClick={() => handleSelectWallet(option.connector, key)}>
                                    <div className='text-[18px] font-medium text-[#050025]'>{option.name}</div>
                                    <div>
                                        <img width='35px' src={`./images/wallet/${option.iconName}`} />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
