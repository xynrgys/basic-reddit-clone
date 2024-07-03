import Link from 'next/link'

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
