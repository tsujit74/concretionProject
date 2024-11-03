import NavBarComponent from '@/Components/Navbar'
import React, { useEffect } from 'react'
import styles from './style.module.css'
import { useDispatch } from 'react-redux';
import { getAboutUser, getAllUsers, getConnectionsRequest } from '@/config/action/authAction';
import { getAllPosts } from '@/config/action/postAction';

// pages/admin.js
export default function AdminLayout({children}){

    const dispatch = useDispatch();
  

    return(
       <div>
         <NavBarComponent> </NavBarComponent>
         <div className={styles.container}>{children}</div>
       </div>
       
    )
}
