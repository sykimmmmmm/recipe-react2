import React, { useState, useEffect, forwardRef } from "react";

const IngredientForm = forwardRef(({changeHandler},ref)=>{

    const [ingredientForm,setIngredientForm] = useState([])
    const [inputValue, setInputValue] = useState({})

    const addingredient = () =>{
        const newId = ingredientForm.length ? ingredientForm[ingredientForm.length-1].id + 1 : 1
        setIngredientForm([...ingredientForm,{id:newId}])
        Object.values(ref.current).length>0 ?
        setInputValue(values => ({
            ...ref.current,
            [newId]: { ingredient: '', quantity: '', unit: '' },
        })):
        setInputValue(values => ({
            ...values,
            [newId]: { ingredient: '', quantity: '', unit: '' },
        }))
    }

    useEffect(()=>{
        ref.current = {
            ...inputValue, ...ref.current
        }
    })
    const pleaseDeleteMe = (id) =>{
        setIngredientForm(ingredientForm.filter(form=>{
            return form.id !== id
        }))
        setInputValue(values => {
            // const newValues = { ...values }
            const newValues = { ...ref.current }
            delete newValues[id]
            return newValues
        })
        const deleteRef = (data,id)=>{
            const newvalues = {...data}
            delete newvalues[id]
            return newvalues
        }
        ref.current = deleteRef(ref.current,id)
    }
    
    
      
    const Addingredient = ({id}) =>{
        return (
        <div>
            <label >
                재료:
                <input type={'text'} placeholder='재료이름' name={`ingredient${id}`} defaultValue={ref.current[id]?ref.current[id].ingredient:''}  
                onChange={(e) => changeHandler(id, 'ingredient', e.target.value)}/>
                <input type={'text'} placeholder='재료 수량' name={`quantity${id}`} defaultValue={ref.current[id]?ref.current[id].quantity:''}
                onChange={(e) => changeHandler(id, 'quantity', e.target.value)}/> 
                <input type={'text'} placeholder='단위(g/그램)' name={`unit${id}`} defaultValue={ref.current[id]?ref.current[id].unit:''}
                onChange={(e) => changeHandler(id, 'unit', e.target.value)}/>
            </label>
            <button onClick={()=>pleaseDeleteMe(id)}>삭제</button>
        </div>
        )
    }
    
    return(
        <div className='ingredients'>
            <div>
                <label>
                    재료:
                    <input type={'text'} placeholder='재료이름' name={`ingredient0`} defaultValue={ref.current[0]?ref.current[0].ingredient:''}
                    onChange={(e)=> changeHandler(0,'ingredient',e.target.value)}/>
                    <input type={'text'} placeholder='재료 수량' name={`quantity0`} defaultValue={ref.current[0]?ref.current[0].quantity:''}
                    onChange={(e)=> changeHandler(0,'quantity',e.target.value)}/>
                    <input type={'text'} placeholder='단위(g/그램)' name={`unit0`} defaultValue={ref.current[0]?ref.current[0].unit:''}
                    onChange={(e)=> changeHandler(0,'unit',e.target.value)}/>
                </label>
            </div>
            {ingredientForm.length>0 && ingredientForm.map((value)=>{
                return <Addingredient id={value.id} key={value.id}/>
            })}
            <button className='btn' onClick={addingredient}>재료 추가</button>
        </div>
    )

})

export default IngredientForm
// setInputValue(values => ({
        //     ...values,
        //     [newId]: { ingredient: '', quantity: '', unit: '' },
        // }))
    // const inputRef = useRef({})

        // const handleInputChange = (id, field, value) => {
        //     // console.log(inputValue[id])
        //     inputRef.current=({...ref.current,[id]: (ref.current[id]?{...ref.current[id],[field]: value}:{[field]:value})})
        //     // setInputValue(values => ({
        //     //   ...values,[id]: {...values[id],[field]: value}
        //     // }))
        // }