import { getHealthPackages } from '@/api/healthPackages'
import { CardPlaceholder } from '@/components/CardPlaceholder'

import { useQuery } from '@tanstack/react-query'

export function HealthPackages() {
  const query = useQuery({
    queryKey: ['health-packages'],
    queryFn: () => getHealthPackages(),
  })
  if (query.isLoading) {
    return <CardPlaceholder />
  }
  if (query.isError) {
    return <h1>error</h1>
  }
}
