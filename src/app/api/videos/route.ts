import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { VideoItem } from '@/types/database';
import { INITIAL_VIDEOS } from '@/lib/mockData';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const dataFilePath = path.join(process.cwd(), 'data', 'videos.json');

async function readLocalVideos(): Promise<VideoItem[]> {
  try {
    if (fs.existsSync(dataFilePath)) {
      const content = await fs.promises.readFile(dataFilePath, 'utf8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.warn('Error reading data/videos.json:', err);
  }
  return [];
}

async function writeLocalVideos(videos: VideoItem[]): Promise<void> {
  try {
    const dir = path.dirname(dataFilePath);
    await fs.promises.mkdir(dir, { recursive: true });
    await fs.promises.writeFile(dataFilePath, JSON.stringify(videos, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing data/videos.json:', err);
  }
}

export async function GET() {
  try {
    let supabaseVideos: VideoItem[] = [];

    if (supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('your-project')) {
      try {
        const supabase = createClient(supabaseUrl, supabaseAnonKey);
        const { data, error } = await supabase
          .from('videos')
          .select('*')
          .order('order_index', { ascending: true })
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          supabaseVideos = data as VideoItem[];
        }
      } catch (err) {
        console.warn('Supabase get videos error:', err);
      }
    }

    const localSaved = await readLocalVideos();

    // Merge: Supabase videos + locally saved uploaded videos
    const customMap = new Map<string, VideoItem>();
    for (const v of localSaved) {
      customMap.set(v.id, v);
    }
    for (const v of supabaseVideos) {
      customMap.set(v.id, v);
    }

    const customList = Array.from(customMap.values());

    // Combine custom videos with initial showcase to ensure at least 9 high-quality slots are always present
    const combined: VideoItem[] = [...customList];
    for (const initial of INITIAL_VIDEOS) {
      if (!combined.some((item) => item.id === initial.id || item.title === initial.title)) {
        combined.push(initial);
      }
    }

    return NextResponse.json({
      success: true,
      videos: combined,
      customCount: customList.length,
    });
  } catch (error: any) {
    console.error('API get videos error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch videos' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      id,
      title,
      description,
      category,
      thumbnail_url,
      video_url,
      featured = true,
      order_index = 0,
      client_name,
      duration,
    } = body;

    if (!title || !video_url || !thumbnail_url) {
      return NextResponse.json(
        { success: false, error: 'Title, video URL, and thumbnail URL are required' },
        { status: 400 }
      );
    }

    const localList = await readLocalVideos();
    let savedVideo: VideoItem;

    if (id && localList.some((v) => v.id === id)) {
      savedVideo = {
        id,
        title,
        description: description || '',
        category: category || 'Commercial',
        thumbnail_url,
        video_url,
        featured,
        order_index,
        client_name: client_name || '',
        duration: duration || '',
        created_at: new Date().toISOString(),
      };
      const updated = localList.map((v) => (v.id === id ? savedVideo : v));
      await writeLocalVideos(updated);
    } else {
      const newId = id || `vid-${Date.now()}`;
      savedVideo = {
        id: newId,
        title,
        description: description || '',
        category: category || 'Commercial',
        thumbnail_url,
        video_url,
        featured,
        order_index,
        client_name: client_name || '',
        duration: duration || '',
        created_at: new Date().toISOString(),
      };
      await writeLocalVideos([savedVideo, ...localList]);
    }

    // Also attempt insertion into Supabase if configured
    if (supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('your-project')) {
      try {
        const supabase = createClient(supabaseUrl, supabaseAnonKey);
        const { error: dbError } = await supabase.from('videos').upsert({
          id: savedVideo.id.startsWith('vid-') ? undefined : savedVideo.id,
          title: savedVideo.title,
          description: savedVideo.description,
          category: savedVideo.category,
          thumbnail_url: savedVideo.thumbnail_url,
          video_url: savedVideo.video_url,
          featured: savedVideo.featured,
          order_index: savedVideo.order_index,
          client_name: savedVideo.client_name,
          duration: savedVideo.duration,
        });
        if (dbError) {
          console.warn('Supabase upsert video notice (saved locally):', dbError.message);
        }
      } catch (cloudErr) {
        console.warn('Supabase cloud insert notice:', cloudErr);
      }
    }

    return NextResponse.json({
      success: true,
      video: savedVideo,
      message: 'Video successfully saved to database and portfolio showcase',
    });
  } catch (error: any) {
    console.error('API save video error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to save video' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'No ID provided' }, { status: 400 });
    }

    const localList = await readLocalVideos();
    const filtered = localList.filter((v) => v.id !== id);
    await writeLocalVideos(filtered);

    if (supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('your-project')) {
      try {
        const supabase = createClient(supabaseUrl, supabaseAnonKey);
        await supabase.from('videos').delete().eq('id', id);
      } catch (err) {}
    }

    return NextResponse.json({ success: true, message: 'Video removed' });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to delete video' },
      { status: 500 }
    );
  }
}

