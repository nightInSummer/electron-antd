import agent from '../common/agent'

export async function saveStock(data) {
  const res = await agent.post('/stock')
    .send(data)

  return res.body
}

export async function getStock(data) {
  const res = await agent.get('/stock')
    .query(data)

  return res.body
}

export async function deleteStock(data) {
  const res = await agent.delete('/stock')
    .query(data)

  return res.body
}
