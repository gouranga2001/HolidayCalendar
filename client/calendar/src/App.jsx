import { useState } from 'react'
import './App.css'
import Sidebar from './components/sidebar/Sidebar'
import Navbar from './components/navbar/Navbar'
import Day from './components/calendar_parts/Day'

function App() {

  return (
    <>
      <div className='relative' >

        <Sidebar />
        <Navbar />
        <div className="mt-16 md:ml-[300px] p-4">
          <Day />
        </div>

      </div>
     




    </>
  )
}

export default App
