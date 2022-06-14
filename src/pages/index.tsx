import React, { useEffect, useState } from 'react'
import {
  Redirect,
  Route,
  Switch,
  useHistory,
  useLocation,
} from 'react-router-dom'
import { VotingDetail } from './Detail/index'
import { VotingPolls } from './HomePage'

export const Page = () => {
  const location = useLocation()
  const history = useHistory()

  return (
    <div className='w-full flex flex-col items-center mt-6'>

      <div className='w-full'>
        <Switch>
          <Route path="/" component={VotingPolls} />
          <Route path="/:voteId" component={VotingDetail} />
          <Redirect to="/" />
        </Switch>
      </div>
    </div>
  )
}
