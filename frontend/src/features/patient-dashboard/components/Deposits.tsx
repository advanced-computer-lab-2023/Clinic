import * as React from 'react'
import Typography from '@mui/material/Typography'
import { Box, Container } from '@mui/material'

import { AccountBalanceWallet } from '@mui/icons-material'
import { Link } from 'react-router-dom'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

function preventDefault(event: React.MouseEvent) {
  event.preventDefault()
}

export default function Deposits({ wallet }: { wallet?: number }) {
  console.log(wallet)

  return (
    <React.Fragment>
      <Box
        sx={{
          display: 'flex',
          marginY: 'auto',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          flexDirection: 'column',
        }}
      >
        <Typography
          component="p"
          variant="h4"
          fontSize={50}
          marginX={'auto'}
          fontWeight={'bold'}
        >
          {wallet ? `${wallet.toFixed(2)} ` : 'N/A'}
        </Typography>
        <Container
          style={{
            position: 'absolute',
            backgroundColor: 'white',
            borderRadius: '12px',
            width: '85px',
            height: '70px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            top: '-120px',
            boxShadow: '0px 6px 8px rgba(0, 0, 0, 0.1)',
          }}
        >
          <AccountBalanceWallet sx={{ color: 'black' }} />
        </Container>
        <Typography color="lightgray" sx={{ flex: 1, paddingTop: 2 }}>
          on 15 March, 2019
        </Typography>
        <Link
          style={{
            color: 'whitesmoke',
            display: 'flex',
            alignItems: 'center',
            paddingTop: '3px',
            textDecoration: 'none',
          }}
          onClick={preventDefault}
          to="#"
        >
          <Typography variant="body1" component="span">
            View Your Balance
          </Typography>
          <ArrowForwardIcon fontSize="small" sx={{ ml: 1 }} />{' '}
          {/* Adjust icon size */}
        </Link>
      </Box>
    </React.Fragment>
  )
}
