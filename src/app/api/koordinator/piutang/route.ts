import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    // Get current user from session (simplified for demo)
    const koordinatorId = 'cmgyfg6of0003phg7sbbiu3ga' // Demo koordinator ID

    const piutang = await db.piutang.findMany({
      where: {
        koordinatorId: koordinatorId
      },
      include: {
        petugas: {
          select: {
            kodePetugas: true,
            namaPetugas: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(piutang)

  } catch (error) {
    console.error('Error fetching piutang:', error)
    return NextResponse.json(
      { message: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}