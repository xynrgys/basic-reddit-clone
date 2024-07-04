import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'

interface PageProps {
  params: {
    name: string
    postId: string
  }
}

export default async function PostPage({ params }: PageProps) {
  const { name, postId } = params
  const supabase = createClient()

  console.log('Params:', params);
  console.log('Fetching post with:', { name, postId });

  const { data: post, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', postId)
    .eq('subreddit_name', name)
    .single()

  console.log('Supabase query result:', { post, error });

  if (error) {
    console.error('Error fetching post:', error);
    // return <div>Error: {JSON.stringify(error)}</div>;
    notFound()
  }

  if (!post) {
    console.log('No post found');
    // return <div>Error: No post found</div>;
    notFound()
  }

  console.log('Post found:', post);

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      {/* Render other post details */}
    </div>
  )
}
