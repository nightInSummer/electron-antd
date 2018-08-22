import agent from '../common/agent'


export async function saveLevel(data) {
  const res = await agent.post('/level')
    .send(data)

  return res.body
}

export async function getLevel(data) {
  const res = await agent.get('/level')
    .query(data)

  return res.body
}

export async function deleteLevel(data) {
  const res = await agent.delete('/level')
    .query(data)

  return res.body
}
