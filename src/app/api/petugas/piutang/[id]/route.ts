import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

interface RouteContext {
  params: Promise<{ id: string }>
}

export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { status, nominalBayar, tanggalJanji } = await request.json()
    const { id } = await context.params

    // Update piutang status
    const updateData: any = {
      status,
      updatedAt: new Date()
    }

    // Add additional fields based on status
    if (status === 'BAYAR_SEBAGIAN' && nominalBayar) {
      updateData.catatan = `Bayar sebagian: Rp ${nominalBayar}`
    } else if (status === 'JANJI_BAYAR' && tanggalJanji) {
      updateData.catatan = `Janji bayar tanggal: ${tanggalJanji}`
    }

    const updatedPiutang = await db.piutang.update({
      where: {
        id: id
      },
      data: updateData
    })

    return NextResponse.json(updatedPiutang)

  } catch (error) {
    console.error('Error updating piutang:', error)
    return NextResponse.json(
      { message: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}