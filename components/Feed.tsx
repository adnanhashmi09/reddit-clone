import { GET_ALL_POSTS, GET_ALL_POSTS_BY_TOPIC } from "@/graphql/queries";
import { useQuery } from "@apollo/client";
import Post from "./Post";
import Skeleton from "./Skeleton";

type Props = {
  topic?: string
}

function Feed({ topic }: Props) {

  const { data, loading, error } = useQuery(!topic ? GET_ALL_POSTS : GET_ALL_POSTS_BY_TOPIC, !topic ? {} : {
    variables: {
      topic: topic
    }
  })

  // Check for loading state
  if (loading) {
    return <Skeleton />
  }

  // Check for error state
  if (error) {
    return <p>Error</p>;
  }

  if (data) {
    const posts: Post[] = !topic ? data?.postList : data?.postListByTopic;
    return (
      <div className="mt-5 space-y-4">
        {posts?.map((post: Post) => (
          <Post key={`post-${post.id}`} post={post} />
        ))}
      </div>
    );
  }
}


export default Feed;
