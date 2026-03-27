import {
  LayoutDashboard,
  TrendingUp,
  Search,
  Share2,
  Megaphone,
  BarChart2,
  FileText,
  LogOut,
} from 'lucide-react'
import { cn } from '@/lib/utils'

import { Link, useLocation, useNavigate } from 'react-router-dom'

interface NavItem {
  label: string
  icon: React.ReactNode
  to: string
}

interface NavSection {
  title: string
  items: NavItem[]
}

const sections: NavSection[] = [
  {
    title: 'Overview',
    items: [
      { label: 'Dashboard', icon: <LayoutDashboard size={16} />, to: '/dashboard' },
      { label: 'Analytics', icon: <TrendingUp size={16} />, to: '/analytics' },
    ],
  },
  {
    title: 'Advertising',
    items: [
      { label: 'Google Ads', icon: <Search size={16} />, to: '/dashboard' },
      { label: 'Facebook Ads', icon: <Share2 size={16} />, to: '/dashboard' },
    ],
  },
  {
    title: 'Management',
    items: [
      { label: 'Campanhas', icon: <Megaphone size={16} />, to: '/campaigns' },
      { label: 'Settings', icon: <FileText size={16} />, to: '/settings' },
    ],
  },
]

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = localStorage.getItem('crm_user_email') || ''
  const name = localStorage.getItem('crm_user_name') || ''
  const initials = name
    ? name.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase()
    : email.slice(0, 2).toUpperCase() || '?'

  const handleLogout = () => {
    localStorage.removeItem('crm_token')
    localStorage.removeItem('crm_user_email')
    localStorage.removeItem('crm_user_name')
    navigate('/login')
  }

  return (
    <aside className="flex flex-col w-64 h-full bg-white border-r border-border shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 py-5 border-b border-border">
        <div className="flex items-center justify-center w-8 h-8 bg-neutral-900 rounded-md">
          <BarChart2 size={16} className="text-white" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-neutral-900 leading-tight">Smart CRM</span>
          <span className="text-xs text-neutral-500 leading-tight">Sales Platform</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        {sections.map((section) => (
          <div key={section.title} className="mb-4">
            <p className="px-3 py-1.5 text-xs font-medium text-neutral-400 uppercase tracking-wider">
              {section.title}
            </p>
            {section.items.map((item) => {
              const active = location.pathname === item.to || (item.to !== '/' && location.pathname.startsWith(item.to));
              return (
              <Link
                key={item.label}
                to={item.to}
                className={cn(
                  'flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm transition-colors text-left',
                  active
                    ? 'bg-neutral-100 text-neutral-900 font-medium'
                    : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                )}
              >
                <span className={cn(active ? 'text-neutral-900' : 'text-neutral-400')}>
                  {item.icon}
                </span>
                {item.label}
              </Link>
            )})}
          </div>
        ))}
      </nav>

      {/* User */}
      <div className="border-t border-border">
        <div className="flex items-center gap-3 px-4 py-4">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-neutral-200 text-neutral-700 text-xs font-semibold shrink-0">
            {initials}
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            {name && <span className="text-sm font-medium text-neutral-900 truncate">{name}</span>}
            <span className="text-xs text-neutral-500 truncate">{email || 'Não autenticado'}</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center w-8 h-8 rounded-md text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
            title="Sair da conta"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  )
}
