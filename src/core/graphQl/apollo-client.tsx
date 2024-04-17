import { ApolloClient, ApolloLink, from, HttpLink, InMemoryCache } from '@apollo/client'
import { GQL_API_URL } from '../../apis/baseApi'
import { onError } from '@apollo/client/link/error'
// import { notification } from 'antd'
import { getNewToken, logout } from '../../apis/authContainer'
import Router from 'next/router'

export const apolloInit = (vendor: string = 'shikho') => {
  const endPointUri = GQL_API_URL

  let errorFlag = true
  const errorLink = onError(({ graphQLErrors, networkError }: any) => {
    if (graphQLErrors) {
      graphQLErrors.forEach(({ message, locations, path }: any) =>
        console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
      )
    //   notification.error({
    //     message: graphQLErrors?.result?.message || 'Something went wrong!',
    //   })
      errorFlag = false
    }

    if (networkError && (networkError.statusCode === 401 || networkError.statusCode === 500)) {
      if (errorFlag) {
        // getNewToken(
        //   (response: any) => {
        //     errorFlag = false
        //     Router.reload()
        //   },
        //   (error: any) => {
        //     logout().then(() => {
        //       Router.push('/login')
        //     })
        //     // notification.error({
        //     //   message: 'Session Expired! Logging out.',
        //     // })
        //   }
        // )
        errorFlag = false
      }
    } else if (networkError?.result?.message) {
      if (errorFlag) {
        // notification.error({
        //   message: networkError?.result?.message || 'Something went wrong!',
        // })
      }
      errorFlag = false
    }
  })

  const authMiddleware = new ApolloLink((operation, forward) => {

    const token = 'eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiIwMmI5YjUzNy0yODU4LTQ5ZDQtODBmZi0xOGI1ZTc4YTFmNGQiLCJlbWFpbCI6InRhc25pbS5mZXJkb3VzQHNoaWtoby5jb20iLCJleHAiOjE3MTMzNDI4MTgsImlhdCI6MTcxMzMzOTIxOCwianRpIjoiVmtCamlmT0V5MzRyTGRHdjVEcHhDdzc5REd0TW9BbEMiLCJtZXRhIjoiY29yZSxzdHVkZW50LHRlYWNoZXIiLCJwaG9uZSI6IjAxNjAxMjQwMDE5Iiwicm9sZSI6ImFkbWluIiwic291cmNlIjoid2Vic2l0ZSIsInZlbmRvciI6InNoaWtobyJ9.LE4bYaZzsWPEhfvcHGZW2DJs6pWV4MHimNRYJitLwCk3seaM6zFzDY15H6WCJdLfNBfw9rbc1-Ss97n6lWLhjDfUv_Mwm5FUKabFv7UoKV2PrLipIU9hXAjvtPi1JknlNwM-o5N6MzPazLiZT9SruXWttNu7nTTjRrIZUSFToihNt0HcT_e6RBQl9esx_neZ30jQgN264v_OggDsbgqMk2zJ4tSmCqyqIyb2xyZbrl8N5ZoDiD1oav9tZcZ5Jm1H9UvMjjrNmIXgEHsRFQFeJSHIcUrDE_lGAT4N_1y6uMWnnAiXr_Nw_b3q8rUcvOwc1Lcx8709FRC9Zn8tMenOzA'
    operation.setContext(({ headers = {} }) => ({
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : '',
        'X-Vendor': vendor,
      },
    }))

    return forward(operation)
  })

  const httpLink = new HttpLink({ uri: endPointUri || '' })

  return new ApolloClient({
    uri: endPointUri || '',
    link: from([authMiddleware, errorLink, httpLink]),
    cache: new InMemoryCache(),
  })
}
