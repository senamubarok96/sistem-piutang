import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function addMoreSampleData() {
  console.log('Adding more sample data...')

  // Get existing petugas and koordinator
  const petugas = await prisma.petugas.findFirst()
  const koordinator = await prisma.koordinator.findFirst()

  if (!petugas || !koordinator) {
    console.log('Petugas or Koordinator not found')
    return
  }

  // Add more sample piutang data
  const samplePiutangs = [
    {
      idPelanggan: 'CUST002',
      namaPelanggan: 'CV. Maju Bersama',
      kodeWilayah: 'W002',
      rupiahPiutang: 7500000,
      status: 'BAYAR_SEBAGIAN' as const,
      bulan: 'Januari',
      tahun: '2024',
      petugasId: petugas.id,
      koordinatorId: koordinator.id,
    },
    {
      idPelanggan: 'CUST003',
      namaPelanggan: 'PT. Sukses Makmur',
      kodeWilayah: 'W001',
      rupiahPiutang: 3000000,
      status: 'JANJI_BAYAR' as const,
      bulan: 'Februari',
      tahun: '2024',
      petugasId: petugas.id,
      koordinatorId: koordinator.id,
    },
    {
      idPelanggan: 'CUST004',
      namaPelanggan: 'UD. Sentosa Jaya',
      kodeWilayah: 'W003',
      rupiahPiutang: 12000000,
      status: 'LUNAS' as const,
      bulan: 'Januari',
      tahun: '2024',
      petugasId: petugas.id,
      koordinatorId: koordinator.id,
    },
    {
      idPelanggan: 'CUST005',
      namaPelanggan: 'PT. Harapan Baru',
      kodeWilayah: 'W002',
      rupiahPiutang: 8500000,
      status: 'BELUM_LUNAS' as const,
      bulan: 'Februari',
      tahun: '2024',
      petugasId: petugas.id,
      koordinatorId: koordinator.id,
    },
    {
      idPelanggan: 'CUST006',
      namaPelanggan: 'CV. Mitra Sejati',
      kodeWilayah: 'W001',
      rupiahPiutang: 4500000,
      status: 'BAYAR_SEBAGIAN' as const,
      bulan: 'Maret',
      tahun: '2024',
      petugasId: petugas.id,
      koordinatorId: koordinator.id,
    },
  ]

  for (const piutang of samplePiutangs) {
    await prisma.piutang.create({
      data: piutang
    })
  }

  // Add sample setoran data
  const sampleSetorans = [
    {
      rupiahSetor: 2500000,
      bulanSetor: 'Januari',
      tanggalSetor: new Date('2024-01-15'),
      koordinatorId: koordinator.id,
      petugasId: petugas.id,
      status: 'ACCEPT' as const,
      keterangan: 'Setoran partial Januari',
    },
    {
      rupiahSetor: 3000000,
      bulanSetor: 'Februari',
      tanggalSetor: new Date('2024-02-20'),
      koordinatorId: koordinator.id,
      petugasId: petugas.id,
      status: 'PENDING' as const,
      keterangan: 'Setoran Februari menunggu approval',
    },
  ]

  for (const setoran of sampleSetorans) {
    await prisma.setoran.create({
      data: setoran
    })
  }

  // Add more rekap data
  const sampleRekaps = [
    {
      bulan: 'Februari',
      tahun: '2024',
      koordinatorId: koordinator.id,
      petugasId: petugas.id,
      sisaPiutang: 18500000,
      lunasPiutang: 12000000,
      totalPiutang: 30500000,
    },
    {
      bulan: 'Maret',
      tahun: '2024',
      koordinatorId: koordinator.id,
      petugasId: petugas.id,
      sisaPiutang: 4500000,
      lunasPiutang: 0,
      totalPiutang: 4500000,
    },
  ]

  for (const rekap of sampleRekaps) {
    await prisma.rekap.create({
      data: rekap
    })
  }

  console.log('Sample data added successfully!')
}

addMoreSampleData()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })