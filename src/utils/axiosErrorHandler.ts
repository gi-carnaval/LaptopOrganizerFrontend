import { AxiosError } from "axios"

interface AxiosErrorProps {
  message: string
}

const axiosErrorHandler = (err: unknown) => {
  const { response } = err as AxiosError<AxiosErrorProps>
  if(!response) {
    return ''
  }
  return response?.data.message
}

export { axiosErrorHandler }