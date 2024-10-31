import React, { useEffect } from 'react'
import NavBarComponent from '@/Components/Navbar'
import { useDispatch } from 'react-redux'
import { getAboutUser, getAllUsers, getConnectionsRequest } from '@/config/action/authAction';
import { getAllPosts } from '@/config/action/postAction';
import styles from './style.module.css'

export default function UserLayout({children}) {

  const dispatch = useDispatch();
  useEffect(()=>{
    dispatch(getAboutUser({token:localStorage.getItem('token')}))
    dispatch(getAllUsers())
    dispatch(getAllPosts())
    dispatch(getConnectionsRequest({token:localStorage.getItem("token")}))
  },[])
  return (
    <div>
        <NavBarComponent></NavBarComponent>
        <div className={styles.container}>{children}</div>
    </div>
  )
}
