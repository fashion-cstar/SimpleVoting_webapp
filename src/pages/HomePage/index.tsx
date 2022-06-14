/* eslint-disable react-hooks/exhaustive-deps */
import { Redirect, Route } from 'react-router-dom'
import { VotingPollsTable } from './VotingPollsTable'

export const VotingPolls = () => {

  return (
    <div className="w-full flex justify-center py-8 md:px-6 lg:px-8 xl:px-16 2xl:px-[124px]">
      <div className='w-full max-w-[1620px] flex flex-col items-center gap-4 rounded-[20px] bg-white shadow-xl py-8 px-6'>
        <VotingPollsTable />
      </div>
    </div>
  )
}
