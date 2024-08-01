import React, { useEffect, useState } from 'react'
import "./Navbar2.scss"
import img from "../../img/Group 1.png"
import img2 from "../../img/Group 2.png"
import { ShoppingCartOutlined, UserOutlined } from '@ant-design/icons'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setUser } from '../../redux/reduxStore/authSlice'
import { Dropdown, DropdownButton } from 'react-bootstrap'
import { getCategoryProducts } from '../../server/categoryServer'
import { setMenuStorage } from '../../redux/reduxStore/storageSlice'
import KorzinkaModel from '../KorzinkaModel/KorzinkaModel'
import FireImage from "../../img/Fire.png"

import KomboPng from '../../img/Combo.png'
import Slider from 'react-slick'

const Navbar2 = () => {
    const [categories , setCategories ] = useState([]);
    const [modal2Open , setModal2Open ] = useState(false)
    const {user } = useSelector(state => state.authSlice);
    const {korzinkaPrice } = useSelector(state => state.korzinkaSlice);
    const dispatch = useDispatch();
    const navigate = useNavigate()


    var settings = {
      dots: false,
      infinite: false,
      speed: 500,
      slidesToShow: 6,
      slidesToScroll: 1,
      initialSlide: 0,
      arrows: false,
      responsive: [

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

    const handleGetCategories = async () => {
        try {
            const data = await getCategoryProducts()
            setCategories(data.categories);
        } catch (error) {
            console.log(error);
        }
    }
    const handleMenu = (id) => {
      localStorage.setItem('menuId' ,id );
      dispatch(setMenuStorage(id))
      navigate(`/menu/`)
    }

    useEffect(() => {
        handleGetCategories()
    } ,[])

    

    

  return (
    <div>
      <div className=" nav-main2">
     <nav>
      <div className="container">
        <div className="nav-top2">
            <div className="nav-left">
              <div className="navbar2">
                <Link to={'/'} className="nav-low-left">
                    <img src={img2} alt="pizza" />
                    <h4>Куда пицца</h4>
                </Link>
              </div>
              <ul className='navbar-categories'>
                <li className='navbar-category-item'>Акции</li>
                <li onClick={() => handleMenu('kombo')} className='navbar-category-item' >Комбо</li>
                {
                    categories&& 
                    categories.map(category => {
                        return(
                            <li onClick={() => handleMenu(category._id)} className='navbar-category-item' key={categories._id}>{category.title}</li>
                        )
                    })
                }
              </ul>
              <Slider {...settings} className="media-categories">
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

            </div>
            <div className="nav-right">
                <div className="nav-low-right">
                    <button onClick={() => setModal2Open(true)} className='shopp-btn'><ShoppingCartOutlined className='shopping'/> {korzinkaPrice} ₽</button>
                </div>
            </div>
        </div>
      </div>
    </nav>
   </div>
   <KorzinkaModel isModalOpen={modal2Open} setIsModalOpen={setModal2Open} />
    </div>
  )
}

export default Navbar2
