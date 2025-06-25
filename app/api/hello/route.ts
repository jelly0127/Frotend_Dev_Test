import { NextRequest } from "next/server";

export async function GET() {
  return new Response(JSON.stringify({ message: 'Hello, API!' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function POST(request: NextRequest) {
  const data = await request.json();
  // handle data

  return new Response(JSON.stringify({ received: data }), { status: 200 });
}