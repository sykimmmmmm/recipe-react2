import React, { useRef, useState } from "react";
import './styles/Review.css'
import { FaStar } from "react-icons/fa6";
import axios from "axios";

export default function Review({recipeId,setModal,setSuccess,reviewTitle,reviewImg}){
    if(reviewImg.includes('uploads')){
        reviewImg = 'http://localhost:4000/'+reviewImg
    }
    /* 별점 */
    const [selectedRating, setSelectedRating] = useState(null);
    const handleStarClick = (rating) => {
        setSelectedRating(rating);
    }
    /* 사진 */
    const [selectedImg,setSelectedImg] = useState(null)
    const imgRef = useRef()

    const fileOpen=()=>{
        imgRef.current.click()
    }
    const handleFileInput = () => {
        if(imgRef.current.files[0] !== undefined){
            setSelectedImg(URL.createObjectURL(imgRef.current.files[0]));
        }else{
            setSelectedImg(null)
        }
    }
    
    const [text,setText] = useState(null)
    const inputText = (e)=>{
        setText(e.target.value)
    }

    const submitReview = async()=>{
        const fd = new FormData()
        fd.append('recipeId',recipeId)
        fd.append('rating',selectedRating)
        fd.append('body',text)
        if(imgRef.current.files[0]){
            fd.append('img',imgRef.current.files[0])
        }
        const token = JSON.parse(atob(sessionStorage.getItem('I')))
        await axios.post('users/review',fd,{headers:{'Authorization':`Bearer ${token}`,"Content-Type":"multipart/form-data"}})
        .then(res=>{
            alert(res.data.message)
            setModal(false)
            setSuccess(true)
        })
    }

    const cancleReview =()=>{
        setSelectedImg(null)
        setSelectedRating(null)
        setText(null)
        setModal(false)
    }

    return(
        <div className="review">
            <div className="review-product">
                <div className="product-imgBox">
                    <img src={reviewImg}/>
                </div>
                <h3>{reviewTitle}</h3>
            </div>  
            <div className="review-box">
                <div className="review-rating">
                    <p>평점을 선택해주세요!</p>
                    <div>
                        {[1,2,3,4,5].map((num,id)=>{
                            return (
                                <FaStar fill={(selectedRating && num <= selectedRating) ? 'orange' : 'lightgray'} onClick={() => handleStarClick(num)} key={id}/>
                            )
                        })}
                    </div>
                </div>
                <div>
                    <label> 간단한 리뷰를 작성해주세요!</label>
                    <textarea name="body" onChange={inputText}></textarea>
                </div>
                <div className="review-img">
                    <label>사진을 첨부해주세요!</label>
                    <input hidden type={'file'} accept={'image/*'} name='recipeImage0' ref={imgRef} onChange={handleFileInput}/>
                    <div onClick={fileOpen}>{selectedImg ?<img src={selectedImg} alt=''/>:<img src="/images/etc/addImage.png" alt="이미지추가"/>}</div>
                </div>
            </div>    
            <div className="review-btns">
                <button onClick={submitReview}>작성하기</button>
                <button onClick={cancleReview}>취소</button>
            </div>        
        </div>
    )
}