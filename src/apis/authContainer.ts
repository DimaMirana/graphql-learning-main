import axios from 'axios'
import { doesAuthErrorExists } from './sendPostRequest'
import { LOG_OUT_URL, REFRESH_API_URL } from './baseApi'
import {
  getRefreshToken,
  getToken,
  getUserType,
  removeLoggedInUser,
  setCookieValue,
} from '../core/utils/UserManager'
import { useRouter } from 'next/router'

const tokenKey = 'token'
// const refreshTokenKey = 'refresh_token'
const className = 'classes'
const groupName = 'group'
const subjectNameIs = 'subject'
const subjectId = 'subjectkey'

export const loginSuccess = (data: any) => {
  setCookieValue('user_id', data?.user_id, 30)
  setCookieValue('id_token', data?.id_token, 30)
  setCookieValue('token', data?.access_token, 30)
  setCookieValue('refresh_token', data?.refresh_token, 30)
  setCookieValue('type', getUserType() || '', 30)
  window.localStorage.setItem('time_now', String(Date.now()))
}

export const isLogin = () => {
  if (getToken()) {
    return true
  }
  return false
}

// export async function logout() {

//   removeLoggedInUser()
//   location.replace('/')
// }
export async function logout() {
  try {
    const url = LOG_OUT_URL
    await axios.post(url)
  } catch (error: any) {
    console.log({ error })
  }
  removeLoggedInUser()
  typeof window !== 'undefined' && location.replace('/')
}

export function UserInfo() {
  return JSON.parse(localStorage.getItem('profile') as string)
}

export function isLoggedIn() {
  return localStorage.getItem(tokenKey) === null
}

export function getLoginStatus() {
  return localStorage.getItem('token')
}

export function getClassName() {
  return localStorage.getItem('classes')
}

export const setClassName = (classes: any) => {
  localStorage.setItem(className, classes)
}

// function removeClassName() {
//   localStorage.removeItem(className);
// }

export function getGroupName() {
  return localStorage.getItem('group')
}

export function setGroupName(group: any) {
  localStorage.setItem(groupName, group)
}

export function removeGroupName() {
  localStorage.removeItem(groupName)
}

export function getSubjectNameIs() {
  return localStorage.getItem('subject')
}

export function setSubjectNameIs(subject: any) {
  localStorage.setItem(subjectNameIs, subject)
}

// function removeSubjectNameIs() {
//   localStorage.removeItem(subjectNameIs);
// }

export function getSubjectKey() {
  return localStorage.getItem('subjectkey')
}

export function setSubjectKey(subjectkey: any) {
  localStorage.setItem(subjectId, subjectkey)
}

export async function getNewToken(successCallback?: any, errorCallback?: any) {
  const refreshToken = getRefreshToken()
  const url = REFRESH_API_URL
  try {
    const response = await axios.post(url, {
      token: refreshToken,
    })
    if (doesAuthErrorExists(response)) {
    } else {
      if (response?.data?.code === 200) {
        const tokens = response?.data?.tokens
        loginSuccess(tokens)
      }
      await successCallback(response)
    }
  } catch (error: any) {
    if (error?.response?.data?.code === 401) {
      logout()
    }
    if (errorCallback !== undefined) {
      errorCallback(error)
    }
  }
}

export const getClasses = () =>
  typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('class_options') as string) : []

export const getClassesNoMasking = () =>
  typeof window !== 'undefined'
    ? JSON.parse(localStorage.getItem('class_options_no_masking') as string)
    : []
