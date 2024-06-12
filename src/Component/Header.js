import React, { useRef } from "react";
import { Link,useSearchParams, useNavigate } from "react-router-dom";
import { IoIosSearch } from "react-icons/io";
import './styles/Header.css'
import axios from 'axios'

export default function Header(){
    const [searchParams,setSearchParams] = useSearchParams()
    const queryString = useRef()
    const navigate = useNavigate()
    const searchQuery = () =>{
        const {name,value} = queryString.current
        setSearchParams({[name]:value})
    }
    const logout=()=>{
        alert('로그아웃했습니다')
        axios.defaults.headers.common['Authorization'] = ``
        sessionStorage.removeItem('I')
        sessionStorage.removeItem('Id')
    }

    const randomRecipe = async()=>{
        await axios.get('http://localhost:4000/recipes/recipe-list')
        .then(res => {
            navigate(`/recipe/${res.data[Math.floor(Math.random()*res.data.length)].recipeId}`)
        })
    }

    const id = JSON.parse(sessionStorage.getItem('Id'))
    return(
        <div className="header">
            <div className="header-logo">
                <Link to={'/'} replace={true}>
                    <img src="/images/logo/titleLogo.png" alt='myrecipe'></img>
                </Link>
            </div>
            <div className='search'>
                <input type='text' name='name' placeholder="검색어를 입력하세요" ref={queryString}/>
                <button onClick={searchQuery}><IoIosSearch/></button>
            </div>
            <div className="myinfo">
                <button className="randBtn" onClick={randomRecipe}>레시피 추천받기</button>
                {sessionStorage.getItem('I') ? 
                <>
                    <Link to={'/add-recipe'}>레시피등록</Link>
                    <Link to={`/user/mypage/${id}`}>마이페이지</Link>
                    <Link to={'/'} onClick={logout}>로그아웃</Link>
                </>:
                <>
                    <Link to={'/user/register'}>회원가입</Link>
                    <Link to={'/user/login'}>로그인</Link>
                </>
                }
            </div>
        </div>
    )
}