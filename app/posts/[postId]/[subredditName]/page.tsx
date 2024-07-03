import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'

interface PageProps {
  params: {
    subredditName: string
    postId: string
  }
}

export default async function PostPage({ params }: PageProps) {
  const { subredditName, postId } = params
  const supabase = createClient()

  const { data: post, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', postId)
    .eq('subreddit_name', subredditName)
    .single()

  if (error || !post) {
    notFound()
  }

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      {/* Render other post details */}
    </div>
  )
}
