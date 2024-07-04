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

interface Subscription {
  subreddit: Subreddit;
}

interface Profile {
  id: string;
  username: string;
}

export default async function UserProfile({ params }: PageProps) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()

  // Fetch subscriptions with subreddit details
  const { data: subscriptions, error: subscriptionError } = await supabase
    .from('subscriptions')
    .select(`
      subreddit:subreddits (
        id,
        name
      )
    `)
    .eq('user_id', params.id)

  console.log('Subscriptions:', subscriptions);
  console.log('Subscription error:', subscriptionError);

  // Fetch upvoted posts using the post_votes table
  const { data: upvotedPosts } = await supabase
    .from('post_votes')
    .select('posts(*)')
    .eq('user_id', params.id)
    .eq('vote_type', 1)  // 1 represents an upvote

  // Fetch total upvotes received by the user
  const { data: userPosts, error: userPostsError } = await supabase
    .from('posts')
    .select('id')
    .eq('user_id', params.id)

  let totalUpvotesReceived = 0
  if (!userPostsError && userPosts) {
    const postIds = userPosts.map(post => post.id)
    const { count, error: countError } = await supabase
      .from('post_votes')
      .select('*', { count: 'exact', head: true })
      .in('post_id', postIds)
      .eq('vote_type', 1)

    if (!countError) {
      totalUpvotesReceived = count || 0
    }
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
          subscriptions.flatMap((sub: Subscription) => 
            sub.subreddit.map((subreddit: Subreddit) => (
              <li key={subreddit.id}>{subreddit.name}</li>
            ))
          )
        ) : (
          <li>No subscriptions yet</li>
        )}
      </ul>
      <h2>Upvoted Posts</h2>
      <ul>
        {upvotedPosts && upvotedPosts.length > 0 ? (
          upvotedPosts.map((vote: { posts: Post | Post[] }) => {
            const post = Array.isArray(vote.posts) ? vote.posts[0] : vote.posts;
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
