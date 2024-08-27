import React from 'react'
import { Outlet} from 'react-router-dom'
import { Header } from '../public/Header'

export const PublicLayout = () => {
  return (
    <>
      <Header />

      <section className="layout_content">
        <Outlet />
      </section>
    </>
  )
}
