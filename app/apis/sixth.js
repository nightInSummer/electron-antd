import agent from '../common/agent'


export async function savePacking(data) {
  const res = await agent.post('/packing')
    .send(data)

  return res.body
}

export async function getPacking(data) {
  const res = await agent.get('/packing')
    .query(data)

  return res.body
}

export async function deletePacking(data) {
  const res = await agent.delete('/packing')
    .query(data)

  return res.body
}

