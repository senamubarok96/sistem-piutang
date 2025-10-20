'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  BarChart3, 
  Users, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  UserPlus,
  Upload,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react'

interface DashboardStats {
  totalPiutang: number
  sisaPiutang: number
  lunasPiutang: number
  totalUsers: number
  totalKoordinator: number
  totalPetugas: number
  pendingSetoran: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalPiutang: 0,
    sisaPiutang: 0,
    lunasPiutang: 0,
    totalUsers: 0,
    totalKoordinator: 0,
    totalPetugas: 0,
    pendingSetoran: 0
  })
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeMenu, setActiveMenu] = useState('dashboard')

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Fetch dashboard stats
      const statsResponse = await fetch('/api/admin/dashboard-stats')
      if (statsResponse.ok) {
        const data = await statsResponse.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    window.location.href = '/'
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount)
  }

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'users', label: 'Manajemen User', icon: Users },
    { id: 'piutang', label: 'Data Piutang', icon: DollarSign },
    { id: 'setoran', label: 'Setoran', icon: FileText },
    { id: 'rekap', label: 'Rekap', icon: Calendar },
    { id: 'settings', label: 'Pengaturan', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-yellow-50">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 overflow-hidden rounded-lg">
              <img
                src="/logo.png"
                alt="Admin Panel"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="font-semibold text-gray-800">Admin Panel</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        <nav className="p-4">
          <div className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveMenu(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    activeMenu === item.id
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              )
            })}
          </div>
        </nav>
        
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full justify-start text-gray-700 hover:text-red-600"
          >
            <LogOut className="w-4 h-4 mr-3" />
            Keluar
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden"
              >
                <Menu className="w-4 h-4" />
              </Button>
              
              <div className="flex items-center space-x-4">
                <h1 className="text-xl font-semibold text-gray-800">
                  Dashboard Admin
                </h1>
              </div>
              
              <div className="flex items-center space-x-4">
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  Administrator
                </Badge>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Total Piutang
                </CardTitle>
                <DollarSign className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {formatCurrency(stats.totalPiutang)}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Jumlah total piutang aktif
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Sisa Piutang
                </CardTitle>
                <TrendingDown className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {formatCurrency(stats.sisaPiutang)}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Piutang belum lunas
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Lunas Piutang
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(stats.lunasPiutang)}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Piutang sudah lunas
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Total Pengguna
                </CardTitle>
                <Users className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {stats.totalUsers}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.totalKoordinator} Koordinator, {stats.totalPetugas} Petugas
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <UserPlus className="w-5 h-5 text-blue-600" />
                  <span>Manajemen User</span>
                </CardTitle>
                <CardDescription>
                  Kelola koordinator dan petugas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setActiveMenu('users')}
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Daftar User
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setActiveMenu('users')}
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Tambah User Baru
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Upload className="w-5 h-5 text-purple-600" />
                  <span>Input Data</span>
                </CardTitle>
                <CardDescription>
                  Import data piutang dari Excel
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setActiveMenu('piutang')}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Import Excel
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setActiveMenu('piutang')}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Lihat Data Piutang
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Setoran Menunggu</span>
                </CardTitle>
                <CardDescription>
                  {stats.pendingSetoran} setoran perlu persetujuan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setActiveMenu('setoran')}
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    Lihat Setoran
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setActiveMenu('setoran')}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Proses Setoran
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Aktivitas Terkini</CardTitle>
              <CardDescription>
                Log aktivitas sistem terbaru
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-sm text-gray-600">User baru berhasil ditambahkan</span>
                  <span className="text-xs text-gray-400 ml-auto">2 menit lalu</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <span className="text-sm text-gray-600">Setoran dari petugas P001 disetujui</span>
                  <span className="text-xs text-gray-400 ml-auto">15 menit lalu</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-600 rounded-full"></div>
                  <span className="text-sm text-gray-600">Data piutang baru diimport</span>
                  <span className="text-xs text-gray-400 ml-auto">1 jam lalu</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}