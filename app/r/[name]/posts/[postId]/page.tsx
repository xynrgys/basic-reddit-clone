import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import Comments from '@/components/Comments'  // Adjust this import path as necessary

interface PageProps {
  params: {
    name: string
    postId: string
  }
}

export default async function PostPage({ params }: PageProps) {
  const { name, postId } = params
  const supabase = createClient()

  console.log('Fetching post with:', { name, postId });

  const { data: post, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', postId)
    .eq('subreddit_name', name)
    .single()

  console.log('Query result:', { post, error });

  if (error) {
    console.error('Error fetching post:', error);
    notFound()
  }

  if (!post) {
    console.log('No post found');
    notFound()
  }

  console.log('Post found:', post);

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      {/* Render other post details */}
      <Comments postId={postId} />
    </div>
  )
}
