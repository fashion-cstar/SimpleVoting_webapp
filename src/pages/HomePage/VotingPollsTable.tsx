/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@material-ui/core'
import { useVotingFactory } from 'contexts'
import { useWallet } from 'contexts'
import { useHistory } from 'react-router-dom'
import { OptionInfo, VotingPoll } from 'types'
import { formatEther, getShortWalletAddress } from 'utils'
import { AddVotingPoll } from './AddVotingPoll'

interface IVotingItem {
  index: number
  info: VotingPoll
}

const PollItem: React.FC<IVotingItem> = ({ index, info }) => {
  const history = useHistory()
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  const handleClickPoll = () => {    
    history.push(`/${info.pollId}`)    
  }

  return (
    <TableRow key={index} style={{cursor:'pointer', backgroundColor: isHovering?'#eeffff':''}} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={handleClickPoll}>
      <TableCell style={{ textAlign: 'right', fontSize:'16px' }}>{(index + 1)}</TableCell>
      <TableCell style={{ textAlign: 'center', fontSize:'16px' }}>{info.title}</TableCell>
      <TableCell style={{ textAlign: 'center', fontSize:'16px' }}>{getShortWalletAddress(info.pollContract.address)}</TableCell>
      {/* <TableCell
        className='flex justify-between items-center'
        style={{ textAlign: 'left' }}
      >
        {
          info.options.map((option: OptionInfo, index) => {
            return (
              <p className='my-2 text-[16px]' key={index}>{option.name}</p>
            )
          })
        }
      </TableCell> */}
    </TableRow>
  )
}

export const VotingPollsTable = () => {
  const history = useHistory()
  const { account } = useWallet()
  const { votingPollList } = useVotingFactory()
  const [isOpenAddPoll, setIsOpenAddPoll] = useState(false)

  const handleOpenAddType = () => {
    setIsOpenAddPoll(true)
  }

  const handleCloseAddType = () => {
    setIsOpenAddPoll(false)
  }

  return (
    <div className='w-full'>

      <div className='w-full'>
        <div className='w-full flex items-center justify-end'>
          <Button
            color="primary"
            variant="contained"
            disabled={!account}
            onClick={() => {
              handleOpenAddType()
            }}
          >
            Create VotingPoll
          </Button>
        </div>

        <AddVotingPoll handleClose={handleCloseAddType} isOpen={isOpenAddPoll} />

        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ textAlign: 'right' }}>
                <b>No</b>
              </TableCell>
              <TableCell style={{ textAlign: 'center' }}>
                <b>Title</b>
              </TableCell>
              <TableCell style={{ textAlign: 'center' }}>
                <b>Poll Address</b>
              </TableCell>
              {/* <TableCell style={{ textAlign: 'left' }}>
                <b>Options</b>
              </TableCell> */}
            </TableRow>
          </TableHead>

          <TableBody>
            {votingPollList.map((info, index) => (
              <PollItem index={index} info={info} key={index} />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
