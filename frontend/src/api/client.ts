import { Configuration, DefaultApi } from "../../generated"

const apiClient = () => {
  const backendUrl = process.env.BACKEND_URL

  const config = new Configuration({
    basePath: `${backendUrl}`,
  })

  return new DefaultApi(config)
}

export default apiClient
