import { createClient } from "@/utils/supabase/server";
import { cookies } from 'next/headers'
import SubredditList from '@/components/SubredditList'
import PostList from '@/components/PostList'

export default async function Home() {
  const supabase = createClient({ cookies })
  
  // Fetch recent posts
  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20)

  return (
    <main>
      <SubredditList />
      <PostList posts={posts} />
    </main>
  )
}
