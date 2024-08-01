import React, { useEffect, useState } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import { getAllCategories, getCategoryProducts } from '../../server/categoryServer'
import "./Home.scss"
import { getAksiya } from '../../server/aksiyaServer'
import FireImage from "../../img/Fire.png"
import CheckMap from '../../components/CheckMap/CheckMap'
import { updateUser } from '../../server/usersServer'
import { toast } from 'react-toastify'
import ProductItem from '../../components/ProductItem/ProductItem'
import Login from '../Login/Login'
import Signup from '../Signup/Signup'
import Signup2 from '../Signup2/Signup2'
import { setMenuStorage } from '../../redux/reduxStore/storageSlice'
import { useDispatch, useSelector } from 'react-redux'
import WatchProduct from '../../components/watchProduct/WatchProduct1'
import { getKombo } from '../../server/komboServer'
import KomboPng from '../../img/Combo.png'
import Slider from "react-slick";
import PlaneImage from '../../img/Group 92.png'
import FilterModal from '../../components/FilterModal/FilterModal'
import { setUser } from '../../redux/reduxStore/authSlice'


const Home = ({categories , setCategories}) => {
    // const [categories , setCategories ] = useState([]);
    const [aksiya , setAksiya ] = useState([]);
    const [openMap , setOpenMap ]  = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalInfo , setModalInfo ] = useState({})
    const [userAddress , setUserAddress ] = useState();
    const [categoryTitle , setCategoryTitle ] = useState('');
    const [kombo , setKombo ] = useState([]);
    const [filterOpen , setFilterOpen ] = useState(false)
    const pathName = useLocation().pathname
    
    

    const navigate = useNavigate()
    const dispatch = useDispatch()


    var settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 8,
        slidesToScroll: 1,
        initialSlide: 0,
        arrows: false,
        responsive: [
            {
                breakpoint: 1300,
                settings: {
                  slidesToShow: 6,
                  slidesToScroll: 1,
                }
            },
            {
                breakpoint: 1024,
                settings: {
                  slidesToShow: 6,
                  slidesToScroll: 1,
                }
              },
              {
                breakpoint: 600,
                settings: {
                  slidesToShow: 2,
                  slidesToScroll: 2,
                  initialSlide: 2
                }
              },
              {
                breakpoint: 480,
                settings: {
                  slidesToShow: 4,
                  slidesToScroll: 1
                }},
            {
              breakpoint: 394,
              settings: {
                slidesToShow: 3,
                slidesToScroll: 3,
                initialSlide: 1
              }
            }
          ]
      };


    const handleGetAksiya = async () => {
        try {
            const data = await getAksiya();
            setAksiya(data.aksiya)
        } catch (error) {
            console.log(error);
        }
    }

    const handleChangeAddress = async () => {
        try {
            const id = localStorage.getItem('myId')
            const formData = new FormData();
            console.log(userAddress);
            formData.append('address' , JSON.stringify(userAddress  ))
            const data = await updateUser(formData, id);
            if(data.user.address.address){
                return toast.error('Укажите адрес')
            }
            toast.success(data.message)
            dispatch(setUser(data.user))
        } catch (error) {
            console.log(error);
        }
    }

    const handleMenu = (id) => {
        localStorage.setItem('menuId' , id)
        dispatch(setMenuStorage(id ))
        navigate('/menu')
        
    }

    const handleOpenModal= (product , title) => {
        setIsModalOpen(true)
        setModalInfo(product)
        setCategoryTitle(title)
    }
    const handleGetKombos = async () => {
        try {
            const data = await getKombo();
            setKombo(data.kombos);
        } catch (error) {
            console.log(error);
        }
    }



    useEffect(() => {
        handleGetAksiya()
        handleGetKombos();
        
    }, [])

    useEffect(() => {
       
    } ,[pathName])

  return (
        <>
            <Routes>
                <Route path='/login' element={<Login />} />
                <Route path='/signup' element={<Signup />} />
                <Route path='/signup2' element={<Signup2 />} />
                
            </Routes>
            <Navbar isModalOpen={isModalOpen} isLog={pathName == '/login' || pathName == '/signup' || pathName == '/signup2'} />

            <div className='home'>
                
                    <Slider {...settings} className="categories">

                    
                            <div className='category-item'>
                                <img className='category-item-img' src={FireImage} alt="" />
                                <h4>Акции</h4>
                            </div>
                            <div onClick={() => handleMenu('kombo')} className='category-item'>
                                <img src={KomboPng} alt="" />
                                <h4>Комбо</h4>
                            </div>
                            {
                                categories &&
                                categories.map(item => {
                                    return (
                                        <div onClick={() => handleMenu(item._id)} key={item._id} className='category-item'>
                                            <img src={item.image.url} alt="image" />
                                            <h4>{item.title}</h4>
                                        </div>
                                    )
                                })
                            }
                    </Slider>

                <div className="aksiya">
                    {
                        aksiya &&
                        aksiya.map(item => {
                            return (
                                <div className='aksiya-item' key={item._id} style={
                                    {backgroundImage: `url(${item.image.url})`,
                                    
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center', 
                                    }
                                    }>
                                    <p>{item.text}</p>
                                
                                </div>
                            )
                        })
                    }
                </div>

                <div className={`check-address ${openMap && 'check-address2'}`}>
                    <label className='chack ' htmlFor="check-address-input">
                        <h4>Проверить адрес доставки </h4>

                        
                        <input type="text" placeholder='Адрес'/>
                        <button onClick={() => setOpenMap(true)} className="plane-btn">
                            <img src={PlaneImage} alt="image" />
                        </button>
                        {
                            openMap ? <>
                                <button  onClick={handleChangeAddress} >Изменить</button>
                                <button  onClick={() => setOpenMap(false)}>Отменить</button>
                            </>:
                            <button  onClick={() => setOpenMap(true)} className='btn chack-btns'>Проверить</button>
                        }
                        
                    </label>
                        <div>
                        {
                            openMap && <CheckMap setUserAddress={setUserAddress} />
                        }
                        </div>
                </div>

                <div className="products-parent">
                    {
                        categories.map(category => {
                            return(
                                <div className='category-name' key={category._id}>
                                    
                                    <div className='category-top'>
                                        <h3>{category.title}</h3>
                                        <div>
                                            {
                                                category.title == 'Пицца' && <button onClick={() => setFilterOpen(true)}><i class="fa-solid fa-filter"></i>Фильтры</button>
                                            }
                                        </div>
                                    </div>
                                    <div className='product-box'>
                                    {
                                        category.products?.map(item => {
                                            return(
                                                <ProductItem handleOpenModal={() => handleOpenModal(item , category.title)} key={item._id} product={item} />
                                                
                                            )
                                        })
                                    }
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
                 <div >
                    <h3>Комбо</h3>
                    {
                        kombo.map(item => {
                            return(
                                <ProductItem handleOpenModal={() => handleOpenModal(item , 'Комбо')} key={item._id} product={item} />
                            )
                        })
                    }
                </div>

                <FilterModal categories={categories} setCategories={setCategories} isModalOpen={filterOpen} setIsModalOpen={setFilterOpen} />
                <WatchProduct isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} categoryTitle={categoryTitle} modalInfo={modalInfo} />
                </div>
                <Footer/>
        </>

  )
}

export default Home
