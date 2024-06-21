import React,{useState} from "react";
import { stepsFormAtom } from "../../Recoil/recipeAtom";
import { useRecoilState } from "recoil";
import AddSteps from "./AddSteps";
import imageCompression from 'browser-image-compression'

const StepsForm = ()=>{

    // 조리순서 정보
    const [stepsForm,setStepsForm] = useRecoilState(stepsFormAtom)
    
    // 조리순서 추가
    const addingredient = () =>{
        const newId = stepsForm.length ? stepsForm[stepsForm.length-1].id + 1 : 1
        if(newId >= 3){
            return alert('무료 배포 사이트 제한으로 최대 3개만 만들수 있습니다')
        }
        setStepsForm([...stepsForm,{id:newId,steps:'',files:'',order:'undefined'}])
    }
    // 미리보기 이미지
    const [urlLink,setUrlLink] = useState([])

    // 정보 저장
    const stepsInputChange = async(e,idx, field, value) => {
        const newSteps = stepsForm.map(values=>{
            if(values.id === idx){
                return {...values,[field]:value}
            }else{
                return values
            }
        })
        setStepsForm(newSteps)
    }
    const [prevLink,setPrevLink] = useState([])
    const fileInput = async(e,idx,field,value)=>{
        const file = await Promise.all(stepsForm.map(async(steps)=>{
            if(steps.id===idx&&value){
                if(value.type.split('/')[0] !== 'image'){
                    alert('이미지파일만 가능합니다')
                    return {...steps}
                }
                const options = {
                    maxSizeMB: 0.2,
                    maxWidthOrHeight: 1920,
                    useWebWorker: true
                }
                const compressedFile = await imageCompression(value,options)
                const btoF = new File([compressedFile],value.name,{type:value.type})
                prevLink[idx] = URL.createObjectURL(value)
                setPrevLink(prevLink)
                return {...steps,[field]:btoF,order:idx}
            }
            return steps
        }))
        if(value){
            const type = value.type.split('/')[0] 
            urlLink[idx] = {...urlLink[idx], order:idx,src: value && type === 'image' ?URL.createObjectURL(value) : prevLink[idx]}
            setUrlLink(urlLink)
        }
        setStepsForm(file)
    }
    // 삭제
    const pleaseDeleteMe = (idx) =>{
        setStepsForm(stepsForm.filter(form=>{
            return form.id !== idx
        }).map((form)=>{
            if(form.id>idx){
                return {...form,id:form.id-1,order:form.order-1}
            }
            return form
        }))
        for(let i = idx; i<urlLink.length-1;i++){
            urlLink[i]={...urlLink[i+1]}
        }
        delete urlLink[urlLink.length-1]
        setUrlLink(urlLink)
    }

    return(
        <div className='steps'>
            {stepsForm.length>0 && stepsForm.map((value,idx)=>{
                return <AddSteps id={value.id} urlLink={urlLink} key={value.id} value={stepsForm} handleClick={pleaseDeleteMe} fileChange={fileInput}changeHandler={stepsInputChange}/>
            })}
            <button className='btn' onClick={addingredient}>순서 추가</button>
        </div>
    )
}

export default StepsForm