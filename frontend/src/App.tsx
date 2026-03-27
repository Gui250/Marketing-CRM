import './index.css'
import { Routes, Route } from 'react-router-dom'
import { Sidebar } from '@/components/Sidebar'
import { Dashboard } from '@/components/Dashboard'
import { Settings } from '@/components/Settings'
import { Landing } from '@/pages/Landing'
import { Login } from '@/pages/Login'
import { Register } from '@/pages/Register'
import { Analytics } from '@/pages/Analytics'
import { Campaigns } from '@/pages/Campaigns'

function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#fafafa]">
      <Sidebar />
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<DashboardLayout><Dashboard /></DashboardLayout>} />
      <Route path="/analytics" element={<DashboardLayout><Analytics /></DashboardLayout>} />
      <Route path="/campaigns" element={<DashboardLayout><Campaigns /></DashboardLayout>} />
      <Route path="/settings" element={<DashboardLayout><Settings /></DashboardLayout>} />
    </Routes>
  )
}

export default App
