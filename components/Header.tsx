import Image from 'next/image'

// vendors
import {
  MagnifyingGlassIcon,
  ChevronDownIcon,
  HomeIcon,
  Bars3Icon
} from '@heroicons/react/24/solid'

import {
  BellIcon,
  GlobeAltIcon,
  PlusIcon,
  SparklesIcon,
  VideoCameraIcon,
  ChatBubbleOvalLeftIcon,
  MegaphoneIcon
} from '@heroicons/react/24/outline'
import { signIn, signOut, useSession } from 'next-auth/react'
import { useEffect } from 'react'
import Link from 'next/link'

function Header() {
  const { data: session } = useSession()
  useEffect(() => {
    console.log(session)
  }, [session])
  return (
    <header className='sticky top-0 z-50 flex bg-white px-4 py-2 shadow-sm items-center'>
      <figure className='relative h-10 w-20 flex-shrink-0 cursor-pointer'>
        <Link href="/">
          <Image src="/reddit_logo.svg" objectFit="contain" layout="fill" alt="reddit logo" />
        </Link>
      </figure>
      <nav className='flex items-center mx-7 xl:min-w-[300px]'>
        <HomeIcon className='h-5 w-5' />
        <p className="flex-1 ml-2 hidden lg:inline"> Home </p>
        <ChevronDownIcon className='h-5 w-5' />
      </nav>

      {/*Search Box*/}
      <form className='flex flex-1 items-center space-x-2 border-gray-200 rounded-sm bg-gray-100 px-3 py-1'>
        <MagnifyingGlassIcon className="h-5 w-5 text-gray-500" />
        <input className='flex-1 bg-transparent outline-none' type="text" placeholder="Search Reddit" />
        <button type='submit' hidden />
      </form>
      <nav className="hidden text-gray-500 mx-5 items-center space-x-2  lg:inline-flex">
        <SparklesIcon className='icon' />
        <GlobeAltIcon className='icon' />
        <VideoCameraIcon className='icon' />
        <hr className='h-10 border border-gray-100' />
        {/* <ChatBubbleOvalLeftIcon className='icon' /> */}
        {/* <BellIcon className='icon' /> */}
        {/* <PlusIcon className='icon' /> */}
        {/* <MegaphoneIcon className='icon' /> */}
        <p className='truncate'>{session?.user?.name} </p>
        {session && <hr className='h-10 border border-gray-100' />}
      </nav>
      <div className='ml-5 flex items-center lg:hidden'>
        <Bars3Icon className='icon' />
      </div>
      {session &&
        <div onClick={() => { signOut() }} className='hidden lg:flex items-center cursor-pointer border-gray-100 space-x-2 p-2 '>
          <p className='text-gray-500'>Sign out </p>
        </div>
      }
      {!session &&
        <div onClick={() => { signIn() }} className='hidden lg:flex items-center cursor-pointer border-gray-100 space-x-2 p-2 '>
          <p className='text-gray-500'>Sign in </p>
        </div>
      }
    </header>
  )
}

export default Header
