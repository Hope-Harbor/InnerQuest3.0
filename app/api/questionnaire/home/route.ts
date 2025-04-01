/* 
Route: app/api/questionnaire/home/route.ts
Purpose: Generates initial client UUID
Usage: When the user starts a questionnaire session
*/

import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

// Force dynamic rendering for API route
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const client_uuid = uuidv4();
  return NextResponse.json({ client_uuid });
}
