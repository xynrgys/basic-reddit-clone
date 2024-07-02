'use client'

import { useState } from 'react'
import { createClient } from "@/utils/supabase/client"
import { useRouter } from 'next/navigation'

interface CreatePostProps {
  subredditId: string;
}

export default function CreatePost({ subredditId }: CreatePostProps) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [error, setError] = useState('')
  const supabase = createClient()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      setError('You must be logged in to create a post')
      return
    }

    const { data, error: insertError } = await supabase
      .from('posts')
      .insert({ 
        title,
        content,
        user_id: user.id,
        subreddit_id: subredditId
      })
      .select()

    if (insertError) {
      console.error('Error creating post:', insertError)
      setError('Error creating post: ' + insertError.message)
    } else if (data) {
      setTitle('')
      setContent('')
      router.refresh() // This will refresh the current page, showing the new post
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Post title"
        required
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Post content"
        required
      />
      {error && <p style={{color: 'red'}}>{error}</p>}
      <button type="submit">Create Post</button>
    </form>
  )
}
