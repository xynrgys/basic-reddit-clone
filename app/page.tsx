import { createClient } from '@/utils/supabase/server'
import SubredditList from '@/components/SubredditList'
import PostList from '@/components/PostList'

interface Post {
  id: string;
  title: string;
  content: string;
  subreddit_name: string;
  upvotes: number;
}

export default async function Home() {
  const supabase = createClient()
  
  // Fetch recent posts
  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20)

  // Ensure posts is always an array
  const safePosts: Post[] = posts || []

  return (
    <main>
      <SubredditList />
      <PostList initialPosts={safePosts} />
    </main>
  )
}
