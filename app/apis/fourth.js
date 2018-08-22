import agent from '../common/agent'

export async function saveChill(data) {
  const res = await agent.put('/chill')
    .send(data)

  return res.body
}

export async function getChill(data) {
  const res = await agent.get('/chill')
    .query(data)

  return res.body
}
