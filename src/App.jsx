import './App.css'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import CheckEmail from './pages/CheckEmail'
import CheckPassword from './pages/CheckPassword'
import Home from './pages/Home'
import Register from './pages/Register'
import MessagePage from './pages/MessagePage'
import Layout from './components/layout/Layout'
import {Toaster} from 'react-hot-toast'
import ForgotPassword from './pages/ForgotPassword'
import Logout from './pages/Logout'
import {Provider} from 'react-redux'
import store from './components/redux/store'

function App() {
  
  return (
    <Provider store={store}>
         <Toaster/>
         
        <BrowserRouter>

             <Routes>
                   <Route element={<Layout/>}>
                   
                   <Route path="/register" element={<Register/>}/>
                   <Route path='/email' element={<CheckEmail/>}/>
                   <Route path='/password' element={<CheckPassword/>}/>
                   <Route path='/forgot-password' element={<ForgotPassword/>}/>

                   </Route> 

                  <Route path='/' element= {<Home/>}>
                    <Route path=':userId' element={<MessagePage/>}/>
                  </Route>

                  <Route path='/logout' element={<Logout/>}/>

             </Routes>

        </BrowserRouter>
        
    </Provider>
  )
}

export default App
