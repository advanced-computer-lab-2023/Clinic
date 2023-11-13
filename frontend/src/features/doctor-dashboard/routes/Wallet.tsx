import { AlertsBox } from '@/components/AlertsBox'
import { CardPlaceholder } from '@/components/CardPlaceholder'
import { Card, CardContent, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'

import { useAuth } from '@/hooks/auth'
import { getWalletMoney } from '@/api/doctor'

export function Wallet() {
  const { user } = useAuth()
  const query = useQuery({
    queryKey: ['get-wallet-money'],
    queryFn: () => getWalletMoney(user!.username),
  })

  if (query.isLoading) {
    return <CardPlaceholder />
  }

  const res = query.data

  if (res == null) {
    return <AlertsBox />
  }

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h6" color="text.secondary">
          {`Wallet Money: ${res.money.toFixed(2)} EGP`}
        </Typography>
      </CardContent>
    </Card>
  )
}
