'use client'

import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import { useState, useEffect } from 'react'
import Comments from '@/components/Comments'  // Adjust this import path as necessary

interface PageProps {
  params: {
    name: string
    postId: string
  }
}

export default function PostPage({ params }: PageProps) {
  const { name, postId } = params
  const [post, setPost] = useState<any>(null)
  const [error, setError] = useState<any>(null)

  useEffect(() => {
    const fetchPost = async () => {
      const supabase = createClient()
      console.log('Fetching post with:', { name, postId });

      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', postId)
        .eq('subreddit_name', name)
        .single()

      console.log('Supabase query result:', { data, error });

      if (error) {
        console.error('Error fetching post:', error);
        setError(error)
      } else if (!data) {
        console.log('No post found');
        setError(new Error('No post found'))
      } else {
        console.log('Post found:', data);
        setPost(data)
      }
    }

    fetchPost()
  }, [name, postId])

  if (error) {
    return <div>Error: {JSON.stringify(error)}</div>
  }

  if (!post) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      {/* Render other post details */}
      <Comments postId={postId} />
    </div>
  )
}
