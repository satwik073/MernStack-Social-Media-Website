import React from 'react'
import SearchUsers from '../Components/SearchUsers'
import AvatarsStory from '../Components/AvatarsStory'
import SocialMediaPost from '../Components/SocialMediaPost'
import AllPostsDisplayed from '../Components/AllPostsDisplayed'

const PostsCompiled = () => {
  return (
    <div className='  w-full'>
     <div className='mt-5'>
     <SearchUsers/>

     </div>
      <div className=' max-h-full overflow-y-auto hideScroll  mx-7'>
        <div className='max-h-[83vh] overflow-y-auto hideScroll'>
        <AvatarsStory/>

        {/* <SocialMediaPost/> */}
      <AllPostsDisplayed/>
        </div>
    </div>
    </div>
  )
}

export default PostsCompiled
