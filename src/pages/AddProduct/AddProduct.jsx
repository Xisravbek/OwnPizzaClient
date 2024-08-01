import React, { useEffect, useRef, useState } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import './AddProduct.scss'
import { Form, Image, Input, Select , Button  } from 'antd'
import { getAllCategories } from '../../server/categoryServer'
import { useDispatch, useSelector } from 'react-redux'
import { failureLoader, startLoader, successLoader } from '../../redux/reduxStore/loaderSLice'
import { addProduct } from '../../server/productsServer'
import { toast } from 'react-toastify'
import { getIngredients, updateIngredient } from '../../server/ingredientsServer'
import { startRefresh } from '../../redux/reduxStore/storageSlice'

const AddProduct = () => {
    const [categories , setCategories ] = useState([])
    const [ingredients , setIngredients ] = useState([])
    const [pizzaIngredients , setPizzaIngredients ] = useState([])
    const [extras , setExtras ] = useState([])
    const [isPizza , setIsPizza ] = useState(false)
    const [form] = Form.useForm();
    const img_rf = useRef();
    const [url, setUrl ] = useState();
    const [demoUrl ,setDemoUrl ] = useState("https://img.freepik.com/premium-vector/default-image-icon-vector-missing-picture-page-website-design-mobile-app-no-photo-available_87543-11093.jpg")

    const {isLoading} = useSelector(state => state.loaderSlice)
    const dispatch = useDispatch()

    const changeImg = () => {
        if(img_rf.current.files[0]) {
            setDemoUrl(URL.createObjectURL(img_rf.current.files[0]))
            setUrl(img_rf.current.files[0]);
        }
    }

    const handleGetCategories = async() =>{
        try {
            const data = await getAllCategories();
            setCategories(data?.categories.map(item => {
                return { value: item._id , label: item.title }
            }))
        } catch (error) {
            console.log(error);
        }
    }

    const handlePostProduct = async (value) => {
        dispatch(startLoader())
        try {
            console.log(value);
            if(value.categoryId =='669bc423dd5ed05253fee33e'){
                if(!isPizza){
                    dispatch(failureLoader())
                    return setIsPizza(true)
                }
            }
            let formData = new FormData();
            for (const key in value) {
                formData.append(key, value[key])
            }
            url && formData.append('image', url )
            const data = await addProduct(formData)
            dispatch(startRefresh())
            if(value.categoryId =='669bc423dd5ed05253fee33e'){
                for(let i = 0; i < pizzaIngredients.length; i ++){
                    await updateIngredient(pizzaIngredients[i]._id ,{products : [data.product._id]})
                }
                for(let i = 0; i < extras.length; i ++){
                    await updateIngredient(extras[i]._id ,{productExtra : [data.product._id]})
                }
            }
            
            toast.success(data.message)
            setIsPizza(false)
            dispatch(successLoader())
        } catch (error) {
            console.log(error);
            dispatch(failureLoader())
        }
    }
    const handleChangeIngredient = (data) => {
        if(pizzaIngredients.find(item => item._id == data._id)){
            setPizzaIngredients(pizzaIngredients.filter(item => item._id !== data._id))
            return
        }else{
            setPizzaIngredients(prev => [...prev , data])
        }
    }
    const handleChangeExtra = (data) => {
        if(extras.find(item => item._id == data._id)){
            setExtras(extras.filter(item => item._id !== data._id))
            return
        }else{
            setExtras(prev => [...prev , data])
        }
    }

    const handleGetIngredients = async () => {
        try {
            const data = await getIngredients();
            console.log(data);
            setIngredients(data.ingredients)
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        handleGetCategories();
        handleGetIngredients()
    } ,[])
  return (
    <>
      <Navbar />

      <div className="add-product">
        <div className="add-product-box">
            <div className="add-product-left">
                <div >
                    
                    <label htmlFor="prod-image">
                        <img  src={demoUrl} alt="image" />
                    </label>
                    <input style={{display: "none"}} onChange={changeImg} type="file" id='prod-image' ref={img_rf} accept='image/*' />
                </div>
            </div>
            <div className="add-product-right">
                <Form form={form} onFinish={handlePostProduct} >
                    <Form.Item name='name'>
                        <Input required  placeholder='Name' />
                    </Form.Item>
                    <Form.Item name='text'>
                        <Input required  placeholder='Text' />
                    </Form.Item>
                    <Form.Item name={'price'}>
                        <Input required type='number' placeholder='Price' />
                    </Form.Item>
                    <Form.Item name={'portion'}>
                        <Input required placeholder='Portion' />
                    </Form.Item>
                    <Form.Item name={'categoryId'}>
                        <Select   options={categories} placeholder='Category' />
                    </Form.Item>
                    
                    <Button loading={isLoading} htmlType='submit '>Добавить</Button>
                </Form>
            </div>
            {
                isPizza && 
                <div className='ingredients-main'>
                <h3>Ингредиенты</h3>
                <div className='ingredinets-add'>
                    {
                        ingredients.map(item => {
                            return(
                                <div key={item._id} onClick={() => handleChangeIngredient(item)} className={`ingredient-item ${pizzaIngredients.find(data => data._id == item._id)  ? "active-extra" : ""}`}>
                                    <img src={item.image.url} alt="image" />
                                    <h5>{item.title}</h5>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            }
            {
                isPizza && 
                <div className='ingredients-main'>
                <h3>Экстра</h3>
                <div className='ingredinets-add'>
                    {
                        ingredients.map(item => {
                            return(
                                <div onClick={() => handleChangeExtra(item)} className={`ingredient-item ${extras.find(data => data._id == item._id)  ? "active-extra" : ""}`}>
                                    <img src={item.image.url} alt="image" />
                                    <h5>{item.title}</h5>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            }
        </div>
      </div>
    </>
  )
}

export default AddProduct
