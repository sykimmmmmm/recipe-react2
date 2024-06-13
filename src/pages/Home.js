import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import RecipeList from '../Component/RecipeList';
import './styles/Home.css'
export default function Home(){
    const [user,setUser] = useState(null)
    useEffect(()=>{
        
        fetch(`${process.env.REACT_APP_BASE_URL}`)
        .then(res=> res.text())
        .then(result=>{
            console.log(user)
            setUser(result)})  
    },[])
    return (
        <>
            {user ? <h1>{user}</h1> : '로딩중...'}
            {/* <RecipeList/> */}
        </>
    )
}