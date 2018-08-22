import agent from '../common/agent'


export async function saveMachining(data) {
  const res = await agent.post('/machining')
    .send(data)

  return res.body
}

export async function getMachining(data) {
  const res = await agent.get('/machining')
    .query(data)

  return res.body
}

export async function deleteMachining(data) {
  const res = await agent.delete('/machining')
    .query(data)

  return res.body
}


