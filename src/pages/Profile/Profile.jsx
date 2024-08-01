import React, { useState } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import './Profile.scss'
import { Link, Route, Routes } from 'react-router-dom'
import ProfileUpdate from '../../components/ProfileUpdate/ProfileUpdate'
import Navbar3 from '../../components/Navbar3/Navbar3'
import History from '../History/History'
import Footer from '../../components/Footer/Footer'

const Profile = () => {
  const [active , setActive ] = useState(1)

  return (
        <>
          <div className='media-navbar3'><Navbar3  /></div>
          <div className='media-navbar1'><Navbar  /></div>
          <div className='profile'>
              
              <div className='account'>
                  <h2 className='my-acount-title'>Мой аккаунт</h2>
                  <div className='acc-btns-box'>
                      <Link  to={'/profile/history'} onClick={() => {
                        setActive(0)
                        
                      }} className={`btn acc-btns history-btn ${ active ==0 && 'active'}`}>История заказов</Link>
                      <Link to={'/profile/update'} onClick={() => {
                        setActive(1)
                       
                      }} className={`btn acc-btns setting-btn ${active == 1 && 'active'}`}>Настройки</Link>
                  </div>
              </div>
                  <div className="profile-display">
                    <Routes>
                      <Route path='/update' element={<ProfileUpdate/>} />
                      <Route path='/history' element={<History/>} />
                    </Routes>
                  </div>
          </div>
          <Footer />
        </>
  )
}

export default Profile
