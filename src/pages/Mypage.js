import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './styles/Mypage.css';
import { Link, useLocation } from 'react-router-dom';
import { FaStar } from "react-icons/fa6";

export default function Mypage(){
    const [reviewData,setReviewData]= useState([])
    const [recipeData,setRecipeData] = useState([])
    const [userData,setUserData] = useState()
    const [cat,setCat] = useState('레시피')
    const location = useLocation()

    const axiosData= async()=>{
        const id= location.pathname.slice(13,location.pathname.length)
        const userData = await axios.get(`/users/mypage/${id}`)
        .then(res=> res.data.user)
        setUserData(userData)
        if(cat==='레시피'){
            setReviewData([])
            setRecipeData(userData.recipes)
        }
        if(cat==='리뷰'){
            setRecipeData([])
            setReviewData(userData.reviews)
        }
    }
    const chooseCat = (e)=>{
        setCat(e.target.value)
    }

    useEffect(()=>{
        axiosData()
    },[cat])
    return(
        <div className={'myPage-wrapper'}>
            <div className='myPage-itemBox'>
                <div className='myPage-cat'>
                    <label>레시피
                        <input type={'radio'} name={'cat'} value={'레시피'} onClick={chooseCat} hidden defaultChecked/>
                    </label>
                    <label>리뷰
                        <input type={'radio'} name={'cat'} value={'리뷰'} onClick={chooseCat} hidden/>
                    </label>
                    <label>댓글
                        <input type={'radio'} name={'cat'} value={'댓글'} onClick={chooseCat} hidden/>
                    </label>
                </div>
                <div className='myPage-item'>
                    {recipeData.length>0 ? recipeData.map((data,id)=>{
                        let {recipeId,recipeTitle,finishedImgs,description,reviews}=data
                        const rating = reviews.reduce((acc,value)=>acc += value.rating,0)/reviews.length
                        if(description.length>50){
                            description = description.slice(0,50).concat('...')
                        }
                        return(
                        <div key={id}>
                            <Link to={`/recipe/${recipeId}`}>
                                <div className='myPage-recipe'>
                                    <div className='recipe-goods'>
                                        <div className='imgBox'>
                                            <img src={`http://localhost:4000/${finishedImgs[0].path}`}></img>
                                        </div>
                                        <div className='recipe-info'>
                                            <p>{recipeTitle}</p>
                                            <div>
                                                {[1,2,3,4,5].map((num,id)=>{
                                                    return (
                                                        <FaStar fill={(rating && num <= rating) ? 'orange' : 'lightgray'} key={id}/>
                                                    )
                                                })}({reviews.length})
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        {description}
                                    </div>
                                </div>
                            </Link>
                            <div className='recipe-btns'>
                                <button>전환</button>
                                <button>삭제</button> 
                            </div>
                        </div>
                        )
                    }):
                    reviewData.length>0 ? reviewData.map((data,id)=>{
                        const {body,rating,recipe}=data
                        const {recipeId, finishedImgs,description}=recipe
                        return(
                            <Link to={`/recipe/${recipeId}`} key={id}>
                                <div className='myPage-review'>
                                    <div className='review-goods'>
                                        <div className='review-goodsImgBox'>
                                            <img src={`http://localhost:4000/${finishedImgs[0].path}`} alt=''></img>
                                        </div>
                                        <div className='review-info'>
                                            <p>{description}</p>
                                            <div>
                                                {[1,2,3,4,5].map((num,id)=>{
                                                    return (
                                                        <FaStar fill={(rating && num <= rating) ? 'orange' : 'lightgray'} key={id}/>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        {body}
                                    </div>
                                </div>
                            </Link>
                        )
                    }):
                    <p>작성하신 레시피나 리뷰가 없습니다</p>
                    }
                </div>
            </div>
            <div className='myPage-profile'>
                {userData&&
                <>
                    <div className='userInfo'>
                        <p>{userData.name}</p>
                    </div>
                    {JSON.parse(sessionStorage.getItem('Id'))===`${userData.userId}`
                    ?
                    <>
                        <button>정보변경</button>
                        <button>회원탈퇴</button>
                    </>:
                    <></>
                    }
                </>
                }
            </div>
        </div>
    )
}
