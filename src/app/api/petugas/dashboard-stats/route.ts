import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    // Get current user from session (simplified for demo)
    const petugasId = 'cmgyfg6oh0006phg76p1ffm86' // Demo petugas ID

    // Get piutang stats for this petugas
    const piutangStats = await db.piutang.aggregate({
      _sum: {
        rupiahPiutang: true
      },
      where: {
        petugasId: petugasId
      }
    })

    const sisaPiutangStats = await db.piutang.aggregate({
      _sum: {
        rupiahPiutang: true
      },
      where: {
        petugasId: petugasId,
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
        petugasId: petugasId,
        status: 'LUNAS'
      }
    })

    // Get pending setoran from this petugas
    const pendingSetoran = await db.setoran.count({
      where: {
        petugasId: petugasId,
        status: 'PENDING'
      }
    })

    const stats = {
      totalPiutang: piutangStats._sum.rupiahPiutang || 0,
      sisaPiutang: sisaPiutangStats._sum.rupiahPiutang || 0,
      lunasPiutang: lunasPiutangStats._sum.rupiahPiutang || 0,
      pendingSetoran
    }

    return NextResponse.json(stats)

  } catch (error) {
    console.error('Error fetching petugas dashboard stats:', error)
    return NextResponse.json(
      { message: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}