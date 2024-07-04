import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { postId: string } }
) {
  console.log('API route hit', params);
  const supabase = createClient()
  const { postId } = params

  console.log('Querying Supabase for post:', postId);
  const { data: post, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', postId)
    .single()

  console.log('Supabase query result:', { post, error });

  if (error) {
    console.error('Supabase error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!post) {
    console.log('Post not found');
    return NextResponse.json({ error: 'Post not found' }, { status: 404 })
  }

  console.log('Returning post:', post);
  return post
}
