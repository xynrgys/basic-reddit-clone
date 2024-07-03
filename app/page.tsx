import { createClient } from '@/utils/supabase/server'
import SubredditList from '@/components/SubredditList'
import PostList from '@/components/PostList'
import Link from 'next/link'
import { SubmitButton } from './submit-button'

export interface Post {
  id: string;
  title: string;
  content: string;
  user_id: string;
  subreddit_id: string;
  created_at: string;
}

export default async function Home() {
  const supabase = createClient()

  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20)

  const safePosts: Post[] = posts || []

  const { data: { user } } = await supabase.auth.getUser()

  const signOut = async () => {
    'use server'
    const supabase = createClient()
    await supabase.auth.signOut()
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen py-2">
      <div className="flex justify-between w-full px-4 py-2">
        {user ? (
          <div className="flex items-center space-x-4">
            <p>Welcome, {user.email}</p>
            <form action={signOut}>
              <SubmitButton className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                Sign Out
              </SubmitButton>
            </form>
          </div>
        ) : (
          <Link href="/login" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Sign In
          </Link>
        )}
        <div className="flex space-x-4">
          <Link href="/create-subreddit" className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">
            Create Subreddit
          </Link>
          {user && (
            <Link href={`/user/${user.id}`} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
              Profile
            </Link>
          )}
        </div>
      </div>
      <SubredditList />
      <PostList initialPosts={safePosts} />
    </main>
  )
}
