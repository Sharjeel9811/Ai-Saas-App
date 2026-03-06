
import { useAuth } from '@clerk/clerk-react'
import { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
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
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/ai' element={<Layout/>}>
      <Route index element={<Dashboard/>}/>
      <Route path='write-article' element={<WriteArticle/>}/>
       <Route path='blog-titles' element={<BlogTitles/>}/>
        <Route path='generate-images' element={<GenerateImages/>}/>
        <Route path='remove-background' element={<RemoveBackground/>}/>
          <Route path='remove-object' element={<RemoveObject/>}/>
            <Route path='review-resume' element={<ReveiewResume/>}/>
  <Route path='community' element={<Community/>}/>





      </Route>
    </Routes>

    </>
  )
}

export default App

