import { List, ListItemButton, ListItemText, Typography } from '@mui/material'
import { useAuth } from '@/hooks/auth'
import { useQuery } from '@tanstack/react-query'
import { getDoctorsForPatient } from '@/api/doctor'
import pp1 from '../../../../public/doctors/pp1.jpg'
import pp2 from '../../../../public/doctors/pp2.jpg'
import pp3 from '../../../../public/doctors/pp3.jpg'
import Link from '@mui/material/Link'

export function TopDoctors() {
  const { user } = useAuth()

  const doctorsQuery = useQuery({
    queryKey: ['my-doctors'],
    queryFn: () =>
      getDoctorsForPatient({
        patientUsername: user!.username,
      }),
  })
  const doctorImages = [pp1, pp2, pp3]

  return (
    <>
      <List>
        <div
          style={{
            display: 'flex ',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingBottom: '8px',
          }}
        >
          <h3
            style={{
              marginBottom: '0px',
              marginTop: '0px',
              font: 'bold',
            }}
          >
            Doctors of The Month
          </h3>
          <Link
            href="patient-dashboard/approved-doctors"
            color="primary"
            style={{
              // color: '#646464',
              display: 'flex',
              alignItems: 'center',
              fontSize: '20px',
              marginRight: '8px',
              // textDecoration: 'none',
            }}
          >
            <Typography variant="body1" component="span">
              see all
            </Typography>
          </Link>
        </div>

        {doctorsQuery.data?.slice(0, 3).map((doctor, index) => (
          <ListItemButton
            sx={{
              borderRadius: '12px',
              marginBottom: '8px',
              backgroundColor: 'rgba(0, 0, 0, 0.1)',
            }}
          >
            <ListItemText
              primary={
                <Typography
                  fontWeight="bold"
                  display={'flex'}
                  alignItems={'center'}
                >
                  <img
                    src={doctorImages[index]}
                    alt={doctor.name}
                    style={{
                      marginRight: '15px',
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                    }}
                  />

                  <div>
                    <div>{doctor.name}</div>
                    <div
                      style={{
                        margin: 'auto',
                        display: 'flex',
                        fontWeight: 'normal',
                      }}
                    >
                      {doctor.username}
                    </div>
                  </div>
                </Typography>
              }
            />
          </ListItemButton>
        ))}
      </List>
    </>
  )
}
