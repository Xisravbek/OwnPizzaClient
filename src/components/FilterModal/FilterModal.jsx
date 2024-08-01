import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'antd';
import './FilterModal.scss'
import { useDispatch, useSelector } from 'react-redux';
import { minusProduct, plustProduct } from '../../redux/reduxStore/korzinkaSlice';
import { useNavigate } from 'react-router-dom';
import { getIngredients, getOneIngredient } from '../../server/ingredientsServer';
import { toast } from 'react-toastify';

const FilterModal = ({isModalOpen, setIsModalOpen , setCategories , categories}) => {
    
    const [ingredients , setIngredients ] = useState([])
    const [demoId , setDemoId ] = useState(null)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleGetIngredients = async () => {
        try {
            const data = await getIngredients();
            setIngredients(data.ingredients)
        } catch (error) {
            console.log(error);
        }
    }

    const handleFilterByIng = async () => {
        try {
            if(!demoId){
                return
            }
            const data = await getOneIngredient(demoId);
            let pizza = categories.find(item => item._id == '669bc423dd5ed05253fee33e');
            pizza.products = data.ingredient?.productsObj;
            let b = categories.map(item => {
                if(item._id == '669bc423dd5ed05253fee33e'){
                    return pizza
                }else{
                    return item
                }
            })
            setCategories(b)
            setIsModalOpen(false)
        } catch (error) {
            toast.error(error.response.data.message)
        }
    }

    useEffect(() => {
        handleGetIngredients()
    } ,[])
    
  return (
    <div >
       {
        isModalOpen &&
        <div className="my-modal">
            <div className="my-modal-box">
            <div className="my-modal-header filter-modal-header ">
                    <h3>Фильтры</h3>
                    <i onClick={() => setIsModalOpen(false)} className="fa-solid fa-xmark"></i>
                </div>
                <div className="filter-modal-body">
                        <h4>Общее</h4>
                        <div>
                            {ingredients.map(item => {
                                return(
                                    <button className={`${demoId == item._id && 'active-ing'}`} onClick={() => setDemoId(item._id)}>{item.title}</button>
                                )
                            })}
                </div>
                
                <div className="my-modal-footer filter-modal-footer">
                    <div>
                        <button onClick={() => setIsModalOpen(false)} className='sbrosit'>Сбросить</button>
                        <button onClick={handleFilterByIng} className='primenit-btn'>Применить</button>
                    </div>
                </div>
                </div>
            </div>

        </div>
       } 
    </div>
  );
};

export default FilterModal;