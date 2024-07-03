import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'

interface PageProps {
  params: {
    subredditId: string
    postId: string
  }
}

export default async function PostPage({ params }: PageProps) {
  const { subredditId, postId } = params
  const supabase = createClient()

  // Fetch the subreddit data based on the subredditId
  const { data: subreddit, error: subredditError } = await supabase
    .from('subreddits')
    .select('name')
    .eq('id', subredditId)
    .single()

  if (subredditError || !subreddit) {
    notFound()
  }

  // Fetch the post data based on the postId and subredditId
  const { data: post, error: postError } = await supabase
    .from('posts')
    .select('*')
    .eq('id', postId)
    .eq('subreddit_id', subredditId)
    .single()

  if (postError || !post) {
    notFound()
  }

  return (
    <div>
      <h1>{post.title}</h1>
      <p>Subreddit: {subreddit.name}</p>
      <p>{post.content}</p>
      {/* Render other post details */}
    </div>
  )
}
