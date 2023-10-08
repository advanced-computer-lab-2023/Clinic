import { Card, CardContent, CardHeader, Container } from '@mui/material'
import Skeleton from '@mui/material/Skeleton'

/**
 * A placeholder for a card that is loading. This is useful for when you want to
 * show a loading state for a card that is loading data from an API.
 */
export function CardPlaceholder() {
  return (
    <Container maxWidth="xs">
      <Card>
        <CardHeader
          title={
            <Skeleton
              animation="wave"
              height={10}
              width="80%"
              style={{ marginBottom: 6 }}
            />
          }
          subheader={<Skeleton animation="wave" height={10} width="40%" />}
        />
        <Skeleton sx={{ height: 190 }} animation="wave" variant="rectangular" />
        <CardContent>
          <>
            <Skeleton
              animation="wave"
              height={10}
              style={{ marginBottom: 6 }}
            />
            <Skeleton animation="wave" height={10} width="80%" />
          </>
        </CardContent>
      </Card>
    </Container>
  )
}
