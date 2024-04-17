import { setCookie, destroyCookie, parseCookies } from 'nookies'

let envType = process.env.NEXT_PUBLIC_ENV || 'dev'

export function getLoggedInUserId() {
  const cookies = parseCookies()
  return cookies[`CMS_${envType}_user_id`] || null
}

export function getLoggedInUsersPhone() {
  const cookies = parseCookies()
  return cookies[`CMS_${envType}_phone`] || null
}

export function getLoggedInUser() {
  const cookies = parseCookies()
  const user = cookies?.[`CMS_${envType}_user`]
    ? JSON.parse(cookies?.[`CMS_${envType}_user`])
    : null
  return user
}

export function removeLoggedInUser() {
  removeCookie('token')
  removeCookie('id_token')
  removeCookie('user_id')
  removeCookie('user')
  removeCookie('package')
  removeCookie('refresh_token')
  removeCookie('type')
  typeof window !== 'undefined' && localStorage.clear()
}

export function setLoggedInUser(user: any) {
  if (getCookie('token')) setCookieValue('user', user, 30)
}

export function setCookieValue(cName: string, cValue: string, expDays = 30) {
  const maxAge = expDays ? expDays * 24 * 60 * 60 * 1000 : null
  const domain = process.env.NEXT_PUBLIC_CROSS_DOMAIN

  if (domain && domain !== '.localhost')
    setCookie(null, `CMS_${envType}_${cName}`, cValue, { maxAge, domain, path: '/' })
  else setCookie(null, `CMS_${envType}_${cName}`, cValue, { maxAge, path: '/' })
}

export function getToken() {
  return getCookie('token')
}

export function getCookie(cName: string, ctx?: any) {
  const cookies = parseCookies(ctx)
  return cookies[`CMS_${envType}_${cName}`] ? cookies[`CMS_${envType}_${cName}`] : null
}

export function isTeacher() {
  // const user = getLoggedInUser()

  // return user && user.type === "teacher";
  return getCookie('type') === 'teacher'
}

export function getUserType() {
  return getCookie('type')
}

export function classIsSkill() {
  const user = getLoggedInUser()

  return user && user?.class?.code === 'SKILL'
}

export function removeCookie(cName: string) {
  const maxAge = 30 * 24 * 60 * 60 * 1000
  const domain = process.env.NEXT_PUBLIC_CROSS_DOMAIN

  if (domain && domain !== '.localhost')
    destroyCookie(null, `CMS_${envType}_${cName}`, { domain, path: '/' })
  else destroyCookie(null, `CMS_${envType}_${cName}`, { path: '/', maxAge })
}

export function updateUserCookie(profile: any) {
  let user = { ...profile }
  user.type = getUserType()
  delete user.__typename
  setCookieValue('user', JSON.stringify(user), 30)
}

export function getRefreshToken() {
  // return localStorage.getItem('local_refresh_token')
  return getCookie('refresh_token')
}
