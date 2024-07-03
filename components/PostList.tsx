import Link from 'next/link'

export interface Post {
  id: string;
  title: string;
  content: string;
  user_id: string;
  subreddit_id: string;
  created_at: string;
}

interface PostListProps {
  initialPosts: Post[]
}

export default function PostList({ initialPosts }: PostListProps) {
  return (
    <div>
      {initialPosts.map((post) => (
        <div key={post.id}>
          <Link href={`/r/${post.subreddit_id}/posts/${post.id}`}>
            <h2>{post.title}</h2>
          </Link>
          <p>{post.content}</p>
          {/* Render other post details */}
        </div>
      ))}
    </div>
  )
}
