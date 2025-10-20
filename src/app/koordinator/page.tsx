'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  BarChart3, 
  Users, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  FileText,
  LogOut,
  Menu,
  X,
  Search,
  CheckCircle,
  Clock,
  AlertCircle,
  Filter
} from 'lucide-react'

interface DashboardStats {
  totalPiutang: number
  sisaPiutang: number
  lunasPiutang: number
  totalPetugas: number
  pendingSetoran: number
}

interface Petugas {
  id: string
  kodePetugas: string
  namaPetugas: string
  user: {
    name: string
  }
}

interface Piutang {
  id: string
  idPelanggan: string
  namaPelanggan: string
  kodeWilayah: string
  rupiahPiutang: number
  status: string
  bulan: string
  tahun: string
  petugas: {
    kodePetugas: string
    namaPetugas: string
  }
}

export default function KoordinatorDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalPiutang: 0,
    sisaPiutang: 0,
    lunasPiutang: 0,
    totalPetugas: 0,
    pendingSetoran: 0
  })
  const [petugas, setPetugas] = useState<Petugas[]>([])
  const [piutang, setPiutang] = useState<Piutang[]>([])
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeMenu, setActiveMenu] = useState('dashboard')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPetugas, setSelectedPetugas] = useState('')

  useEffect(() => {
    fetchDashboardData()
    fetchPetugas()
    fetchPiutang()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/koordinator/dashboard-stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    }
  }

  const fetchPetugas = async () => {
    try {
      const response = await fetch('/api/koordinator/petugas')
      if (response.ok) {
        const data = await response.json()
        setPetugas(data)
      }
    } catch (error) {
      console.error('Error fetching petugas:', error)
    }
  }

  const fetchPiutang = async () => {
    try {
      const response = await fetch('/api/koordinator/piutang')
      if (response.ok) {
        const data = await response.json()
        setPiutang(data)
      }
    } catch (error) {
      console.error('Error fetching piutang:', error)
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

  const filteredPiutang = piutang.filter(item => {
    const matchesSearch = item.namaPelanggan.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.idPelanggan.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.kodeWilayah.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPetugas = !selectedPetugas || item.petugas.kodePetugas === selectedPetugas
    return matchesSearch && matchesPetugas
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'LUNAS':
        return 'bg-green-100 text-green-800'
      case 'BAYAR_SEBAGIAN':
        return 'bg-yellow-100 text-yellow-800'
      case 'JANJI_BAYAR':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-red-100 text-red-800'
    }
  }

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'piutang', label: 'Data Piutang', icon: DollarSign },
    { id: 'petugas', label: 'Manajemen Petugas', icon: Users },
    { id: 'setoran', label: 'Setoran', icon: FileText },
    { id: 'rekap', label: 'Rekap', icon: Calendar },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-yellow-50">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 overflow-hidden rounded-lg">
              <img
                src="/logo.png"
                alt="Koordinator Panel"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="font-semibold text-gray-800">Koordinator Panel</span>
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
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
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
                  Dashboard Koordinator
                </h1>
              </div>
              
              <div className="flex items-center space-x-4">
                <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                  Koordinator
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
                  Total Piutang Tim
                </CardTitle>
                <DollarSign className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {formatCurrency(stats.totalPiutang)}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Jumlah total piutang tim
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
                  Total Petugas
                </CardTitle>
                <Users className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {stats.totalPetugas}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Petugas di bawah koordinasi
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Data Piutang Table */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-purple-600" />
                <span>Data Piutang Petugas</span>
              </CardTitle>
              <CardDescription>
                Detail piutang dari semua petugas yang dibawahi
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Cari nama pelanggan, ID, atau kode wilayah..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <select
                    value={selectedPetugas}
                    onChange={(e) => setSelectedPetugas(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Semua Petugas</option>
                    {petugas.map((p) => (
                      <option key={p.id} value={p.kodePetugas}>
                        {p.kodePetugas} - {p.namaPetugas}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">ID Pelanggan</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Nama Pelanggan</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Kode Wilayah</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Petugas</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Jumlah</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Periode</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPiutang.map((item) => (
                      <tr key={item.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm text-gray-900">{item.idPelanggan}</td>
                        <td className="py-3 px-4 text-sm text-gray-900">{item.namaPelanggan}</td>
                        <td className="py-3 px-4 text-sm text-gray-900">{item.kodeWilayah}</td>
                        <td className="py-3 px-4 text-sm text-gray-900">
                          {item.petugas.kodePetugas} - {item.petugas.namaPetugas}
                        </td>
                        <td className="py-3 px-4 text-sm font-medium text-gray-900">
                          {formatCurrency(item.rupiahPiutang)}
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={getStatusColor(item.status)}>
                            {item.status.replace('_', ' ')}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-900">
                          {item.bulan} {item.tahun}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setActiveMenu('setoran')}
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Proses Setoran
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <span>Rekap Bulanan</span>
                </CardTitle>
                <CardDescription>
                  Lihat rekap piutang per bulan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setActiveMenu('rekap')}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Lihat Rekap
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}