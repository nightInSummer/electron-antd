import agent from '../common/agent'

export async function saveStorage(data) {
  const res = await agent.put('/storage')
    .send(data)

  return res.body
}

export async function getStorage(data) {
  const res = await agent.get('/storage')
    .query(data)

  return res.body
}
