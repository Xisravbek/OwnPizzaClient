import React from 'react'
import { useNavigate } from 'react-router-dom'
import "./ProductItem.css"
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { deleteProduct } from '../../server/productsServer'
import { Popconfirm } from 'antd'
import { Button } from 'react-bootstrap'
import { startRefresh } from '../../redux/reduxStore/storageSlice'

const ProductItem = ({product, handleOpenModal}) => {

  const {user} = useSelector(state => state.authSlice)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleisLogged = () => {
    if(!user){
      return navigate('/login')
    }
    handleOpenModal(product)
  }

  const handleDeleteProduct = async () => {
    try {
      const data = await deleteProduct(product._id);
      dispatch(startRefresh())
      toast.success(data.message)
    } catch (error) {
      toast.error(error.response.data.message)
    }
  }
  
  const cancel = () => {

  };

  return (
    <div className="card1">
        <div className='content1'  >
          
          {

            user.role == 'admin' && <Popconfirm
            className={'delete-product-btn'}
              title="Удалить продукта ?"
              onConfirm={handleDeleteProduct}
              onCancel={cancel}
              okText="Да"
              cancelText="Нет"
            >
              <button className=''><i className="fa-solid fa-trash"></i></button>
            </Popconfirm>
          }
        <img src={product.image.url} alt="image" />
        <div className='content1-box'>
          <h4>{product.name}</h4>
          <p>{product.text}</p>
          <div onClick={handleisLogged} className="price-btn">
            <button  className="choose-btn">
              Выбрать
            </button>
          <p className="price">{product.categoryId == '669bc423dd5ed05253fee33e' && 'от'} {product.price} ₽</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductItem;