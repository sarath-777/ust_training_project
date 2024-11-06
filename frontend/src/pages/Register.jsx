import React from 'react'
import RegisterForm from '../components/RegisterForm'
import Nav from '../components/Nav'

const Register = () => {
  return (
    <div>
      <Nav />
      <RegisterForm route="/api/user/register/" method="register" />
    </div>
  )
}

export default Register
