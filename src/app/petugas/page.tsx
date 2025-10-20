'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
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
  Edit,
  Upload,
  MapPin
} from 'lucide-react'

interface DashboardStats {
  totalPiutang: number
  sisaPiutang: number
  lunasPiutang: number
  pendingSetoran: number
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
}

export default function PetugasDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalPiutang: 0,
    sisaPiutang: 0,
    lunasPiutang: 0,
    pendingSetoran: 0
  })
  const [piutang, setPiutang] = useState<Piutang[]>([])
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeMenu, setActiveMenu] = useState('dashboard')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedWilayah, setSelectedWilayah] = useState('')
  const [selectedBulan, setSelectedBulan] = useState('')
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedPiutang, setSelectedPiutang] = useState<Piutang | null>(null)
  const [editForm, setEditForm] = useState({
    status: '',
    nominalBayar: '',
    tanggalJanji: ''
  })

  useEffect(() => {
    fetchDashboardData()
    fetchPiutang()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/petugas/dashboard-stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    }
  }

  const fetchPiutang = async () => {
    try {
      const response = await fetch('/api/petugas/piutang')
      if (response.ok) {
        const data = await response.json()
        setPiutang(data)
      }
    } catch (error) {
      console.error('Error fetching piutang:', error)
    }
  }

  const handleEditPiutang = (item: Piutang) => {
    setSelectedPiutang(item)
    setEditForm({
      status: item.status,
      nominalBayar: '',
      tanggalJanji: ''
    })
    setEditDialogOpen(true)
  }

  const handleSaveEdit = async () => {
    if (!selectedPiutang) return

    try {
      const response = await fetch(`/api/petugas/piutang/${selectedPiutang.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      })

      if (response.ok) {
        setEditDialogOpen(false)
        fetchPiutang()
        fetchDashboardData()
      }
    } catch (error) {
      console.error('Error updating piutang:', error)
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
    const matchesWilayah = !selectedWilayah || item.kodeWilayah === selectedWilayah
    const matchesBulan = !selectedBulan || item.bulan === selectedBulan
    return matchesSearch && matchesWilayah && matchesBulan
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

  const uniqueWilayah = [...new Set(piutang.map(item => item.kodeWilayah))]
  const uniqueBulan = [...new Set(piutang.map(item => item.bulan))]

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: DollarSign },
    { id: 'piutang', label: 'Data Piutang', icon: FileText },
    { id: 'setoran', label: 'Setoran', icon: Upload },
    { id: 'rekap', label: 'Rekap', icon: Calendar },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-blue-50 to-purple-50">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 overflow-hidden rounded-lg">
              <img
                src="/logo.png"
                alt="Petugas Panel"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="font-semibold text-gray-800">Petugas Panel</span>
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
                      ? 'bg-gradient-to-r from-yellow-500 to-blue-500 text-white'
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
                  Dashboard Petugas
                </h1>
              </div>
              
              <div className="flex items-center space-x-4">
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  Petugas
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
                  Total Piutang Area
                </CardTitle>
                <DollarSign className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {formatCurrency(stats.totalPiutang)}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Jumlah total piutang area
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
                  Setoran Pending
                </CardTitle>
                <Clock className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {stats.pendingSetoran}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Menunggu persetujuan
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Data Piutang Table */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-yellow-600" />
                <span>Data Piutang Area</span>
              </CardTitle>
              <CardDescription>
                Kelola data piutang untuk wilayah kerja Anda
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Cari nama pelanggan atau ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <Select value={selectedWilayah} onValueChange={setSelectedWilayah}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih Wilayah" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Semua Wilayah</SelectItem>
                      {uniqueWilayah.map((wilayah) => (
                        <SelectItem key={wilayah} value={wilayah}>
                          {wilayah}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Select value={selectedBulan} onValueChange={setSelectedBulan}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih Bulan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Semua Bulan</SelectItem>
                      {uniqueBulan.map((bulan) => (
                        <SelectItem key={bulan} value={bulan}>
                          {bulan}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">ID Pelanggan</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Nama Pelanggan</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Wilayah</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Jumlah</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Periode</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPiutang.map((item) => (
                      <tr key={item.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm text-gray-900">{item.idPelanggan}</td>
                        <td className="py-3 px-4 text-sm text-gray-900">{item.namaPelanggan}</td>
                        <td className="py-3 px-4 text-sm text-gray-900">{item.kodeWilayah}</td>
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
                        <td className="py-3 px-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditPiutang(item)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
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
                  <Upload className="w-5 h-5 text-blue-600" />
                  <span>Kirim Setoran</span>
                </CardTitle>
                <CardDescription>
                  Kirim setoran piutang ke koordinator
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setActiveMenu('setoran')}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Buat Setoran Baru
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  <span>Rekap Piutang</span>
                </CardTitle>
                <CardDescription>
                  Lihat rekap piutang per periode
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

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Status Piutang</DialogTitle>
            <DialogDescription>
              Perbarui status piutang untuk {selectedPiutang?.namaPelanggan}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={editForm.status} onValueChange={(value) => setEditForm({...editForm, status: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BELUM_LUNAS">Belum Lunas</SelectItem>
                  <SelectItem value="BAYAR_SEBAGIAN">Bayar Sebagian</SelectItem>
                  <SelectItem value="JANJI_BAYAR">Janji Bayar</SelectItem>
                  <SelectItem value="LUNAS">Lunas</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {editForm.status === 'BAYAR_SEBAGIAN' && (
              <div>
                <Label htmlFor="nominalBayar">Nominal Bayar</Label>
                <Input
                  id="nominalBayar"
                  type="number"
                  placeholder="Masukkan nominal pembayaran"
                  value={editForm.nominalBayar}
                  onChange={(e) => setEditForm({...editForm, nominalBayar: e.target.value})}
                />
              </div>
            )}
            
            {editForm.status === 'JANJI_BAYAR' && (
              <div>
                <Label htmlFor="tanggalJanji">Tanggal Janji Bayar</Label>
                <Input
                  id="tanggalJanji"
                  type="date"
                  value={editForm.tanggalJanji}
                  onChange={(e) => setEditForm({...editForm, tanggalJanji: e.target.value})}
                />
              </div>
            )}
          </div>
          <div className="flex justify-end space-x-2 mt-6">
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleSaveEdit}>
              Simpan
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}