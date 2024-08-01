// import './App.css';
import './index.css';
import Navbar from './components/Navbar/Navbar';
// import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Signup from './pages/Signup/Signup';
import Signup2 from './pages/Signup2/Signup2';
import Login from './pages/Login/Login';
import WatchProduct from './components/watchProduct/WatchProduct1'
import Home from './pages/Home/Home';
import { useDispatch, useSelector } from 'react-redux';
import 'react-toastify/dist/ReactToastify.css';
import Profile from './pages/Profile/Profile';
import { getOneUser } from './server/usersServer';
import { setUser } from './redux/reduxStore/authSlice';
import { useEffect, useState } from 'react';
import Menu from './components/Menu/Menu';
import Korzinka2 from './pages/Korzinka2/Korzinka2';
import { setKorzinka, setPriceKorzinka } from './redux/reduxStore/korzinkaSlice';
import Process from './pages/Process/Process';
import AddProduct from './pages/AddProduct/AddProduct';
import { toast } from 'react-toastify';
import { getAksiya } from './server/aksiyaServer';
import Loader from './pages/Loader/Loader';
import { getCategoryProducts } from './server/categoryServer';
import { stopRefresh } from './redux/reduxStore/storageSlice';

function App() {
  const {user } = useSelector(state => state.authSlice);
  const [categories , setCategories ] = useState([])
  const {korzinka } = useSelector(state => state.korzinkaSlice)
  const navigate = useNavigate();
  const {isRefresh } = useSelector(state => state.storageSlice)
  const dispatch = useDispatch()
  
  const handleGetUser = async () => {
    if(!user){
      const id = localStorage.getItem('myId')
      if(!id){
        return 
      } 
      const data = await getOneUser(id)
      dispatch(setUser(data.user))
    }
  }
  const handleGetCategories = async () => {
    try {
      const data = await getCategoryProducts();
      setCategories(data.categories)
    } catch (error) {
      toast.error(error.response.data.message)
    }
  }

  useEffect(() => {
    dispatch(setPriceKorzinka())
    
  } ,[korzinka])
  useEffect(() => {
    dispatch(setKorzinka())
    handleGetUser()
    handleGetCategories()
  } ,[])
  useEffect(() => {
    if(isRefresh == true){
      dispatch( stopRefresh())
      handleGetCategories()
    }
    
  } ,[isRefresh])
  return (
    <div className="App">
      <Routes>
        <Route path='/*' element={ categories.length > 0 ? <Home categories={categories} setCategories={setCategories} /> : <Loader /> } />
        <Route path='/process' element={<Process />} />
        <Route path='/menu/' element={<Menu />} />
        <Route path='/profile/*' element={<Profile />} />
        <Route path='/korzinka2' element={<Korzinka2/>} />
        {user?.role == "admin" && <Route path='/addProduct' element={<AddProduct />} />}
      </Routes>
    </div>
  );
}

export default App;
