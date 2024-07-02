import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import CreatePost from '@/components/CreatePost'
import PostList from '@/components/PostList'

export default async function SubredditPage({ params }: { params: { name: string } }) {
  const supabase = createClient()

  const { data: subreddit, error } = await supabase
    .from('subreddits')
    .select('*')
    .eq('name', params.name)
    .single()

  if (error || !subreddit) {
    notFound()
  }

  // Fetch posts for this subreddit
  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .eq('subreddit_id', subreddit.id)
    .order('created_at', { ascending: false })

  return (
    <div>
      <h1>{subreddit.name}</h1>
      <p>{subreddit.description}</p>
      <CreatePost subredditId={subreddit.id} />
      <PostList initialPosts={posts || []} />
    </div>
  )
}
