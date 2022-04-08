import React, {Fragment} from 'react';


export const Header = (props) => {

    const onClickNavMenu = (e) => {
        e.preventDefault()
        document.getElementById("nav-content").classList.toggle("hidden")
    }


  return (
          <nav className="flex items-center justify-between flex-wrap p-6" style={{background: '#0d0a0a'}}>
              <div className="flex items-center flex-no-shrink text-white mr-6">
                  <span className="font-semibold text-xl tracking-tight">HBY&CHE COIN</span>
              </div>
              <div className="block lg:hidden">
                  <button
                      className="flex items-center px-3 py-2 border rounded text-lighter border-light hover:text-white hover:border-white"
                      onClick={onClickNavMenu}>
                      <svg className="h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" style={{stroke:"white", fill:"white"}}><title>Menu</title>
                          <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/>
                      </svg>
                  </button>
              </div>
              <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto hidden" id="nav-content">
                  <div className="text-sm lg:flex-grow">
                      <a href="#responsive-header"
                         className="block mt-4 lg:inline-block lg:mt-0 text-teal-lighter hover:text-white mr-4">
                          Docs
                      </a>
                      <a href="#responsive-header"
                         className="block mt-4 lg:inline-block lg:mt-0 text-teal-lighter hover:text-white mr-4">
                          Examples
                      </a>
                      <a href="#responsive-header"
                         className="block mt-4 lg:inline-block lg:mt-0 text-teal-lighter hover:text-white">
                          Blog
                      </a>
                  </div>
                  <div>
                      <a href="#"
                         className="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-teal hover:bg-white mt-4 lg:mt-0">Download</a>
                  </div>
              </div>
          </nav>
  )
}