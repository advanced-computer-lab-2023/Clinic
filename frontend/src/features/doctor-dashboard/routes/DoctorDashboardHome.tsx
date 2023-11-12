import { getDoctor } from '@/api/doctor'
import { CardPlaceholder } from '@/components/CardPlaceholder'
import { useAuth } from '@/hooks/auth'
import { useQuery } from '@tanstack/react-query'
import { ContractStatus } from 'clinic-common/types/doctor.types'

export function DoctorDashboardHome() {
  const { user } = useAuth()
  const doctorQuery = useQuery({
    queryFn: () => getDoctor(user!.username),
  })

  if (doctorQuery.isLoading) {
    return <CardPlaceholder />
  }

  return (
    <>
      {doctorQuery.data?.contractStatus === ContractStatus.Pending && (
        <div>
          <h1>
            Your Request is approved please review your employment contract.
          </h1>
        </div>
      )}
      {doctorQuery.data?.contractStatus === ContractStatus.Rejected && (
        <div>
          <h1>Sorry! But You have rejected your employment contract.</h1>
        </div>
      )}
      {doctorQuery.data?.contractStatus === ContractStatus.Accepted && (
        <div>
          <h1>DoctorDashboardHome.</h1>
        </div>
      )}
    </>
  )
}
