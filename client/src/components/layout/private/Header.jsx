import React from 'react'
import { Nav } from './Nav'

export const Header = () => {

  return (
    <header className="layout__navbar private">

            <div className="navbar__header">
                <a href="#" className="navbar__title">REACTSOCIAL</a>
            </div>

            <Nav/>

        </header>
  )
}
