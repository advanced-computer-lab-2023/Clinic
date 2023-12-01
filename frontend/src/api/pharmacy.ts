import axios from 'axios'

export async function addPrescriptionTocart(id: any, token: any) {
  console.log('addtoooo')

  return await axios.post(
    'http://localhost:4000/api/cart/addPrescriptiontoCart',
    {
      prescriptionId: id,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )
}
