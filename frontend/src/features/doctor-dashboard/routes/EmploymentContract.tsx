import {
  acceptEmploymentContract,
  getDoctor,
  rejectEmploymentContract,
} from '@/api/doctor'
import {
  Card,
  CardContent,
  CardActions,
  List,
  ListItem,
  Typography,
  Button,
  Divider,
} from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ContractStatus } from 'clinic-common/types/doctor.types'
import { useAuth } from '@/hooks/auth'
import { ToastContainer, toast } from 'react-toastify'

import { CardPlaceholder } from '@/components/CardPlaceholder'

export function EmploymentContract() {
  const navigate = useNavigate()
  const { user, refreshUser } = useAuth()

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
    acceptEmploymentContract()
      .then(() => {
        toast.success('Congrats, You are now a doctor in our system')
        refreshUser()
        navigate('/doctor-dashboard')
      })
      .catch(() => {
        toast.error('Error accepting contract')
      })
  }

  function handleReject() {
    rejectEmploymentContract()
      .then(() => {
        toast.success('Your employment contract is rejected successfully')
        refreshUser()
      })
      .catch(() => {
        toast.error('Error rejecting contract')
      })
  }

  return (
    <>
      <ToastContainer />
      <Card
        variant="outlined"
        sx={{ boxShadow: 2, borderRadius: 2, backgroundColor: '#f5f5f5' }}
      >
        <CardContent>
          <Typography variant="h4" align="center" color="primary" gutterBottom>
            <strong>Employment Contract</strong>
          </Typography>
          <Typography variant="body1" gutterBottom>
            This contract is made and entered into between:
          </Typography>
          <List sx={{ mb: 2 }}>
            <ListItem>
              <strong>Clinic, </strong> El7a2ni.
            </ListItem>
            <ListItem>
              <strong>{query.data?.name}, </strong> a licensed physician with a
              practice at El7a2ni clinic in {query.data?.speciality} department.
            </ListItem>
          </List>

          <Typography variant="body1" gutterBottom>
            The parties agree as follows:
          </Typography>
          <Typography variant="body1" gutterBottom>
            The term of this contract shall be for a period of{' '}
            <strong>{query.data?.employmentContract.at(4)?.slice(17)}</strong>
          </Typography>

          <List>
            <ListItem>
              <strong>Doctor fees per hour:</strong> E£ {query.data?.hourlyRate}
            </ListItem>
            <ListItem>
              <strong>Clinic Markup : </strong>
              {query.data?.employmentContract.at(2)?.slice(13)}
            </ListItem>
          </List>
          <Divider light />
          <Typography variant="h6" gutterBottom>
            Doctor's Responsibilities:
          </Typography>
          <List>
            <ListItem>
              The doctor must be available for at least 20 hours per week.
            </ListItem>
            <ListItem>
              The doctor must maintain a professional appearance and attitude at
              all times.
            </ListItem>
            <ListItem>
              The doctor must ethically and professionally treat all patients.
            </ListItem>
            <ListItem>
              The doctor must maintain the confidentiality of all patient
              information.
            </ListItem>
            <ListItem>
              The doctor must maintain a valid license to practice medicine.
            </ListItem>
          </List>
          <Typography variant="body1">
            <strong>
              {' '}
              This contract constitutes the entire agreement between the parties
              and supersedes all prior or contemporaneous communications,
              representations, or agreements, whether oral or written.
            </strong>
          </Typography>
        </CardContent>
        {!isContractAccepted && (
          <CardActions>
            <Button
              variant="contained"
              color="primary"
              startIcon={<CheckIcon />}
              onClick={handleAccept}
            >
              Accept
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<CloseIcon />}
              onClick={handleReject}
            >
              Reject
            </Button>
          </CardActions>
        )}
      </Card>
    </>
  )
}

export default EmploymentContract
