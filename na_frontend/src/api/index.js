import axios from 'axios'

const baseUrl = `http://localhost:3001/`

const makeRequest = async (conf) => {
  try {
    return (await axios(conf)).data
  } catch (err) {
    console.error(err)
    return {ok: false, error: err.message}
  }
}

export const getAgentsList = async () => await makeRequest({method: `get`, url: `${baseUrl}agentList`})

export const getAllAgentStats = async () => await makeRequest({method: `get`, url: `${baseUrl}agentStats`})

export const getAgentStats = async (agentName) => await makeRequest({method: `get`, url: `${baseUrl}agentStat/${agentName}`})

export const getOrder = async (orderId) => await makeRequest({method: `get`, url: `${baseUrl}order/${orderId}`})

export const deleteOrder = async (orderId) => await makeRequest({method: `delete`, url: `${baseUrl}order/${orderId}`})

export const uploadJson = async (file) => {
  const data = new FormData()
  data.append(`orders`, file)

  return await makeRequest({method: `post`, url: `${baseUrl}ordersJson`, data})
}

// export const getAllOrders = async () => await makeRequest({method: `get`, url: `${baseUrl}orders`})
