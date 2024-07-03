'use client';

import { useState, useEffect } from 'react'
import { createClient } from "@/utils/supabase/client";

interface SubscribeButtonProps {
  subredditId: string;
}

export default function SubscribeButton({ subredditId }: SubscribeButtonProps) {
  const [isSubscribed, setIsSubscribed] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const checkSubscription = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data, error } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .eq('subreddit_id', subredditId)
          .single()

        if (error) {
          console.error('Error checking subscription:', error)
        } else {
          setIsSubscribed(!!data)
        }
      }
    }

    checkSubscription()
  }, [subredditId, supabase])

  const handleSubscribe = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      alert('You must be logged in to subscribe')
      return
    }

    if (isSubscribed) {
      const { error } = await supabase
        .from('subscriptions')
        .delete()
        .eq('user_id', user.id)
        .eq('subreddit_id', subredditId)

      if (error) {
        console.error('Error unsubscribing:', error)
      } else {
        setIsSubscribed(false)
      }
    } else {
      console.log('Inserting subscription...') // Add this line

      const { error } = await supabase
        .from('subscriptions')
        .insert({ user_id: user.id, subreddit_id: subredditId })

      console.log('Insert operation completed:', error) // Add this line

      if (error) {
        console.error('Error subscribing:', error)
        // ... (rest of the error handling code)
      } else {
        setIsSubscribed(true)
      }
    }
  }

  return (
    <button onClick={handleSubscribe}>
      {isSubscribed ? 'Unsubscribe' : 'Subscribe'}
    </button>
  )
}
