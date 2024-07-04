import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import PostContent from '@/components/PostContent'  // We'll create this component

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
    .select(`
      *,
      vote_count:post_votes(sum(vote_type))
    `)
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

  // Calculate the vote count
  const voteCount = post.vote_count?.[0]?.sum || 0;

  console.log('Post found:', post);

  return <PostContent post={{...post, voteCount}} />
}
