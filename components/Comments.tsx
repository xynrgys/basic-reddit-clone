import { useState, useEffect } from 'react'
import { createClient } from "@/utils/supabase/client"

interface CommentsProps {
  postId: string;
}

interface Comment {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
}

export default function Comments({ postId }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const supabase = createClient()

  useEffect(() => {
    fetchComments()
  }, [postId])

  const fetchComments = async () => {
    console.log('Fetching comments for post:', postId);
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: true })

    console.log('Fetched comments:', data);
    console.log('Fetch error:', error);

    if (error) console.error('Error fetching comments:', error)
    else setComments(data || [])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      alert('You must be logged in to comment')
      return
    }

    console.log('Submitting comment:', newComment);
    const { data, error } = await supabase
      .from('comments')
      .insert({ content: newComment, user_id: user.id, post_id: postId })

    console.log('Comment submission result:', { data, error });

    if (error) {
      alert('Error creating comment: ' + error.message)
    } else {
      setNewComment('')
      fetchComments()
    }
  }

  return (
    <div>
      <h3>Comments ({comments.length})</h3>
      {comments.map((comment) => (
        <div key={comment.id}>
          <p>{comment.content}</p>
        </div>
      ))}
      <form onSubmit={handleSubmit}>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
        />
        <button type="submit">Post Comment</button>
      </form>
    </div>
  )
}
