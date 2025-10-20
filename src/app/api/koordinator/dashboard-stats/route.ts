import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    // Get current user from session (simplified for demo)
    // In real app, you'd get this from authentication middleware
    const koordinatorId = 'cmgyfg6of0003phg7sbbiu3ga' // Demo koordinator ID

    // Get piutang stats for this coordinator's team
    const piutangStats = await db.piutang.aggregate({
      _sum: {
        rupiahPiutang: true
      },
      where: {
        koordinatorId: koordinatorId
      }
    })

    const sisaPiutangStats = await db.piutang.aggregate({
      _sum: {
        rupiahPiutang: true
      },
      where: {
        koordinatorId: koordinatorId,
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
        koordinatorId: koordinatorId,
        status: 'LUNAS'
      }
    })

    // Get petugas count for this coordinator
    const totalPetugas = await db.petugas.count({
      where: {
        koordinatorId: koordinatorId
      }
    })

    // Get pending setoran from this coordinator's team
    const pendingSetoran = await db.setoran.count({
      where: {
        koordinatorId: koordinatorId,
        status: 'PENDING'
      }
    })

    const stats = {
      totalPiutang: piutangStats._sum.rupiahPiutang || 0,
      sisaPiutang: sisaPiutangStats._sum.rupiahPiutang || 0,
      lunasPiutang: lunasPiutangStats._sum.rupiahPiutang || 0,
      totalPetugas,
      pendingSetoran
    }

    return NextResponse.json(stats)

  } catch (error) {
    console.error('Error fetching koordinator dashboard stats:', error)
    return NextResponse.json(
      { message: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}