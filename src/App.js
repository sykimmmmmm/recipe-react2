import { Route, Routes } from 'react-router-dom';
import Header from './Component/Header';
import {Home, NotFound, Register, Mypage, AddRecipe, Recipe, Login} from './pages/index'
import axios from 'axios'
import Footer from './Component/Footer';


function App() {
  axios.defaults.baseURL=`${process.env.REACT_APP_BASE_URL}`
  axios.defaults.withCredentials=true
  return (
    <>
      <Header/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/user/register' element={<Register/>}/>
        <Route path='/user/login' element={<Login/>}/>
        <Route path='/user/mypage' element={<Mypage/>}>
          <Route path=':id' element={<Mypage/>}/>
        </Route>
        <Route path='/recipe' element={<Recipe/>}>
          <Route path=':id' element={<Recipe/>}/>
        </Route>
        <Route path='/add-recipe' element={<AddRecipe/>}/>
        <Route path='*' element={<NotFound/>}/>
      </Routes>
      <Footer/>
    </>
  );
}

export default App;
