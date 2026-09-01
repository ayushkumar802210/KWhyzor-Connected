export async function GET() {
  return Response.json({
    ok: true,
    service: 'kwhyzor',
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
}
