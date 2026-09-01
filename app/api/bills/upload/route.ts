import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get('file');

  if (!(file instanceof File)) {
    return Response.json({ error: 'No file provided.' }, { status: 400 });
  }

  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
  const allowedExtensions = ['pdf', 'jpg', 'jpeg', 'png', 'webp'];
  const fileName = file.name.toLowerCase();
  const hasValidExtension = allowedExtensions.some((ext) => fileName.endsWith(ext));

  if (!hasValidExtension || !allowedTypes.includes(file.type)) {
    return Response.json({ error: 'Unsupported file type.' }, { status: 415 });
  }

  if (file.size > 10 * 1024 * 1024) {
    return Response.json({ error: 'File exceeds the maximum supported size.' }, { status: 413 });
  }

  return Response.json({
    ok: true,
    message: 'File accepted for validation and provider detection.',
    fileName: file.name,
    size: file.size,
    mimeType: file.type
  });
}
