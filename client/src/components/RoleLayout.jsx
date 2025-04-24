// src/components/RoleLayout.jsx
import Navbar from './Navbar'
import Sidebar from './Sidebar'

const RoleLayout = ({ children }) => {
  return (
    <div className='flex flex-col min-h-screen'>
      <Navbar />
      <div className='flex flex-1'>
        <Sidebar />
        <main className='flex-1 p-4'>{children}</main>
      </div>
    </div>
  )
}

export default RoleLayout
