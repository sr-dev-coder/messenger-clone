'use client'
import Image from "next/image"
import { User } from '@prisma/client'

interface AvatarProps{
    user?: User;
}

const Avatar: React.FC<AvatarProps> = ({ user }) => {
  console.log(user);
  return (
    <div className='relative'>
        <div className="relative bg-gray-400 inline-block rounded-full overflow-hidden h-9 w-9 md:h-11 md:w-11">
          {
            user?.image && (<Image src={user?.image as string} alt="" fill />)
          }
            
        </div>
            <span className='absolute block rounded-full bg-green-500 ring-2 ring-white top-0 right-0 h-2 w-2 md:h-3 md:w-3'></span>
    </div>
  )
}

export default Avatar