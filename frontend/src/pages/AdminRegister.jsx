import React from 'react'
import RegisterForm from '../components/RegisterForm'
import Nav from '../components/Nav'

const AdminRegister = () => {
  return (
    <div className="max-h-screen">
      <RegisterForm route="/api/admin/register/" method="register" checkAdmin="true" />
    </div>
  )
}

export default AdminRegister
