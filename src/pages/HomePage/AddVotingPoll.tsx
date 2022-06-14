/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import clsx from 'clsx'
import {
  Box,
  Button,
  makeStyles,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Dialog,
  DialogTitle,
  DialogContent
} from '@material-ui/core'
import { useProcessing, useVotingFactory } from 'contexts'
import { useHistory, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import CloseIcon from '@material-ui/icons/Close'

const useStyles = makeStyles(() => ({
  root: {
    width: 500,
    margin: '1rem',
    padding: '1rem',
    boxSizing: 'border-box',
    border: '1px solid black',
    borderRadius: 8,
  },
  flex: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
  },
  row: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: '0.5rem',
    gap: '16px'
  },
  input: {
    width: '100%',
  },
}))

interface IAddVotingPoll {
  isOpen: boolean
  handleClose: () => void
}

export const AddVotingPoll: React.FC<IAddVotingPoll> = ({ isOpen, handleClose }) => {
  const classes = useStyles()
  const history = useHistory()
  const { updateVotingPollList, addVotingPoll } = useVotingFactory()
  const [title, setTitle] = useState('')
  const [options, setOptions] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const { setProcessing } = useProcessing()
  const [optionTitle, setOptionTitle] = useState('')

  useEffect(() => {
    setProcessing(loading)
  }, [loading])


  useEffect(() => {
    setOptions([])
    setTitle('')
  }, [isOpen])

  const handleSubmit = async () => {
    setLoading(true)
    let res = await addVotingPoll(
      title,
      options
    )
    setLoading(false)

    if (res) {
      handleClose()
    }
  }

  const handleAddOption = () => {
    let index = options.findIndex((item) => item === optionTitle)
    if (index >= 0) {
      toast.error("Already added")
      return
    }
    let l = options.map((item) => item)
    l.push(optionTitle)
    setOptions(l)
    setOptionTitle('')
  }

  return (
    <div>
      <Dialog
        onClose={() => loading ? () => { } : handleClose()}
        aria-labelledby="customized-dialog-title"
        open={isOpen}
      >
        <DialogTitle>
          <div className='flex justify-between'>
            <Typography variant="h5">
              Create VotingPoll
            </Typography>
            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-black-400 hover:text-gray-500 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
              onClick={() => loading ? () => { } : handleClose()}>
              <CloseIcon />
            </button>
          </div>
        </DialogTitle>
        <DialogContent>
          <Box className={clsx(classes.root, classes.flex)}>
            <Box className={classes.row}>
              <TextField
                variant="outlined"
                label="VotingPoll Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={loading}
                className={classes.input}
              />
            </Box>

            <Box className={classes.row}>
              <TextField
                variant="outlined"
                label="Option Title"
                value={optionTitle}
                onChange={(e) => setOptionTitle(e.target.value)}
                disabled={loading}
                className={classes.input}
              />
              <div className=''>
                <Button
                  color="primary"
                  variant="contained"
                  disabled={!optionTitle || loading}
                  className={classes.input}
                  onClick={handleAddOption}
                  style={{ width: '160px', height: '45px' }}
                >
                  Add Option
                </Button>
              </div>
            </Box>
            <Box className={classes.row}>
              <FormControl style={{ width: '100%' }}>
                <InputLabel shrink htmlFor="select-options">
                  Added Options
                </InputLabel>
                <Select
                  multiple
                  native
                  label="Added Options"
                  inputProps={{
                    id: 'select-options',
                  }}
                >
                  {options.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box className={classes.row}>
              <Button
                color="primary"
                variant="contained"
                disabled={loading || !title || options.length <= 0}
                className={classes.input}
                onClick={handleSubmit}
                style={{ color: loading ? '#f97316' : '' }}
              >
                {loading ? 'Confirming...' : 'Confirm'}
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  )
}
