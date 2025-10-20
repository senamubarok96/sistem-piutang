import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding...')

  // Create demo users
  const hashedAdminPassword = await bcrypt.hash('admin123', 10)
  const hashedKoordPassword = await bcrypt.hash('koor123', 10)
  const hashedPetugasPassword = await bcrypt.hash('petugas123', 10)

  // Admin user
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: hashedAdminPassword,
      name: 'Administrator',
      role: 'ADMIN',
    },
  })

  // Koordinator user
  const koordinatorUser = await prisma.user.upsert({
    where: { username: 'koordinator' },
    update: {},
    create: {
      username: 'koordinator',
      password: hashedKoordPassword,
      name: 'Koordinator Wilayah',
      role: 'KOORDINATOR',
    },
  })

  // Create koordinator profile
  const koordinator = await prisma.koordinator.upsert({
    where: { userId: koordinatorUser.id },
    update: {},
    create: {
      kodeKoord: 'K001',
      namaKoord: 'Koordinator Wilayah 1',
      userId: koordinatorUser.id,
    },
  })

  // Petugas user
  const petugasUser = await prisma.user.upsert({
    where: { username: 'petugas' },
    update: {},
    create: {
      username: 'petugas',
      password: hashedPetugasPassword,
      name: 'Petugas Lapangan',
      role: 'PETUGAS',
    },
  })

  // Create petugas profile
  const petugas = await prisma.petugas.upsert({
    where: { userId: petugasUser.id },
    update: {},
    create: {
      kodePetugas: 'P001',
      namaPetugas: 'Petugas Area 1',
      userId: petugasUser.id,
      koordinatorId: koordinator.id,
    },
  })

  // Create sample piutang data
  const samplePiutang = await prisma.piutang.create({
    data: {
      idPelanggan: 'CUST001',
      namaPelanggan: 'PT. Contoh Pelanggan',
      kodeWilayah: 'W001',
      rupiahPiutang: 5000000,
      status: 'BELUM_LUNAS',
      bulan: 'Januari',
      tahun: '2024',
      petugasId: petugas.id,
      koordinatorId: koordinator.id,
    },
  })

  // Create sample rekap data
  const sampleRekap = await prisma.rekap.create({
    data: {
      bulan: 'Januari',
      tahun: '2024',
      koordinatorId: koordinator.id,
      petugasId: petugas.id,
      sisaPiutang: 5000000,
      lunasPiutang: 0,
      totalPiutang: 5000000,
    },
  })

  console.log('Seeding finished.')
  console.log('Created users:', { admin, koordinatorUser, petugasUser })
  console.log('Created profiles:', { koordinator, petugas })
  console.log('Created sample data:', { samplePiutang, sampleRekap })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })