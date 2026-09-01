export async function GET() {
  return Response.json({
    ok: true,
    message: 'Admin analytics route requires server-side authentication and role enforcement.',
    stats: {
      totalUsers: 0,
      totalBills: 0,
      activePlans: { free: 0, pro: 0, business: 0 }
    }
  });
}
