import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, BarChart2, Loader2 } from 'lucide-react'
import axios from 'axios'

export function Login() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await axios.post('http://localhost:3000/api/auth/login', { email, password })
      localStorage.setItem('crm_token', res.data.token)
      localStorage.setItem('crm_user_email', res.data.user.email)
      localStorage.setItem('crm_user_name', res.data.user.name)
      window.location.href = '/dashboard'
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao fazer login. Tente novamente.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link to="/" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 mb-8 transition-colors">
          <ArrowLeft size={16} className="mr-2" />
          Voltar para Home
        </Link>

        <Card className="border-slate-200 shadow-xl shadow-slate-200/50">
          <CardHeader className="space-y-4 pb-6 border-b border-slate-100">
            <div className="flex justify-center mb-2">
              <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-sm">
                <BarChart2 size={24} className="text-white" />
              </div>
            </div>
            <div className="text-center space-y-1">
              <CardTitle className="text-2xl font-bold tracking-tight">Bem-vindo de volta</CardTitle>
              <p className="text-sm text-slate-500">Faça login para gerenciar suas campanhas</p>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all text-sm"
                  placeholder="seu@email.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-slate-700">Senha</label>
                  <a href="#" className="text-xs font-medium text-indigo-600 hover:text-indigo-700">Esqueceu a senha?</a>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all text-sm"
                  placeholder="••••••••"
                  required
                />
              </div>

              <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm mt-6" disabled={loading}>
                {loading ? <Loader2 size={16} className="animate-spin mr-2" /> : null}
                {loading ? 'Entrando...' : 'Entrar na Plataforma'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-slate-500 mt-8">
          Ainda não tem conta? <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-700">Criar uma agora</Link>
        </p>
      </div>
    </div>
  )
}
