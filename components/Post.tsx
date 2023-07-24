// vendors
import {
  ArrowUpIcon,
  ArrowDownIcon,
  ChatBubbleLeftIcon
} from '@heroicons/react/24/outline'

import Avatar from './Avatar'
import TimeAgo from 'react-timeago'
import Link from 'next/link'
import { Jelly } from '@uiball/loaders'
import { useSession } from 'next-auth/react'
import { toast } from 'react-hot-toast'
import { useEffect, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { GET_ALL_VOTES_BY_POST_ID } from '@/graphql/queries'
import { ADD_VOTE } from '@/graphql/mutations'

type Props = {
  post: Post
}

function Post({ post }: Props) {
  const [vote, setVote] = useState<boolean>()

  const { data: session } = useSession()
  const { data, loading, error } = useQuery(GET_ALL_VOTES_BY_POST_ID, {
    variables: {
      id: post?.id
    }
  })

  useEffect(() => {
    const votes: Vote[] = data?.getVotesByPostId;

    const vote: any = votes?.find(vote => vote?.username == session?.user?.name)?.upvote
    console.log("vote value", vote)
    console.log(data)

    setVote(vote)
  }, [data, loading])

  const [addVote] = useMutation(ADD_VOTE, {
    refetchQueries: [GET_ALL_VOTES_BY_POST_ID]
  })

  const upvote = async (isUpvote: boolean) => {
    if (!session) {
      toast.error("Please sign in to vote")
      return
    }

    if (vote && isUpvote) return;
    if (vote === false && !isUpvote) return;

    console.log("voting...")

    await addVote({
      variables: {
        post_id: post?.id,
        username: session?.user?.name,
        upvote: isUpvote
      }
    })

    console.log("Voted")

  }

  const displayVotes = (data: any) => {
    const votes: Vote[] = data?.getVotesByPostId
    const displayNumber = votes?.reduce((total, vote) => (vote.upvote ? (total += 1) : (total -= 1)), 0)

    if (votes?.length == 0) return 0
    if (displayNumber === 0) {
      return votes[0]?.upvote ? 1 : -1
    }

    return displayNumber
  }


  if (!post) return (
    <div className='flex w-full items-center  justify-center p-10 text-xl'>
      <Jelly size={50} color="#FF4501" />
    </div>
  )

  return (
    <Link href={`/post/${post.id}`} >
      <div className="flex mt-5 mb-5 cursor-pointer rounded-md border border-gray-300 bg-white shadow-sm hover:border hover:border-gray-600">
        {/*votes*/}

        <div className='flex flex-col items-center justify-start space-y-1 rounded-l-md bg-gray-50 p-4 text-gray-400'>
          <ArrowUpIcon onClick={() => upvote(true)} className={`voteButtons hover:text-blue-400 ${vote && 'text-blue-400'}`} />
          <p className='text-xs font-bold text-black'> {displayVotes(data)} </p>
          <ArrowDownIcon onClick={() => upvote(false)} className={`voteButtons hover:text-red-400 ${vote === false && 'text-red-400'}`} />
        </div>

        <div className='p-3 pb-1'>
          <div className='flex items-center space-x-2'>
            <Avatar seed={post.subreddit[0]?.topic} />
            <p className='text-xs text-gray-400'>
              <Link href={`/subreddit/${post.subreddit[0]?.topic}`}>
                <span className='font-bold text-black hover:text-blue-400 hover:underline'>r/{post.subreddit[0]?.topic}</span>
              </Link>
              &nbsp; - Posted by u/{post.username} <TimeAgo date={post.created_at} />
            </p>
          </div>
          <div className='py-4'>
            <h2 className='text-xl font-semibold'>{post.title} </h2>
            <p className="mt-2 text-sm font-light ">{post.body} </p>
          </div>

          {post.image && <img className="w-full" src={post.image} alt="post image" />}

          <div className='flex flex-row flex-nowrap space-x-4 text-gray-400'>
            <div className="postButtons">
              <ChatBubbleLeftIcon className='h-6 w-6' />
              <p className=''>{post.comments.length} </p>
            </div>
          </div>
        </div>
      </div>
    </Link >
  )
}

export default Post
