import { clearFlashMessage } from '@/config/reducer/flashMessage';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styles from './style.module.css'

export default function FlagMessage() {

    const dispatch = useDispatch();
    const {message,type} = useSelector((state)=>state.flashMessage);

    useEffect(()=>{
        if(message){
            const timer = setTimeout(()=>{
                dispatch(clearFlashMessage());
            },3000)
            return ()=> clearTimeout(timer)
        }
    },[message,dispatch])

    if(!message) return null;

  return (
    <div className={`${styles.flashMessage} ${styles[type]}`}>
    {message}
  </div>
  )
}
