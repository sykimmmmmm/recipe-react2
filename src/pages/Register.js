import React, { useState,useRef } from "react";
import { useNavigate } from "react-router-dom";
import './styles/Register.css';
import axios from 'axios';

export default function Register(){
    const navigation = useNavigate()
    const [loginData,setLoginData] = useState({})
    const idRef= useRef()
    const fetchRegister = async(data)=>{
        const {email,name,userId,password,confirmPassword} = data
        if(email && name && userId && password && confirmPassword && password === confirmPassword){
            const register = await axios.post('http://localhost:4000/users/register',{email,name,userId,password,confirmPassword})
            .then(res => res.data)
            .catch(err=> err.response.data)
            if(register.code===200){
                alert('회원가입을 완료했습니다.')
                return navigation("/user/login")
            }
        }else{
            alert('필요한 정보가 없습니다')
        }
    }

    const register = async ()=>{
        await fetchRegister(loginData)
        let {email,name,userId,password,confirmPassword} = loginData
        if(!name){
            const box = document.querySelector('.nickName')
            const div = document.createElement('div')
            div.innerText = '닉네임을 입력해주세요'
            box.append(div)
        }
    }
    const duplicateId =async()=>{
        const { userId } = loginData
        const confirm = await axios.post('http://localhost:4000/users/confirmUser',{userId})
        .then(res => res.data)
        idRef.current.innerText = confirm.msg
    }
    const loginInfo = (e)=>{
        const {name,value} = e.target
        setLoginData({...loginData,[name]:value})
    }

    return(
        <div className="register-wrapper">
            <div>
                <h3>회원가입</h3>
            </div>
            <form className="registerForm">
                <div className="nickName">
                    <label>
                        닉네임
                        <input type="text" name="name" placeholder="닉네임을 입력하세요..." onChange={loginInfo} required></input>
                    </label>
                </div>
                <div className="email">
                    <label>
                        이메일
                        <input type="text" name="email" placeholder="이메일을 입력하세요..." onChange={loginInfo} required></input>
                    </label>
                </div>
                <div className="userId">
                    <div >
                        <label>
                            아이디
                            <input type="text" name="userId" placeholder="아이디를 입력하세요(4~20자)" onChange={loginInfo} required></input>
                        </label>
                        <span className="confirmId" ref={idRef}></span>
                    </div>
                    <div className="duplicate" onClick={duplicateId}>중복확인</div>
                </div>
                <div className="password">
                    <label>
                        비밀번호
                        <input type="password" name="password" placeholder="패스워드를 입력하세요(문자,숫자,특수문자 포함 8~20자)" onChange={loginInfo} required></input>
                    </label>
                </div>
                <div className='confirmPassword'>
                    <label>
                        비밀번호 확인
                        <input type="password" name="confirmPassword" placeholder="패스워드를 다시 입력해주세요..." onChange={loginInfo} required></input>
                    </label>
                </div>
            </form>
            <div className="register-btn">
                <button onClick={register}>회원가입</button>
            </div>
        </div>
    )
}