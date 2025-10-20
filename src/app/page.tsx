'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, LogIn, Shield, Users, UserCheck } from 'lucide-react'

export default function LoginPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        // Store user data and redirect based on role
        localStorage.setItem('user', JSON.stringify(data.user))
        
        // Redirect based on user role
        switch (data.user.role) {
          case 'ADMIN':
            window.location.href = '/admin'
            break
          case 'KOORDINATOR':
            window.location.href = '/koordinator'
            break
          case 'PETUGAS':
            window.location.href = '/petugas'
            break
          default:
            window.location.href = '/petugas'
        }
      } else {
        setError(data.message || 'Login gagal. Silakan coba lagi.')
      }
    } catch (err) {
      setError('Terjadi kesalahan. Silakan coba lagi.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-yellow-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 mb-4">
            <img
              src="/logo.png"
              alt="Sistem Piutang Logo"
              className="w-full h-full object-contain rounded-2xl"
            />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Sistem Piutang
          </h1>
          <p className="text-gray-600 mt-2">
            Manajemen Monitoring Piutang Galangan
          </p>
        </div>

        {/* Login Card */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-semibold text-gray-800">
              Selamat Datang
            </CardTitle>
            <CardDescription className="text-gray-600">
              Masuk ke akun Anda untuk melanjutkan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium text-gray-700">
                  Username
                </Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Masukkan username"
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Masukkan password"
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-700">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Masuk...
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4 mr-2" />
                    Masuk
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* User Role Preview */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg mb-2">
              <Shield className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-xs font-medium text-gray-700">Admin</p>
            <p className="text-xs text-gray-500">Manajemen Penuh</p>
          </div>
          
          <div className="text-center p-3 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-purple-100 rounded-lg mb-2">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-xs font-medium text-gray-700">Koordinator</p>
            <p className="text-xs text-gray-500">Manajemen Tim</p>
          </div>
          
          <div className="text-center p-3 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-yellow-100 rounded-lg mb-2">
              <UserCheck className="w-5 h-5 text-yellow-600" />
            </div>
            <p className="text-xs font-medium text-gray-700">Petugas</p>
            <p className="text-xs text-gray-500">Manajemen Area</p>
          </div>
        </div>

        {/* Demo Accounts */}
        <div className="mt-6 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20">
          <p className="text-xs font-medium text-gray-700 mb-2">Akun Demo:</p>
          <div className="space-y-1 text-xs text-gray-600">
            <p>Admin: admin / admin123</p>
            <p>Koordinator: koordinator / koor123</p>
            <p>Petugas: petugas / petugas123</p>
          </div>
        </div>
      </div>
    </div>
  )
}