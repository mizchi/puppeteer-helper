/* @flow */
import * as React from 'react'
import App from '../components/App'
import ReactDOM from 'react-dom/server'
module.exports = () => {
  return ReactDOM.renderToString(<App />)
}
