
import { useAuth } from '@clerk/clerk-react'
import { AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import AnimatedPage from './Components/AnimatedPage'
import BlogTitles from './Pages/BlogTitles'
import Community from './Pages/Community'
import Dashboard from './Pages/Dashboard'
import GenerateImages from './Pages/GenerateImages'
import Home from './Pages/Home'
import Layout from './Pages/Layout'
import RemoveBackground from './Pages/RemoveBackground'
import RemoveObject from './Pages/RemoveObject'
import ReveiewResume from './Pages/ReveiewResume'
import WriteArticle from './Pages/WriteArticle'

const App = () => {
   const {getToken, isSignedIn}=useAuth();
  const location = useLocation()

   useEffect(()=>{
    if(isSignedIn){
      getToken().then((token)=>{
        console.log('Token:', token);
      })
    } else {
      console.log('User not signed in');
    }
   },[isSignedIn, getToken])
  return (




    <>
    <AnimatePresence mode='wait'>
    <Routes location={location} key={location.pathname}>
      <Route path='/' element={<AnimatedPage><Home/></AnimatedPage>}/>
      <Route path='/ai' element={<Layout/>}>
      <Route index element={<AnimatedPage><Dashboard/></AnimatedPage>}/>
      <Route path='write-article' element={<AnimatedPage><WriteArticle/></AnimatedPage>}/>
       <Route path='blog-titles' element={<AnimatedPage><BlogTitles/></AnimatedPage>}/>
        <Route path='generate-images' element={<AnimatedPage><GenerateImages/></AnimatedPage>}/>
        <Route path='remove-background' element={<AnimatedPage><RemoveBackground/></AnimatedPage>}/>
          <Route path='remove-object' element={<AnimatedPage><RemoveObject/></AnimatedPage>}/>
            <Route path='review-resume' element={<AnimatedPage><ReveiewResume/></AnimatedPage>}/>
  <Route path='community' element={<AnimatedPage><Community/></AnimatedPage>}/>





      </Route>
    </Routes>
    </AnimatePresence>

    </>
  )
}

export default App

