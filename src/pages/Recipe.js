import React, { useEffect, useState } from "react";
import axios from 'axios'
import { useLocation,Link } from "react-router-dom";
import { MdAutoGraph } from "react-icons/md";
import { IoPeople, IoTime, IoThumbsUpSharp } from "react-icons/io5";
import { FaStar } from "react-icons/fa6";
import './styles/Recipe.css'
import Review from "../Component/Review";

export default function Recipe(){
    const [recipeData,setRecipeData] = useState(null)
    const [modalOn,setModalOn] = useState(false)
    const [success,setSuccess] = useState(null)
    const location = useLocation()
    const id = location.pathname.slice(8,location.pathname.length)
    const user = JSON.parse(sessionStorage.getItem('Id'))
    const axiosData = async()=>{
        // const id = location.pathname.slice(8,location.pathname.length)
        const viewership = await axios.get(`http://localhost:4000/recipes/${id}`)
        .then(res => res.data.recipe)
        .catch(e=>console.log(e.response))
        setRecipeData(viewership)
    }
    const reviewPopup =()=>{
        setModalOn(true)
    }
    // console.log(recipeData)
    const increaseRecommend = async()=>{
        // const id = location.pathname.slice(8,location.pathname.length)
        const token = JSON.parse(atob(sessionStorage.getItem('I')))
        if(+localStorage.getItem(`recipe${id}${user}rc`) === 1){
            localStorage.setItem(`recipe${id}${user}rc`,-1)
            axios.post('recipes/recommend',{num:-1,id:id},{headers:{Authorization:`Bearer ${token}`}})
            .then(res=>setSuccess(res.data.success))
        }else{
            localStorage.setItem(`recipe${id}${user}rc`,1)
            axios.post('recipes/recommend',{num:1,id:id},{headers:{Authorization:`Bearer ${token}`}})
            .then(res=>setSuccess(res.data.success))
        }
    }
    useEffect(()=>{
        axiosData()
    },[success,location.pathname])
    
    if(recipeData){
        const {author:{name:nickname,userId},finishedImgs,description,info,recipeTitle,ingredients,reviews}=recipeData
        const steps = recipeData.steps
        const cookingImgs = recipeData.cookingImgs
        return(
            <>
                <div className="body">
                    <div className="recipe-wrapper">
                        <section className='recipe-header'>
                            {sessionStorage.getItem('I')&&user!==userId&&<div className="recipe-review" onClick={reviewPopup}>리뷰 쓰기</div>}
                            <div className="recipe-thumbnailBox">
                                {sessionStorage.getItem('I') && user!==userId&&<div className="recipe-recommend"><IoThumbsUpSharp fill={ +localStorage.getItem(`recipe${id}${user}rc`) === 1 ?'blue' : 'white'} onClick={increaseRecommend}/></div>}
                                <img src={`http://localhost:4000/${finishedImgs[0].path}`} alt=''/>
                            </div>
                            <div className="recipe-desc">
                                <Link to={`/user/mypage/${userId}`}>
                                    <div className="recipe-user">{nickname}</div>
                                </Link>
                                <h2>{recipeTitle}</h2>
                                <p>{description}</p>
                                <div className='recipe-info'>
                                    <div className="recipe-people">
                                        <IoPeople/>
                                        {info[0]}
                                    </div>
                                    <div className="recipe-time">
                                        <IoTime/>
                                        {info[1]}
                                    </div>
                                    <div className="recipe-difficult">
                                        <MdAutoGraph/>
                                        {info[2]}
                                    </div>
                                </div>
                            </div>
                        </section>
                        <section className="recipe-ingredient">
                            <h3>재료</h3>
                            <ul>
                                {ingredients.map((ingredient,idx)=>{
                                    return(
                                        <li key={idx}>{ingredient}</li>
                                    )
                                })}
                            </ul>
                        </section>
                        <section className="recipe-steps">
                            {steps.map((step,i)=>{
                                return(
                                <div className={`recipe-step${i+1}`} key={i}>
                                    <div className={`step${i+1}`}>
                                        <h3>Step{i+1}</h3>
                                        <p>{step}</p>
                                    </div>
                                    <div className={`imgBox${i+1}`}>
                                        {cookingImgs.map((image,idx2)=>{
                                            if(image.order === i){
                                                return <img key={idx2} src={`http://localhost:4000/${image.path}`} alt=''></img>
                                            }else{
                                                return false
                                            }
                                        })}
                                    </div>
                                </div>
                                )
                            })}
                        </section>
                        <section className="recipe-finish">
                            <h3>완성된사진</h3>
                            <div>
                                {finishedImgs.map((image,id)=>{
                                    return (
                                        <div key={id}>
                                            <img src={`http://localhost:4000/${image.path}`} alt=''/>
                                        </div>
                                    )
                                })}
                            </div>
                        </section>
                        {reviews.length>0 &&
                            <section className="recipe-review">
                                <h3>리뷰({reviews.length})</h3>
                                {reviews.map((review,id)=>{
                                    let {author,body,img,createdAt,rating}=review
                                    createdAt = new Date(createdAt)
                                return(
                                    <div key={id}>
                                        <div>
                                            <div className="information">
                                                <div className="user">
                                                    <Link to={`/user/mypage/${author.userId}`}>
                                                        <h3>{author.name}</h3>
                                                    </Link>
                                                </div>
                                                <span>{createdAt.toLocaleString()}</span>
                                                <div>
                                                    {[1,2,3,4,5].map((num,id)=>{
                                                        return <FaStar key={id} fill={rating>=num ? 'orange':'grey'}/>
                                                    })}
                                                </div>
                                            </div>
                                            <div className="desc">
                                                <p>{body}</p>
                                            </div>
                                        </div>
                                        <div className="imgBox">
                                            {img && <img src={`http://localhost:4000/${img}`} alt=''></img> }
                                        </div>
                                    </div>
                                )
                            })}
                        </section>}
                    </div>
                </div>
                <div className={`modal ${modalOn ? 'on' : 'off'}`}>
                    <Review setModal={setModalOn} setSuccess={setSuccess}recipeId={recipeData._id}reviewTitle={recipeTitle} reviewImg={finishedImgs[0].path||'./images/noImgs/no_image.gif'} />
                </div>
            </>
        )
    }
}