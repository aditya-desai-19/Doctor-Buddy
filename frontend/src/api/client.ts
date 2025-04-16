import { Configuration, DefaultApi } from "../../generated"

const apiClient = (token?: string | undefined) => {
  const backendUrl = process.env.BACKEND_URL

  const config = new Configuration({
    basePath: `${backendUrl}`,
    accessToken: token
  })

  return new DefaultApi(config)
}

export default apiClient
