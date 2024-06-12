import React, { useRef, useState } from "react";
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import './styles/Login.css'
import { FcGoogle } from "react-icons/fc";

axios.defaults.baseURL='http://localhost:4000'
axios.defaults.withCredentials=true

export default function Login(){
    const navigate = useNavigate()
    const [loginData,setLoginData] = useState(null)
    const loginRef = useRef()
    const inputLogin = (e)=>{
        const { name, value } = e.target 
        setLoginData({...loginData,[name]:value})
    }
    const login = async() =>{
        if(loginData){

            const {userId, password} = loginData
            axios.post('/users/login',{userId,password})
            .then(res=> {
                const {code,token,userId} =res.data
                console.log(res.data)
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
                if(code === 200){
                    alert('로그인되었습니다')
                    sessionStorage.setItem('Id',JSON.stringify(userId))
                    sessionStorage.setItem('I',btoa(JSON.stringify(token)))
                    loginRef.current.innerText=''
                    navigate('/')
                }else if(code === 401){
                    loginRef.current.innerText=res.data.message
                }
            })
            .catch(e=>{
                alert(e.response.data.message)
            })
        }else{
            alert('정보를 입력해주세요')
        }
    }

    return(
        <div className="loginWrapper">
            <h3>로그인</h3>
            <div>
                <div className="loginForm">
                    <form>
                        <label>
                            아이디
                            <input type={'text'} placeholder='아이디를 입력하세요' name='userId' onChange={inputLogin}></input>
                        </label>
                        <label>
                            비밀번호
                            <input type={'password'} placeholder='비밀번호를 입력하세요' name='password' onChange={inputLogin}></input>
                        </label>
                        <div className='loginAlert' ref={loginRef}></div>
                    </form>
                    <button type="submit" onClick={login}>로그인</button>
                </div>
                <div> 또는 </div>
                <div className="anotherLogin">
                    <div className="loginGoogle">
                        <FcGoogle/>
                        <p>구글로 로그인하기</p>
                    </div>
                </div>
            </div>
        </div>
    )
}