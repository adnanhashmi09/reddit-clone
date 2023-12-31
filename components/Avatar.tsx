import { useSession } from "next-auth/react"
import Image from 'next/image'

type Props = {
  seed?: string,
  large?: boolean,
  type?: string,
}

function Avatar({ seed, large, type = "open-peeps" }: Props) {
  const { data: session } = useSession()

  return (
    <div className={`relative h-10 w-10 overflow-hidden rounded-full border-gray-300 bg-white ${large && 'h-20 w-20'}`}>
      <Image
        layout="fill"
        src={`https://avatars.dicebear.com/api/${type}/${seed || 'placeholder'}.svg`}
        alt="dicebear avatar"
      />
    </div>
  )

}

export default Avatar
