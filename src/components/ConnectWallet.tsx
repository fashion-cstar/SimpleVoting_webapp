/* eslint-disable react-hooks/exhaustive-deps */
import { Button } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { WalletModal } from './WalletModal'

export const ConnectWallet = ({ width = "227px" }: { width: string }) => {
    const [isOpen, setIsOpen] = useState(false)

    const handleClose = () => {
        setIsOpen(false)
    }
    return (
        <div>
            <WalletModal isOpen={isOpen} handleClose={handleClose} />
            <Button
                color="primary"
                variant="contained"
                onClick={() => setIsOpen(true)}
            >
                Connect Wallet
            </Button>
        </div>
    )
}
