import { useSession } from "next-auth/react"
import Avatar from "./Avatar"
import { LinkIcon, PhotoIcon } from '@heroicons/react/24/outline'
import { useForm } from 'react-hook-form'
import { useState } from "react"
import { useMutation } from "@apollo/client"
import { ADD_POST, ADD_SUBREDDIT } from "@/graphql/mutations"
import client from "../apollo-client"
import { GET_ALL_POSTS, GET_ALL_POSTS_BY_TOPIC, GET_SUBREDDIT_BY_TOPIC } from "@/graphql/queries"
import { toast } from "react-hot-toast"

type formData = {
  postTitle: string,
  postBody: string,
  postImage: string,
  subreddit: string
}

type Props = {
  subreddit?: string
}

function PostBox({ subreddit }: Props) {
  const { data: session } = useSession()
  const [imageBoxOpen, setImageBoxOpen] = useState(false)
  const { register, setValue, handleSubmit, watch, formState: { errors } } = useForm<formData>()
  const [addPost] = useMutation(ADD_POST, {
    refetchQueries: subreddit ? [GET_ALL_POSTS_BY_TOPIC] : [GET_ALL_POSTS]
  })
  const [addSubreddit] = useMutation(ADD_SUBREDDIT)

  const onSubmit = handleSubmit(async (formData) => {
    const notification = toast.loading('Creating new post...')
    try {
      console.log(formData)
      await client.clearStore()
      const { data: { getSubredditListByTopic } } = await client.query({
        query: GET_SUBREDDIT_BY_TOPIC,
        variables: {
          topic: subreddit || formData.subreddit
        },
      })


      console.log(formData)
      console.log(getSubredditListByTopic)

      const subredditExists = getSubredditListByTopic.length > 0;
      console.log(subredditExists)

      if (!subredditExists) {
        console.log("subreddit is new. creating a new subreddit")

        const { data: { insertSubreddit: newSubreddit } } = await addSubreddit({
          variables: {
            topic: subreddit || formData.subreddit
          }
        })

        console.log("creating a post")
        const image = formData.postImage || ''
        const { data: { insertPost: newPost } } = await addPost({
          variables: {
            body: formData.postBody,
            image: image,
            subreddit_id: newSubreddit.id,
            title: formData.postTitle,
            username: session?.user?.name
          }
        })

        console.log(`new post added`, newPost)

      } else {
        const image = formData.postImage || ''

        const { data: { insertPost: newPost } } = await addPost({
          variables: {
            body: formData.postBody,
            image: image,
            subreddit_id: getSubredditListByTopic[0].id,
            title: formData.postTitle,
            username: session?.user?.name
          }
        })

        console.log(`new post added`, newPost)
      }

      // after post has been added
      setValue('postBody', '')
      setValue('postTitle', '')
      setValue('postImage', '')
      setValue('subreddit', '')

      toast.success('New post created.', {
        id: notification
      })

    } catch (error) {

      console.log(error)

      toast.error('something went wrong', {
        id: notification
      })

    }
  })

  return (
    <form onSubmit={onSubmit} className="sticky top-16 bg-white border rounded-md border-gray-300 p-2">
      <div className="flex items-center soace-x-3">
        <Avatar />
        <input
          {...register('postTitle', { required: true })}
          className="rounded-md bg-gray-50 p-2 pl-5 outline-none flex-1"
          type="text"
          placeholder={
            session ? subreddit ? `Create a post in r/${subreddit}` : "Create a post by entering a title!" : "Sign in to post."
          }
          disabled={!session} />
        <PhotoIcon
          onClick={() => setImageBoxOpen(!imageBoxOpen)}
          className={`h-6 mr-3 text-gray-300 cursor-pointer ${imageBoxOpen && 'text-blue-300'}`}
        />
        <LinkIcon className="h-6 text-gray-300" />
      </div>
      {!!watch('postTitle') && (
        <div className="flex flex-col py-2">
          <div className="flex items-center px-2">
            <p className="min-w-[90px]">Body:</p>
            <input
              className="m-2 flex-1 bg-blue-50 p-2 outline-none"
              {...register('postBody')}
              type="text"
              placeholder="Text (optional)"
            />
          </div>

          {!subreddit &&
            <div className="flex items-center px-2">
              <p className="min-w-[90px]">Subreddit: </p>
              <input
                className="m-2 flex-1 bg-blue-50 p-2 outline-none"
                {...register('subreddit', { required: true })}
                type="text"
                placeholder="i.e, pytorch"
              />
            </div>
          }

          {imageBoxOpen && (
            <div className="flex items-center px-2">
              <p className="min-w-[90px]">Image URL: </p>
              <input
                className="m-2 flex-1 bg-blue-50 p-2 outline-none"
                {...register('postImage')}
                type="text"
                placeholder="Optional..."
              />
            </div>
          )}

          {Object.keys(errors).length > 0 && (
            <div className="space-y-2 p-2 text-red-500">
              {errors.postTitle?.type === 'required' && (
                <p>- A Post Title is required</p>
              )}
              {errors.subreddit?.type === 'required' && (
                <p>- A Subreddit is required</p>
              )}
            </div>
          )}

          {!!watch('postTitle') && <button type="submit" className="w-full mt-2 rounded-full bg-blue-400 p-2 text-white"> Create Post </button>}
        </div>
      )}
    </form>
  )
}

export default PostBox
