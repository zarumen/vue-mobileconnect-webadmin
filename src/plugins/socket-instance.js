import io from 'socket.io-client'

export default io('https://app.sms2mkt.com:2096', { secure: true })
