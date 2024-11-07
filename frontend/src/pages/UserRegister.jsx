import React from 'react'
import RegisterForm from '../components/RegisterForm'
import Nav from '../components/Nav'

const UserRegister = () => {
  return (
    <div>
      <Nav />
      <RegisterForm route="/api/user/register/" method="register" checkAdmin="false"/>
    </div>
  )
}

export default UserRegister
