import { NextResponse } from 'next/server';

export class APIError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500
  ) {
    super(message);
  }
}

export function handleAPIError(error: unknown) {
  console.error('API Error:', error);
  
  if (error instanceof APIError) {
    return NextResponse.json(
      { error: error.message },
      { status: error.statusCode }
    );
  }
  
  return NextResponse.json(
    { error: "Internal Server Error" },
    { status: 500 }
  );
}