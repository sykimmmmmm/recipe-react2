import React,{useRef} from "react"

export default function AddSteps({id,value,changeHandler,handleClick,urlLink,fileChange}){
    
    const fileRef = useRef([])
    
    const fileOpen = (e,id)=>{
        e.preventDefault()
        fileRef.current[id].click()
    }

    return (
    <div>
        <h4>스텝{id+1}</h4>
        <div>
            <label >
                <textarea cols={50} rows={8} type={'text'} placeholder='조리법을 입력하세요' name={`steps${id}`} value={value[id] && value[id].steps}
                onChange={(e)=> changeHandler(e,id,'steps',e.target.value)}/>
            </label>
            <input hidden type={'file'} name={`recipeImage${id}`} accept={'image/*'} onChange={(e)=> fileChange(e,id,'files',e.target.files[0])} ref={el=>fileRef.current[id]=el}/>
            <div onClick={(e)=>fileOpen(e,id)}>{urlLink[id] !== undefined  && urlLink[id].src !=='' ?<img src={urlLink[id].src} alt='이미지 없음' style={{width:'200px',height:'200px'}}/>:<img src="./images/etc/addImage.png" alt="이미지추가"/>}</div>
            {id !== 0 && <button onClick={()=>handleClick(id)}>삭제</button>}
        </div>
    </div>
    )
}