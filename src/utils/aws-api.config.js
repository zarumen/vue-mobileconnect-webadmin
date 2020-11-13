import axios from 'axios'

const version = 'staging'

const baseURL = process.env.VUE_APP_APIURL + `${version}/`

const instance = axios.create({
  baseURL: baseURL,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': process.env.VUE_APP_APIKEY
  }
})

instance.defaults.headers.post['Access-Control-Allow-Origin'] = '*'

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
