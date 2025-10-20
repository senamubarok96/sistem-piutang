import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Check database connection
    const { db } = await import('@/lib/db')
    await db.$queryRaw`SELECT 1`
    
    // Check system health
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      database: 'connected',
      version: process.env.npm_package_version || '1.0.0'
    }
    
    return NextResponse.json(health)
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 503 }
    )
  }
}