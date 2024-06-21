import React from "react"

export default function Addingredient({id,value,handleInputChange,handleClick}){
        
    return (
        <div>
            <label >
                재료:
                <input type={'text'} placeholder='재료이름' name={`ingredient${id}`} value={value[id]&&value[id].ingredient}  
                onChange={(e) => handleInputChange(e,id, 'ingredient', e.target.value)}/>
                <input type={'text'} placeholder='재료 수량' name={`quantity${id}`} value={value[id]&&value[id].quantity}  
                onChange={(e) => handleInputChange(e,id, 'quantity', e.target.value)}/> 
                <input type={'text'} placeholder='단위(g/그램)' name={`unit${id}`} value={value[id]&&value[id].unit}  
                onChange={(e) => handleInputChange(e,id, 'unit', e.target.value)}/>
            </label>
            {id!==0&&<button onClick={()=>handleClick(id)}>삭제</button>}
        </div>
    )   
}