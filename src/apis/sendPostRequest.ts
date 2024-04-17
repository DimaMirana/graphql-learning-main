import axios from 'axios'

export default async function sendPostRequest(
  url: any,
  apiData: any,
  vendor: any,
  successCallback: any,
  errorCallback: any
) {
  try {
    const response = await axios.post(url, apiData, {
      /*headers: {
        'X-Vendor': vendor,
      },*/
    })
    if (doesAuthErrorExists(response)) {
    } else {
      // console.log({ responseFromSuccess: response })

      await successCallback(response)
    }
  } catch (error) {
    console.log({ e: error })
    if (errorCallback !== undefined) {
      errorCallback(error)
    }
  }
}

export function doesAuthErrorExists(response: any) {
  if (
    response.data.errors !== undefined &&
    JSON.parse(response.data.errors[0].message).code === 401
  ) {
    return true
  }
  return false
}
