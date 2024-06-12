import React, { useState, useEffect, forwardRef, useRef } from "react";

const StepsForm = forwardRef(({changeHandler,url},ref)=>{
    const [stepForm,setStepForm] = useState([])
    const [inputValue, setInputValue] = useState({})
    const [urlLink,setUrlLink] = useState()
    const fileRef = useRef([])
    const addingredient = () =>{
        const newId = stepForm.length ? stepForm[stepForm.length-1].id + 1 : 1
        setStepForm([...stepForm,{id:newId}])
        Object.values(ref.current).length>0 ?
        setInputValue(values => ({
            ...ref.current,
            [newId]: { steps: '', file:''},
        })):
        setInputValue(values => ({
            ...values,
            [newId]: { steps: '',file:'' },
        }))
    }
    useEffect(()=>{
        ref.current = {
            ...inputValue, ...ref.current
        }
        setUrlLink(url)
    },[inputValue,url,ref])

    const pleaseDeleteMe = (id) =>{
        
        setStepForm(stepForm.filter(form=>{
            return form.id !== id
        }).map((form)=>{
            if(form.id>id){
                form.id = form.id-1
            }
            return form
        }))
        setInputValue(values => {
            let newValues = { ...ref.current }
            delete newValues[id]
            newValues[id] = {...newValues[id+1],['order']:id}
            const length = Object.values(newValues).length
            delete newValues[length-1]
            return newValues
        })

        const deleteRef = (data,id)=>{
            const newvalues = {...data}
            const keys = Object.keys(newvalues)
            newvalues[id] = {...newvalues[id+1],['order']:id}
            // delete newvalues[id+1]
            keys.forEach((key)=>{
                if(+key>id){
                    console.log(newvalues[key])
                    newvalues[key] = {...newvalues[+key+1],['order']:+key}
                }
                if(+key===keys.length-1){   
                    console.log('dd')
                    delete newvalues[key]
                }
                console.log(newvalues[key])
            })
            console.log(newvalues)
            return newvalues
        }
        ref.current = deleteRef(ref.current,id)
        console.log(ref.current)

        for(let i in ref.current){
            changeHandler(i,'file',ref.current[i].file)
        }
    }
    // console.log(stepForm)
    const Steps = ({id}) =>{
        return (
        <div>
            <h4>스텝{id+1}</h4>
            <div>
                <label >
                    <textarea cols={50} rows={8} type={'text'} placeholder='조리법을 입력하세요' name={`steps${id}`} defaultValue={ref.current[id]?ref.current[id].steps:''}
                    onChange={(e)=> changeHandler(id,'steps',e.target.value)}/>
                </label>
                <input hidden type={'file'} name={`recipeImage${id}`} accept={'image/*'} onChange={(e)=> changeHandler(id,'file',e.target.files[0])} ref={el=>fileRef.current[id]=el}/>
                <div id={id} onClick={(e)=>fileOpen(e,id)}>{urlLink&&urlLink[id] !== undefined  && urlLink[id].src !=='' ?<img src={urlLink[id].src} alt='이미지 없음' style={{width:'200px',height:'200px'}}/>:<img src="./images/etc/addImage.png" alt="이미지추가"/>}</div>
                <button onClick={()=>pleaseDeleteMe(id)}>삭제</button>
            </div>
        </div>
        )
    }
    const fileOpen = (e,id)=>{
        e.preventDefault()
        fileRef.current[id].click()
    }
    return(
        <div className='steps'>
            <div>
                <h4>스텝1</h4>
                <div>
                    <label>
                        <textarea cols={50} rows={8} type={'text'} placeholder='조리법을 입력하세요' name={`steps0`} defaultValue={ref.current[0]?ref.current[0].steps:''}
                        onChange={(e)=> changeHandler(0,'steps',e.target.value)} />
                    </label>
                    <input hidden type={'file'} accept={'image/*'} name='recipeImage0' onChange={(e)=> changeHandler(0,'file',e.target.files[0])} ref={el=>fileRef.current[0]=el}/>
                    <div onClick={(e)=>fileOpen(e,'0')}>{urlLink && urlLink[0] !==undefined && urlLink[0].src !=='' &&ref.current[0].file !== '' ?<img src={urlLink[0].src} alt='이미지 없음' style={{width:'200px',height:'200px'}}/>:<img src="./images/etc/addImage.png" alt="이미지추가"/>}</div>
                </div>
            </div>
            {stepForm.length>0 && stepForm.map((value)=>{
                return <Steps id={value.id} key={value.id}/>
            })}
            <button className='btn' onClick={addingredient}>순서 추가</button>
        </div>
    )

})

export default StepsForm