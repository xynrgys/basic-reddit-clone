import { createClient } from "@/utils/supabase/server";

interface Post {
  id: string;
  title: string;
  content: string;
  user_id: string;
  subreddit_id: string;
  subreddit_name: string;
  created_at: string;
}

interface PageProps {
  params: { id: string };
}

interface Subreddit {
  id: string;
  name: string;
}

interface Profile {
  id: string;
  username: string;
}

export default async function UserProfile({ params }: PageProps) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()

  const { data: subscriptions } = await supabase
    .from('subscriptions')
    .select('subreddits(*)')
    .eq('user_id', params.id)

  const { data: upvotedPosts } = await supabase
    .from('upvotes')
    .select('posts(*)')
    .eq('user_id', params.id)

  // Fetch total upvotes received by the user
  const { data: totalUpvotesData, error: totalUpvotesError } = await supabase
    .from('posts')
    .select('upvotes')
    .eq('user_id', params.id)

  let totalUpvotesReceived = 0
  if (!totalUpvotesError && totalUpvotesData) {
    totalUpvotesReceived = totalUpvotesData.reduce((sum, post) => sum + (post.upvotes || 0), 0)
  }

  if (!user) {
    return <div>User not found</div>
  }

  return (
    <div>
      <h1>{user.email}'s Profile</h1>
      <h2>Total Upvotes Received: {totalUpvotesReceived}</h2>
      
      <h2>Subscribed Subreddits</h2>
      <ul>
        {subscriptions && subscriptions.length > 0 ? (
          subscriptions.map((sub: { subreddits: Subreddit | Subreddit[] }) => {
            const subreddit = Array.isArray(sub.subreddits) ? sub.subreddits[0] : sub.subreddits;
            return (
              <li key={subreddit?.id}>{subreddit?.name}</li>
            );
          })
        ) : (
          <li>No subscriptions yet</li>
        )}
      </ul>

      <h2>Upvoted Posts</h2>
      <ul>
        {upvotedPosts && upvotedPosts.length > 0 ? (
          upvotedPosts.map((upvote: { posts: Post | Post[] }) => {
            const post = Array.isArray(upvote.posts) ? upvote.posts[0] : upvote.posts;
            return (
              <li key={post?.id}>{post?.title}</li>
            );
          })
        ) : (
          <li>No upvoted posts yet</li>
        )}
      </ul>
    </div>
  )
}