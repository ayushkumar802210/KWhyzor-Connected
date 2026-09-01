export async function GET() {
  return Response.json({
    supported: [],
    partiallySupported: ['MSEB'],
    uploadAndDetect: ['TP Southern'],
    comingSoon: ['JVVNL'],
    note: 'Provider status is determined by tested bill formats and documented coverage.'
  });
}
