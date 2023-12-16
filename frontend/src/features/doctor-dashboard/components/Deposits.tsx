import * as React from 'react'
import Typography from '@mui/material/Typography'
import Title from './Title'

function preventDefault(event: React.MouseEvent) {
  event.preventDefault()
}

export default function Deposits({ wallet }: { wallet?: number }) {
  console.log('Wallet' + wallet)

  return (
    <React.Fragment>
      <Title>Balance</Title>
      <Typography component="p" variant="h4">
        {wallet != null ? `${wallet.toFixed(2)}` : 'N/A'}
      </Typography>
      <Typography color="text.secondary" sx={{ flex: 1 }}>
        EGP
      </Typography>
      <div>
        <Typography color="primary" onClick={preventDefault}>
          Your balance
        </Typography>
      </div>
    </React.Fragment>
  )
}
