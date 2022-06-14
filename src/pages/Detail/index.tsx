/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { Detail } from './Detail'
import { useHistory, useParams } from 'react-router'
import { useVotingFactory } from 'contexts'
import { Button } from '@material-ui/core'

export const VotingDetail = () => {
  const { voteId } = useParams<{ voteId: string }>()
  const history = useHistory()
  const { votingPollList } = useVotingFactory()
  const [pollId, setPollId] = useState(-1)

  useEffect(() => {
    const index = votingPollList.findIndex((item) => item.pollId === Number(voteId))
    if (index < 0) history.push('/')
    else setPollId(index)    
  }, [votingPollList, voteId])

  return (
    <div className="w-full flex justify-center py-8 md:px-6 lg:px-8 xl:px-16 2xl:px-[124px]">
      <div className='w-full max-w-[1620px] flex flex-col items-center gap-4 rounded-[20px] bg-white shadow-xl py-8 px-6'>
        <div className='w-full flex justify-end'>
          <div className='px-8 py-4'>
            <Button
              color="primary"
              variant="contained"
              onClick={() => {
                history.push('/')
              }}
            >
              {`<- go back`}
            </Button>
          </div>
        </div>
        <Detail pollId={pollId} />
      </div>
    </div>
  )
}
