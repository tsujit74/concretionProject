import React, { useEffect, useState } from 'react'
import NavBarComponent from '@/Components/Navbar'
import { useDispatch } from 'react-redux'
import { getAboutUser, getAllUsers, getConnectionsRequest } from '@/config/action/authAction';
import { getAllPosts } from '@/config/action/postAction';
import styles from './style.module.css'
import Spinner from '@/Components/Spinner';

export default function UserLayout({children}) {

  const [isLoading,setIsLoading] = useState(false);

  const dispatch = useDispatch();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found in local storage.");
      return;
    }
  
    setIsLoading(true);
  
    const fetchData = async () => {
      try {
        await Promise.all([
          dispatch(getAboutUser({ token })),
          dispatch(getAllUsers()),
          dispatch(getAllPosts()),
          dispatch(getConnectionsRequest({ token }))
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchData();
  }, []);
  
  return (
    <div>
        <NavBarComponent> {isLoading && <Spinner/>} </NavBarComponent>
        <div className={styles.container}>{children}</div>
    </div>
  )
}
