import React from 'react'
import LoginForm from '../components/LoginForm'
import Nav from '../components/Nav'

const Login = () => {
  return (
    <div>
      <LoginForm route="/api/token/" method="login" />
    </div>
  )
}

export default Login
