import superagent from 'superagent'
import agentUse from 'superagent-use'
import prefix from 'superagent-prefix'


const agent = agentUse(superagent)

agent.use(prefix('http://localhost:3000'))

export default agent
