/* eslint-disable @next/next/no-page-custom-font */
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { ApolloProvider } from '@apollo/client'
import { apolloInit } from '../core/graphQl/apollo-client'
import { useLocalStorage } from '../customHooks'

interface Types {
  Component: any
  pageProps: any
}

const MyApp = ({ Component, pageProps }: Types) => {
  const router = useRouter()
  const [profile] = useLocalStorage('profile', null)

  function confirmRoute() {
    let routes
    if (profile && profile.role === 'admin') routes = '/dashboard'
    if (profile && (profile.role === 'editor' || profile.role === 'developer')) routes = '/chapters'
    if (profile && profile.role === 'marketing') routes = '/coupons'
    if (profile && profile.role === 'sales') routes = '/students-communication'
    else routes = '/login'
    return router.pathname === '/' ? routes : router.asPath
  }

  // useEffect(() => {
  //   if (router.pathname === '/') {
  //     router.push(confirmRoute())
  //   }
  // }, [])

  const client = apolloInit()

  const antDesignThemeSettings = {
    token: {
      // Seed Token
      fontSize: 14,
      colorPrimary: '#363e8b',
      colorLink: '#363e8b',
      // borderRadius: 3,
      colorText: '#111',
      colorBorder: '#d9d9d9',
      colorTextDisabled: 'rgba(0, 0, 0, 0.25)',
      boxShadow:
        '0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05);',

      // Alias Token
      colorBgContainer: '#fff',
    },
  }

  return (
    <>
        <ApolloProvider client={client}>
        <Head>
          <title>Shikho CMS</title>
          <meta name="description" content="A BUSINESS SOLUTION" />
        </Head>
        <Component {...pageProps} />
      </ApolloProvider>
    </>
  )
}

export default MyApp
