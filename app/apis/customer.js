import agent from '../common/agent'

export async function getCustomer(data) {
  const res = await agent.get('/customer')
    .query(data)

  return res.body
}

export async function deleteCustomer(data) {
  const res = await agent.delete('/customer')
    .query(data)

  return res.body
}
