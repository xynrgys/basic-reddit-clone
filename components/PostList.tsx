import Link from 'next/link'
import { Post } from '@/app/types'

interface PostListProps {
  initialPosts: Post[]
}

export default function PostList({ initialPosts }: PostListProps) {
  return (
    <div>
      {initialPosts.map((post) => (
        <div key={post.id}>
          <Link href={`/r/${post.subreddit_name}/posts/${post.id}`}>
            <h2>subreddit: {post.subreddit_name}</h2>
            <h2>{post.title}</h2>
          </Link>
          <p>{post.content}</p>
          {/* Render other post details */}
        </div>
      ))}
    </div>
  )
}
