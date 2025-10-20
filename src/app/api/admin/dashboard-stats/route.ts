import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    // Get total piutang stats
    const piutangStats = await db.piutang.aggregate({
      _sum: {
        rupiahPiutang: true
      },
      where: {
        status: {
          in: ['BELUM_LUNAS', 'BAYAR_SEBAGIAN', 'JANJI_BAYAR']
        }
      }
    })

    const sisaPiutangStats = await db.piutang.aggregate({
      _sum: {
        rupiahPiutang: true
      },
      where: {
        status: {
          in: ['BELUM_LUNAS', 'BAYAR_SEBAGIAN', 'JANJI_BAYAR']
        }
      }
    })

    const lunasPiutangStats = await db.piutang.aggregate({
      _sum: {
        rupiahPiutang: true
      },
      where: {
        status: 'LUNAS'
      }
    })

    // Get user counts
    const totalUsers = await db.user.count()
    const totalKoordinator = await db.koordinator.count()
    const totalPetugas = await db.petugas.count()

    // Get pending setoran
    const pendingSetoran = await db.setoran.count({
      where: {
        status: 'PENDING'
      }
    })

    const stats = {
      totalPiutang: piutangStats._sum.rupiahPiutang || 0,
      sisaPiutang: sisaPiutangStats._sum.rupiahPiutang || 0,
      lunasPiutang: lunasPiutangStats._sum.rupiahPiutang || 0,
      totalUsers,
      totalKoordinator,
      totalPetugas,
      pendingSetoran
    }

    return NextResponse.json(stats)

  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json(
      { message: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}