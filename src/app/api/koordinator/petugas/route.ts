import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    // Get current user from session (simplified for demo)
    const koordinatorId = 'cmgyfg6of0003phg7sbbiu3ga' // Demo koordinator ID

    const petugas = await db.petugas.findMany({
      where: {
        koordinatorId: koordinatorId
      },
      include: {
        user: {
          select: {
            name: true
          }
        }
      }
    })

    return NextResponse.json(petugas)

  } catch (error) {
    console.error('Error fetching petugas:', error)
    return NextResponse.json(
      { message: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}