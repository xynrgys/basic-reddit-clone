'use client'

import Link from 'next/link'
import { useEffect } from 'react'

interface Post {
  id: string;
  title: string;
  content: string;
  user_id: string;
  subreddit_id: string;
  subreddit_name: string;
  created_at: string;
}

interface PostListProps {
  initialPosts: Post[]
}

export default function PostList({ initialPosts }: PostListProps) {
  useEffect(() => {
    console.log('Initial posts:', initialPosts)
  }, [initialPosts])

  return (
    <div>
      {initialPosts.map((post) => {
        console.log('Rendering post:', post)
        const href = `/r/${post.subreddit_name}/posts/${post.id}`
        console.log('Generated href:', href)

        return (
          <div key={post.id}>
            <Link href={href}>
              <h2>subreddit: {post.subreddit_name}</h2>
              <h2 className="font-bold">{post.title}</h2>
            </Link>
            <p>{post.content}</p>
            {/* Render other post details */}
          </div>
        )
      })}
    </div>
  )
}
