import React, { useEffect, useState } from 'react';
import "./WatchProduct.css"
import { v4 } from 'uuid';
import { Button, Modal } from 'antd';
import { getExtraIngredient, getProductIngredients } from '../../server/ingredientsServer';
import { getAllProducts } from '../../server/productsServer';
import { useDispatch } from 'react-redux';
import { pushKorzinka } from '../../redux/reduxStore/korzinkaSlice';
import { toast } from 'react-toastify';

const WatchProduct = ({setIsModalOpen , isModalOpen , modalInfo, categoryTitle}) => {
    const [ingredients , setIngredients ] = useState([]);
    const [extra , setExtra ] = useState([]);
    const sizes = [20, 28 , 33]
    const [size , setSize ] = useState(sizes[0]);
    const [cost , setCost ] = useState(modalInfo.price);
    const [activeIndex, setActiveIndex] = useState(0);
    const [extraActive, setExtraActive ] = useState([]);
    const [products , setProducts ] = useState([]);
    let testo = activeIndex == '1' ? 'Традиционное тесто' :'Тонкое тесто'
    
    

    const dispatch = useDispatch()
    

    const handleCancel = () => {
      setIsModalOpen(false);
    };

  const handleProductIngredients = async ( ) => {
    try {
      const data = await getProductIngredients(modalInfo._id);
      setIngredients(data.ingredients);
    } catch (error) {
      console.log(error);
    }

  }
  const handleExtraIngredients = async () => {
    try {
      const data = await getExtraIngredient(modalInfo._id);
      setExtra(data.ingredients);
    } catch (error) {
      console.log(error);
    }
  }

  const handleChangeCost = (data) => {
    setSize(data)
    let a  = 0;
    for(let i = 0; i < extraActive.length; i++){
      a += extraActive[i].price * 1
    }
    if(data == 20){
      setCost(modalInfo.price *1 + a)
    }else{
      setCost(Math.floor(data / 20 * Number(modalInfo.price )) + a)
    }
  }

  const handleGetAllProducts = async () => {
    setProducts([])
    try {
      const data = await getAllProducts();
      const arr = modalInfo.products.map(item => {
        data.products.find(item2 => {
          if(item2._id == item){
            setProducts(prev => [...prev , item2])
          }
        })
      })
      
    } catch (error) {
      console.log(error);
    }
  } 
  
  const handleClickActive = (index) => {
    setActiveIndex(index);

  };

  const handleAddPrice = (item) => {
    if(extraActive.find(data => data.id == item._id)){
      setExtraActive(extraActive.filter(data => data.id !== item._id))
      
      return setCost(prev => prev *1 - Number(item.price))
    }else{
    setExtraActive(prev => [...prev , {id:item._id, price: item.price}])
    } 

    setCost(prev => prev *1 + Number(item.price))
  }

  const handleAddKorzinka = () => {
    const abc = {
      id: v4(),
      name: modalInfo.name ? modalInfo.name : modalInfo.title ,
      text: modalInfo.text ,
      price: cost, image : modalInfo.image, 
      extra: extraActive  ,
      size: categoryTitle == "Пицца" ? size : null ,
      testo: categoryTitle == "Пицца" ? testo : null,
      count: 1,
      _id:modalInfo._id
    }
    dispatch(pushKorzinka(abc))
    let localKorzinka = JSON.parse(localStorage.getItem('korzinka'));
    if(localKorzinka){
      localKorzinka.push(abc)
      localStorage.setItem('korzinka' , JSON.stringify(localKorzinka))
    }else{
      localStorage.setItem('korzinka' , JSON.stringify([abc

      ]))
    }
    setIsModalOpen(false)
    toast.success("Продукт Добавен")
  }

  useEffect(() => {
    handleProductIngredients();
    handleExtraIngredients();
    handleChangeCost(20);
    if(categoryTitle == 'Комбо'){
      handleGetAllProducts()
    }
    
  } ,[modalInfo])
  return (
    <>
      
      <Modal className='Products' footer={false} closable open={isModalOpen} onCancel={handleCancel}>
        
      <div className="products-content">
        <div className="products-content-right">
          <button className='new'>NEW</button>
          <img src={modalInfo?.image?.url} alt=""  className='pizza'/>
        </div>
        <div className="products-content-left">
          <p>{modalInfo.name ? modalInfo.name : modalInfo.title}</p>
          <div className="left-item">
            {
              ingredients.map(item => {
                return(
                  <button key={item._id} className="additional-products">
                    <div className="additional-products-item">
                      <img src={item.image.url} alt="image" />
                    </div>
                    <div className="additional-products-title">
                      <h5>{item.title}  </h5>
                    </div>
                  </button>
                )
              })
            }
          </div>
          <div className="dimensions">
            {
              categoryTitle == "Пицца" &&
              <div className="top">
              <button className={`left ${activeIndex == 0 ? 'active-type' : ''}`} onClick={() => {
                handleClickActive(0)
              }}>Традиционное</button>
              <button className={`left ${activeIndex == 1 ? 'active-type' : ''}`} onClick={() => {
                handleClickActive(1)
              }} >Тонкое</button>
            </div>
            }
            <div className="bottom">
              {
                categoryTitle == "Пицца" &&
                sizes.map((item, index) => {
                  return(
                    <div key={index} onClick={() => handleChangeCost(item)} className={`left ${(size == item ? "active-sm" : "")}` }>{item} см</div>
                  )
                })
              }
              
            </div>
          </div>
          <div className={'my-kombos'}>
            {
              categoryTitle == 'Комбо' &&
              products.map((item , index) => {
                return(
                  <div key={index} className='kombo-box'>
                    <img className='kombo-img' src={item.image.url} alt="image" />
                    <h4 className='kombo-title'>{item.name}</h4>
                  </div>
                )
              })
            }
          </div>
          <div className="supplement">
            {
              categoryTitle == "Пицца" && <h3>Добавьте в пиццу</h3>
            }
            <div className="left-item">
              {
                extra.map(item => {
                  return(
                    <button key={item._id} className={`additional-products ${extraActive.find(data => data.id == item._id)  ? "active-extra" : ""}`} onClick={() => handleAddPrice(item)} >
                      <div className="additional-products-item">
                        <img src={item.image.url} alt="image" />
                      </div>
                      <div className="additional-products-title">
                        <h5>{item.title}</h5>
                        <p className='price'>{item.price} ₽</p>
                      </div>
                    </button>
                  )
                })
              } 
          </div>
          </div>
          <hr />
          <div className="common-money">
            <h3>Итого: {cost}₽</h3>
            <button onClick={handleAddKorzinka}>Добавить</button>
          </div>
        </div>
      </div>
    
      </Modal>
    </>
    
  )
}

export default WatchProduct;