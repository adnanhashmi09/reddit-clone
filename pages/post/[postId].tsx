import Avatar from "@/components/Avatar";
import Post from "@/components/Post";
import { ADD_COMMENT } from "@/graphql/mutations";
import { GET_ALL_POSTS_BY_ID } from "@/graphql/queries";
import { useMutation, useQuery } from "@apollo/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from "react-hot-toast";
import TimeAgo from 'react-timeago'

type FormData = {
  comment: string
}

export default function PostPage() {
  const router = useRouter()
  const [addComment] = useMutation(ADD_COMMENT, {
    refetchQueries: [GET_ALL_POSTS_BY_ID]
  })
  const { data, loading } = useQuery(GET_ALL_POSTS_BY_ID, {
    variables: {
      id: router.query.postId
    }
  })

  const { data: session } = useSession()

  const post: Post = data?.postListById;

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>()

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    // post comment here
    const notification = toast.loading("posting comment...")

    await addComment({
      variables: {
        post_id: router.query.postId,
        username: session?.user?.name,
        text: data.comment
      }
    })

    setValue('comment', '')
    toast.success('Comment posted.', {
      id: notification
    })
  }

  return (
    <div className="mx-auto my-7 max-w-5xl">
      <Post post={post} />

      {!loading &&
        <>
          <div className="-mt-6 rounded-b-md border border-t-0 border-gray-300 bg-white p-5 pl-16">
            <p className="text-sm"> Comment as <span className="text-red-500">{session?.user?.name}</span> </p>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-2">
              <textarea
                {...register('comment')}
                disabled={!session}
                className="h-24 rounded-md border border-gray-200 p-2 pl-4 outline-none disabled:bg-gray-50"
                placeholder={
                  session ? 'What are your thoughts?' : 'Please sign in to comment'
                }
              />
              <button disabled={!session} type='submit' className="rounded-full bg-red-500 p-3 font-semibold text-white disabled:bg-gray-200"> Comment </button>

            </form>
          </div>

          <div className="-my-5 rounded-b-md border border-t-0 border-gray-300 bg-white py-5 px-10 ">
            <hr className="py-2" />
            {post?.comments.map(comment => (
              <div key={comment.id} className="relative flex items-center space-x-2 space-y-5">
                <hr className="absolute top-10 h-16 border left-7 z-0" />
                <div className="z-50">
                  <Avatar seed={comment.username} />
                </div>
                <div className="flex flex-col">
                  <p className="py-2 text-xs text-gray-400">
                    <span className="font-semibold text-gray-600">{comment.username} </span>
                    <TimeAgo date={comment.created_at} />
                  </p>
                  <p>{comment.text}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      }

    </div>
  )
}
