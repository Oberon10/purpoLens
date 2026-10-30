import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const bucket = (formData.get('bucket') as string) || 'portfolio-videos';

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided in upload request' },
        { status: 400 }
      );
    }

    // Determine target subfolder based on bucket or MIME type
    const isVideo = file.type.startsWith('video/') || bucket.includes('video');
    const subDir = isVideo ? 'videos' : 'images';
    const uploadDirPath = path.join(process.cwd(), 'public', 'uploads', subDir);

    // Ensure upload directory exists
    await fs.promises.mkdir(uploadDirPath, { recursive: true });

    // Clean filename
    const originalName = file.name || (isVideo ? 'video.mp4' : 'image.jpg');
    const ext = path.extname(originalName) || (isVideo ? '.mp4' : '.jpg');
    const sanitizedBase = path
      .basename(originalName, ext)
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .slice(0, 30);
    const uniqueFileName = `${Date.now()}-${sanitizedBase}${ext}`;
    const filePath = path.join(uploadDirPath, uniqueFileName);

    // Write file to local public directory
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await fs.promises.writeFile(filePath, buffer);

    const localUrl = `/uploads/${subDir}/${uniqueFileName}`;

    // Optionally attempt upload to Supabase Storage if configured and available
    let remoteUrl: string | null = null;
    if (supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('your-project')) {
      try {
        const supabase = createClient(supabaseUrl, supabaseAnonKey);
        const remotePath = `${Date.now()}-${uniqueFileName}`;
        const { error: storageError } = await supabase.storage
          .from(bucket)
          .upload(remotePath, buffer, {
            contentType: file.type || (isVideo ? 'video/mp4' : 'image/jpeg'),
            upsert: false,
          });

        if (!storageError) {
          const { data: publicData } = supabase.storage
            .from(bucket)
            .getPublicUrl(remotePath);
          if (publicData?.publicUrl) {
            remoteUrl = publicData.publicUrl;
          }
        }
      } catch (cloudErr) {
        // Non-blocking: local URL is already safely persisted
        console.warn('Supabase storage upload skipped, using local URL:', cloudErr);
      }
    }

    const finalUrl = remoteUrl || localUrl;

    return NextResponse.json({
      success: true,
      url: finalUrl,
      localUrl,
      filename: uniqueFileName,
      size: file.size,
      mimeType: file.type,
      storage: remoteUrl ? 'supabase' : 'local',
    });
  } catch (error: any) {
    console.error('File upload error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to process file upload' },
      { status: 500 }
    );
  }
}

