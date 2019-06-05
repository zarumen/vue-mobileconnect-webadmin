import axios from 'axios'

const version = 'staging'

const baseURL = `https://api.sms2mkt.com/2waysms/${version}/`

const instance = axios.create({
  baseURL: baseURL,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json'
  }
})

export default {
  getData (action) {
    let url = `${baseURL}`
    url += action
    return instance.get(url)
  },
  postData (action, data) {
    let url = `${baseURL}`
    url += action
    return instance.post(url, data)
  },
  putData (action, data) {
    let url = `${baseURL}`
    url += action
    return instance.put(url, data)
  },
  deleteData (action) {
    let url = `${baseURL}`
    url += action
    return instance.delete(url)
  }
}
