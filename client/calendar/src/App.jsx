import { useState } from 'react'
import './App.css'
import Sidebar from './components/sidebar/Sidebar'
import Scalendar from './components/sidebar_calendar/Scalendar'
import Navbar from './components/navbar/Navbar'

function App() {
  const [count, setCount] = useState(0)
  const [isSidebarOpen, setSidebarOpen] = useState(true); // Sidebar state

  return (
    <>
      <div >

       <Sidebar />
       <Navbar />
      </div>
      {/* <Scalendar/> */}
      
     
      
      
    </>
  )
}

export default App
