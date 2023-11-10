import React, { useState, FormEvent } from 'react'
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js'
import {
  Elements,
  useStripe,
  useElements,
  PaymentElement,
} from '@stripe/react-stripe-js'
import Button from '@mui/material/Button'

interface CheckoutFormProps {
  handleSubmitCustom: () => void
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ handleSubmitCustom }) => {
  const stripe = useStripe()
  const elements = useElements()

  const [errorMessage, setErrorMessage] = useState<string | undefined>()

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!elements) {
      return
    }

    // Trigger form validation and wallet collection
    const { error: submitError } = await elements.submit()

    if (submitError) {
      // Show error to your customer
      setErrorMessage(submitError.message)

      return
    }

    handleSubmitCustom()
  }

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <Button
        variant="contained"
        type="submit"
        disabled={!stripe || !elements}
        style={{ backgroundColor: '#3f51b5', color: 'white', marginTop: 10 }}
      >
        Pay
      </Button>
      {/* Show error message to your customers */}
      {errorMessage && <div>{errorMessage}</div>}
    </form>
  )
}

const stripePromise = loadStripe('pk_test_6pRNASCoBOKtIshFeQd4XMUh')

const options: StripeElementsOptions = {
  mode: 'payment',
  amount: 1099,
  currency: 'usd',
  // Fully customizable with the appearance API.
  appearance: {
    theme: 'stripe',
  },
}

interface CheckoutProps {
  handleSubmit: () => void
}

const Checkout: React.FC<CheckoutProps> = ({ handleSubmit }) => (
  <Elements stripe={stripePromise} options={options}>
    <CheckoutForm handleSubmitCustom={handleSubmit} />
  </Elements>
)

export default Checkout
