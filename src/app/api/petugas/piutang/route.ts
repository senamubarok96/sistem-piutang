import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    // Get current user from session (simplified for demo)
    const petugasId = 'cmgyfg6oh0006phg76p1ffm86' // Demo petugas ID

    const piutang = await db.piutang.findMany({
      where: {
        petugasId: petugasId
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(piutang)

  } catch (error) {
    console.error('Error fetching petugas piutang:', error)
    return NextResponse.json(
      { message: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}