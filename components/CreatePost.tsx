'use client'

import { useState } from 'react'
import { createClient } from "@/utils/supabase/client";
import { useRouter } from 'next/navigation'

export default function CreatePost({ subredditId }) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const supabase = createClient()
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { data: user } = await supabase.auth.getUser()
    
    if (!user) {
      alert('You must be logged in to create a post')
      return
    }

    const { data, error } = await supabase
      .from('posts')
      .insert({ title, content, user_id: user.id, subreddit_id: subredditId })

    if (error) {
      alert('Error creating post: ' + error.message)
    } else {
      router.refresh()
      setTitle('')
      setContent('')
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
      />
      <button type="submit">Create Post</button>
    </form>
  )
}
