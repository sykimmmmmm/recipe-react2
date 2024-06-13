import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import RecipeList from '../Component/RecipeList';
import './styles/Home.css'
export default function Home(){
    const [user,setUser] = useState(null)
    useEffect(()=>{
        
        fetch(`${process.env.REACT_APP_BASE_URL}/users/register`,{
            headers:{'Content-Type':'application/json'},
            method:'POST',
            body:JSON.stringify({
                name:'하늘',
                email:'sky2@gmail.com',
                password:'sky123!@#',
                userId:'sky2'
            })
        })
        .then(res=> res.json())
        .then(result=>{
            console.log(user)
            setUser(result.user)})  
    },[])
    return (
        <>
            {user ? (
            <>
            <h1>회원정보</h1>
            <p>이름: {user.name}</p>
            <p>연락처: {user.email}</p>
            <p>아이디: {user.userId}</p>
            </>
            ) : "사용자정보 조회중..."}
            {/* <RecipeList/> */}
        </>
    )
}