import {
  acceptEmploymentContract,
  getDoctor,
  rejectEmploymentContract,
} from '@/api/doctor'
import { CardPlaceholder } from '@/components/CardPlaceholder'
import { useAuth } from '@/hooks/auth'
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Stack,
  Typography,
} from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { ContractStatus } from 'clinic-common/types/doctor.types'
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'

export function EmploymentContract() {
  const navigate = useNavigate()
  const { user } = useAuth()
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
  }

  return (
    <>
      <ToastContainer />
      <Card variant="outlined">
        <CardContent>
          <Stack spacing={2}>
            <Stack
              direction="row"
              spacing={1}
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h6" color="text.secondary">
                Your Employment Contract
              </Typography>
            </Stack>
            <Stack spacing={1}>
              {query.data?.employmentContract.map((field) => (
                <Typography variant="body1">{field}</Typography>
              ))}
            </Stack>
          </Stack>
        </CardContent>
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
      </Card>
    </>
  )
}
