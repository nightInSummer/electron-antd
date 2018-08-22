import agent from '../common/agent'


export async function saveWastage(data) {
  const res = await agent.post('/wastage')
    .send(data)

  return res.body
}

export async function getWastage(data) {
  const res = await agent.get('/wastage')
    .query(data)

  return res.body
}

export async function deleteWastage(data) {
  const res = await agent.delete('/wastage')
    .query(data)

  return res.body
}
