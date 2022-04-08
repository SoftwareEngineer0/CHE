import { notification } from 'antd'
export const SUCCESS = 'success'
export const ERROR = 'error'

export const openNotificationWithIcon = (type, message) => {

  let style = {
    backgroundColor: '#f6ffed',
    border: '1px solid #b7eb8f',
    marginLeft: 20
  }
  if (type === ERROR) {
    style = {
      backgroundColor: '#fff1f0',
      border: '1px solid #ffa39e',
      marginLeft: 20
    }
  }

  notification[type]({
    message: message,
    style: style
  })
}
