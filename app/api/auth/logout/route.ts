export async function POST() {
  return Response.json({
    ok: true,
    message: 'Logout is handled by the authentication provider and server-side session invalidation.'
  });
}
