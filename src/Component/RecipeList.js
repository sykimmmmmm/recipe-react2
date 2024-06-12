import React, { useEffect, useState } from "react";
import {Link, useSearchParams} from 'react-router-dom'
import axios from 'axios'
import './styles/RecipeList.css'
import Categories from "./Categories";
import { FaStar } from "react-icons/fa6";


export default function RecipeList(){
    const [recipeList,setRecipeList] = useState([])
    const [filter,setFilter] = useSearchParams({type:'전체',situation:'전체',process:'전체',material:'전체'})
    const orderCategory=(e)=>{
        // console.log(e.target)
        filter.set('orderby',e.target.innerText)
        setFilter(filter)
    }
    const axiosData = async(filter)=>{
        if(filter.size !== 0){
            await axios.get(`http://localhost:4000/recipes/recipe-list?${filter}`)
            .then(res =>{
                // console.log(res)
                return setRecipeList(res.data)
            })
            .catch(err=>{
                setRecipeList(err.response.data)
            })
        }else{
            await axios.get('http://localhost:4000/recipes/recipe-list')
            .then(res =>{
                // console.log(res)
                return setRecipeList(res.data)
            })
            .catch(err=>{
                setRecipeList(err)
            })
        }
    }

    useEffect(()=>{
        axiosData(filter)

    },[filter])
    return(
        <>
            <Categories setFilterData={setFilter}/>
            <div className='cat'>
                <span onClick={orderCategory}>정렬초기화</span>
                <span onClick={orderCategory}>조회수</span>
                <span onClick={orderCategory}>추천수</span>
            </div>
            <div className="recipe-wrap">
                {recipeList && recipeList.length>0 && recipeList.map((data,id)=>{
                    const {author:{name:nickname},finishedImgs,recipeTitle,viewership,recommended,reviews}=data
                    const rating = reviews.reduce((acc,value)=>acc+=value.rating,0)/reviews.length
                    return(
                        <Link to={`/recipe/${data.recipeId}`} key={id}>
                                <div className="recipe-box">
                                    <div className="imgBox">
                                    {finishedImgs.length>0 ? 
                                    <img src={`http://localhost:4000/${finishedImgs[0].path}`} alt=''/>:
                                    <img src={'/images/noImgs/no_image.gif'} alt=''/>} 
                                    </div>
                                    <div className="recipe-info">
                                        <p>{recipeTitle}</p>
                                        <p>{nickname} </p>
                                    </div>
                                    <div className="recipe-view">
                                        <span>조회수:{viewership}</span>
                                        <span>추천수:{recommended}</span>
                                        <span>
                                            {[1,2,3,4,5].map((num,id)=>{
                                                return (
                                                    <FaStar fill={(rating && num <= rating) ? 'orange' : 'lightgray'} key={id}/>
                                                )
                                            })}({reviews.length})
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        )}
                        )
                    }
                {recipeList.code===404 && <div>공개중인 레시피가 없습니다</div>}
            </div>
        </>
    )
}