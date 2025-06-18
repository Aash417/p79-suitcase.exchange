import prisma from '@repo/database';
import { NextResponse } from 'next/server';

export async function GET() {
   try {
      const records = await prisma.test.findMany({
         take: 1
      });

      return NextResponse.json({
         records,
         status: records.length > 0 ? 'maintenance' : 'operational'
      });
   } catch (error) {
      console.error('Error checking maintenance status:', error);

      return NextResponse.json(
         {
            error: 'Failed to check maintenance status',
            records: [],
            status: 'error'
         },
         { status: 500 }
      );
   }
}
