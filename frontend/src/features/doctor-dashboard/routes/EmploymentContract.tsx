import {
  acceptEmploymentContract,
  getDoctor,
  rejectEmploymentContract,
} from '@/api/doctor'
import { CardPlaceholder } from '@/components/CardPlaceholder'
import { useAuth } from '@/hooks/auth'
import { Button, CardActions, List, ListItem, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { ContractStatus } from 'clinic-common/types/doctor.types'
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import Title from '../components/Title'

export function EmploymentContract() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { refreshUser } = useAuth()
  const query = useQuery({
    queryKey: ['doctor', user!.username],
    queryFn: () => getDoctor(user!.username),
    enabled: !!user,
  })

  if (query.isLoading) {
    return <CardPlaceholder />
  }

  const isContractAccepted =
    query.data?.contractStatus === ContractStatus.Accepted

  function handleAccept() {
    const promise = acceptEmploymentContract().then(() => {
      query.refetch()
      navigate(`/doctor-dashboard`)
    })
    toast.promise(promise, {
      pending: 'Loading',
      success: 'Congrats, You are now a doctor in our system ',
      error: 'error',
    })

    refreshUser()
  }

  function handleReject() {
    const promise = rejectEmploymentContract().then(() => {
      query.refetch()
    })
    toast.promise(promise, {
      pending: 'Loading',
      success: 'Your employment contract is rejected succefully ',
      error: 'error',
    })
    refreshUser()
  }

  return (
    <>
      <ToastContainer />

      <Title>Employment Contract</Title>
      <Typography variant="body1">
        This contract is made and entered into between:
      </Typography>
      <List>
        <ListItem>
          <strong>Clinic, </strong> El7a2ni.
        </ListItem>
        <ListItem>
          <strong>{query.data?.name}, </strong> a licensed physician with a
          practice at El7a2ni clinic in {query.data?.speciality} departement.
        </ListItem>
      </List>
      <Typography variant="body1">
        The term of this contract shall be for a period of{' '}
        <strong>{query.data?.employmentContract.at(4)?.slice(17)}</strong>
      </Typography>
      <List>
        <ListItem>
          <strong>Doctor fees per hour:</strong> {query.data?.hourlyRate} E£
        </ListItem>
        <ListItem>
          <strong>Clinic Markup : </strong>{' '}
          {query.data?.employmentContract.at(2)?.slice(13)}
        </ListItem>
      </List>
      <Typography variant="body1">
        This contract constitutes the entire agreement between the parties and
        supersedes all prior or contemporaneous communications, representations,
        or agreements, whether oral or written.
      </Typography>

      {/* <Card variant="outlined">
        <CardContent>
          <Stack spacing={2}>
            <Stack
              direction="row"
              spacing={1}
              justifyContent="space-between"
              alignItems="center"
            >
              <Title>Your Employment Contract</Title>
            </Stack>
            <Stack spacing={1}>
              {query.data?.employmentContract.map((field) => (
                <Typography variant="body1">{field}</Typography>
              ))}
            </Stack>
          </Stack>
              </CardContent>*/}
      {!isContractAccepted && (
        <CardActions>
          <Button
            size="small"
            variant="contained"
            color="success"
            onClick={() => {
              handleAccept()
            }}
          >
            accept
          </Button>
          <Button
            size="small"
            variant="contained"
            color="error"
            disabled={query.data?.contractStatus === ContractStatus.Rejected}
            onClick={() => {
              handleReject()
            }}
          >
            reject
          </Button>
        </CardActions>
      )}
    </>
  )
}
