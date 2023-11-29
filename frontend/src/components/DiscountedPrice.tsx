import { Typography, Stack } from '@mui/material'

export function DiscountedPrice({
  originalPrice,
  discountedPrice,
}: {
  originalPrice: number
  discountedPrice: number
}) {
  return (
    <Typography variant="body1">
      {discountedPrice != originalPrice ? (
        <Stack direction="row" spacing={1}>
          <Typography variant="body1">{discountedPrice.toFixed(2)}$</Typography>
          <Typography
            variant="body1"
            sx={{ textDecoration: 'line-through', color: 'text.disabled' }}
          >
            {originalPrice.toFixed(2)}$
          </Typography>
        </Stack>
      ) : (
        originalPrice.toFixed(2) + '$'
      )}
    </Typography>
  )
}
