import React from "react";
import { useRecoilState } from 'recoil'
import { ingredientFormAtom } from "../../Recoil/recipeAtom";
import Addingredient from "./AddIngredient";

const IngredientForm = ()=>{

    const [ingredientForm,setIngredientForm] = useRecoilState(ingredientFormAtom)
    
    // 재료추가
    const addingredient = () =>{
        const newId = ingredientForm.length ? ingredientForm[ingredientForm.length-1].id + 1 : 1
        if(newId>=3){
            return alert('테스트 사이트로 최대 3개까지 추가할 수 있습니다.')
        }
        setIngredientForm([...ingredientForm,{id:newId,ingredient:'',quantity:'',unit:''}])
    }

    // 정보입력
    const handleInputChange = (e,idx, field, value) => {
        const newingredient = ingredientForm.map(values=>{
            if(values.id === idx){
                return {...values,[field]:value}
            }else{
                return values
            }
        })
        setIngredientForm(newingredient)

    }

    // 삭제
    const pleaseDeleteMe = (idx) =>{
        setIngredientForm(ingredientForm.filter(form=>{
            return form.id !== idx
        }).map((form)=>{
            if(form.id>idx){
                return {...form,id:form.id-1}
            }
            return form
        }))
    }
    
    return(
        <div className='ingredients'>
            {ingredientForm.length>0 && ingredientForm.map((value)=>{
                return <Addingredient id={value.id} key={value.id} value={ingredientForm} handleInputChange={handleInputChange} handleClick={pleaseDeleteMe}/>
            })}
            <button className='btn' onClick={addingredient}>재료 추가</button>
        </div>
    )

}

export default IngredientForm
