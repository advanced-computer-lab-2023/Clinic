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

export async function getMedicineByName(name: string, token: any) {
  const res = await axios.get(
    `http://localhost:4000/api/admin/getMedicineByName/${name}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  return res.data
}
