'use client';

import { useState, useEffect } from 'react'
import { createClient } from "@/utils/supabase/client";

interface SubscribeButtonProps {
  subredditId: string;
}

export default function SubscribeButton({ subredditId }: SubscribeButtonProps) {
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    let isMounted = true;
    const checkSubscription = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data, error } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .eq('subreddit_id', subredditId)

        if (error) {
          console.error('Error checking subscription:', error)
        } else if (isMounted) {
          setIsSubscribed(!!data && data.length > 0)
        }
      }
      if (isMounted) setIsLoading(false)
    }

    checkSubscription()
    return () => { isMounted = false }
  }, [subredditId, supabase])

  const handleSubscribe = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      alert('You must be logged in to subscribe')
      return
    }

    setIsLoading(true)
    if (isSubscribed) {
      const { error } = await supabase
        .from('subscriptions')
        .delete()
        .eq('user_id', user.id)
        .eq('subreddit_id', subredditId)

      if (error) {
        console.error('Error unsubscribing:', error)
        alert('Failed to unsubscribe. Please try again.')
      } else {
        setIsSubscribed(false)
      }
    } else {
      const { error } = await supabase
        .from('subscriptions')
        .insert({ user_id: user.id, subreddit_id: subredditId })

      if (error) {
        console.error('Error subscribing:', error)
        alert('Failed to subscribe. Please try again.')
      } else {
        setIsSubscribed(true)
      }
    }
    setIsLoading(false)
  }

  if (isLoading) return <button disabled>Loading...</button>

  return (
    <button onClick={handleSubscribe} disabled={isLoading}>
      {isSubscribed ? 'Unsubscribe' : 'Subscribe'}
    </button>
  )
}
