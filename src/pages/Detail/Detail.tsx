/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableRow,
  FormControl,
  RadioGroup,
  FormLabel,
  Radio,
  FormControlLabel
} from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { useProcessing, useVotingFactory, useWallet } from 'contexts'
import { useHistory } from 'react-router-dom'
import { OptionInfo, PollInfo, VotingPoll } from 'types'
import { toast } from 'react-toastify'

interface IVotingItem {
  index: number
  info: VotingPoll
}

export const Detail = ({ pollId }: { pollId: number }) => {
  const history = useHistory()
  const { votingPollList, userVote, updatePollInfo } = useVotingFactory()
  const [info, setInfo] = useState<VotingPoll>()
  const { setProcessing } = useProcessing()
  const [loading, setLoading] = useState(false)
  const [selectedOption, setSelectOption] = useState(-1)
  const { account } = useWallet()
  const [pollInfo, setPollInfo] = useState<PollInfo>()

  useEffect(() => {
    setProcessing(loading)
  }, [loading])

  const handleVote = async () => {
    setLoading(true)
    if (info) {
      let res = await userVote(
        info,
        selectedOption
      )
      if (res) {
        await updatePollInfo(info)
        toast.success('You have been voted successfully')
      }
    }
    setLoading(false)
  }

  useEffect(() => {
    const fetch = async () => {
      if (info) setPollInfo(await updatePollInfo(info))
    }
    setLoading(true)
    fetch()
    setLoading(false)
  }, [info])

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectOption(Number((event.target as HTMLInputElement).value));
  };

  useEffect(() => {
    setInfo(votingPollList.find((item) => item.pollId === pollId))
  }, [pollId, votingPollList])

  return (
    <>
      {info && <p>{info?.title}</p>}
      <div className='w-full flex justify-center py-2 mt-1 mb-4'>
        {info && pollInfo && <>
          {pollInfo.userVotedNo <= 0 ?
            <div className='flex justify-center items-center gap-12'>
              <FormControl>
                <FormLabel id="demo-radio-buttons-group-label">Select Option:</FormLabel>
                <RadioGroup
                  aria-labelledby="demo-radio-buttons-group-label"
                  value={selectedOption}
                  name="radio-buttons-group"
                  onChange={handleOptionChange}
                >
                  {
                    pollInfo.options.map((option: OptionInfo, index) => {
                      return (
                        <FormControlLabel value={option.optionId} control={<Radio />} label={option.name} key={index} />
                      )
                    })
                  }
                </RadioGroup>
              </FormControl>
              <Button
                color="primary"
                variant="contained"
                disabled={selectedOption < 0 || !account}
                onClick={() => {
                  handleVote()
                }}
                style={{ height: '40px' }}
              >
                Vote
              </Button>
            </div>
            :
            <Table style={{ maxWidth: '600px' }}>
              <TableBody>
                {pollInfo.options.map((option, index) => {
                  return (
                    <TableRow key={index}>
                      <TableCell style={{ textAlign: 'left', backgroundColor: pollInfo.userVotedNo == (option.optionId + 1) ? '#eeeeff' : '' }}>
                        <span className={`text-[16px] font-normal`}>{option.name}</span>
                      </TableCell>
                      <TableCell style={{ textAlign: 'left', backgroundColor: pollInfo.userVotedNo == (option.optionId + 1) ? '#eeeeff' : '' }}>
                        <span className={`text-[18px] font-semibold `}>{option.voteResult}</span>
                      </TableCell>
                    </TableRow>
                  )
                })
                }
              </TableBody>
            </Table>
          }
        </>}
      </div>
    </>
  )
}
