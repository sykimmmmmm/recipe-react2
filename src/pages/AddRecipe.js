import React,{useEffect, useRef, useState} from 'react';
import IngredientForm from '../Component/IngredientForm';
import axios from 'axios'
import './styles/AddRecipe.css'
import StepsForm from '../Component/StepsForm';
import { useNavigate } from 'react-router-dom';
const people = ['1인분','2인분','3인분','4인분','5인분','6인분 이상']
const time = ['5분 이내','10분 이내','15분 이내','20분 이내','30분 이내','60분 이내','90분 이내','2시간 이내','2시간 이상']
const difficult = ['누구나 가능','쉬움','보통','어려움','매우 어려움']
const type = ['밑반찬','메인반찬','국/탕','찌개','디저트','면/만두','밥/죽/떡','퓨전','김치/젓갈/장류','양념/소스/잼','양식','샐러드','스프','빵','과자','차/음료/술','기타']
const situation = ['일상','초스피드','손님접대','술안주','다이어트','도시락','영양식','간식','야식','푸드스타일링','해장','명절','이유식','기타']
const process = ['볶음','끓이기','부침','조림','무침','비빔','찜','절임','튀김','삶기','굽기','데치기','회','기타']
const material = ['소고기','돼지고기','닭고기','육류','채소류','해물류','달걀/유제품','가공식품류','쌀','밀가루','건어물류','버섯류','과일류','콩/견과류','곡류','기타']

export default function AddRecipe(){
    const [recipeData,setRecipeData] = useState({'recipeTitle':'','name':'','description':'','people':'','time':'','difficult':'','ingredients0':'','steps':'','type':'','situation':'','process':'','material':''})
    const recipeRef = useRef({'recipeTitle':'','name':'','description':'','people':'','time':'','difficult':'','type':'','situation':'','process':'','material':''})
    const navigate = useNavigate()
    // 레시피 정보 입력
    const inputRecipe = (e)=>{
        let {name, value} = e.target
        recipeRef.current = {...recipeRef.current,[name]:value}
    }
    //ingredientForm 정보 저장
    const inputRef = useRef({0:{ingredient:'',quantity:'',unit:''}})
    const handleInputChange = (id, field, value) => {
        inputRef.current=({...inputRef.current,[id]: (inputRef.current[id]?{...inputRef.current[id],[field]: value}:{[field]:value})})
    }
    // stepsForm 정보 저장
    const stepsRef = useRef({0:{steps:'',file:'',order:''}})
    // stepsForm 이미지 첨부시 프리뷰
    const [urlLink,setUrlLink] = useState()
    const [prevFile,setPrevFile] = useState({})
    const stepsInputChange = (id, field, value) => {
        stepsRef.current=({...stepsRef.current,[id]: (stepsRef.current[id]?{...stepsRef.current[id],['order']:id,[field]: value}:{[field]:value})})
        const keys = Object.keys(stepsRef.current)
        const file = stepsRef.current[id].file
        keys.map((key)=>{
            if(stepsRef.current[key].file === ''){
                return stepsRef.current[key].order = undefined
            } 
            return
        })
        if(stepsRef.current[id].file && prevFile[id] !== stepsRef.current[id].file.name){
            setPrevFile({...prevFile,[id]:stepsRef.current[id].file.name})
            setUrlLink({...urlLink,[id]:{src: file&&file!=='undefined' && URL.createObjectURL(file)}})
        }
    }
    /* 이미지 저장 */
    const finishedRef = useRef()
    const [finishedImages,setFinishedImages] = useState([])
    const imgs = [...finishedImages]
    const previewImgs = ()=>{
        const images = finishedRef.current.files
        for(let i =0; i<images.length;i++){
            imgs.push({file:images[i],url:URL.createObjectURL(images[i])})
        }
        setFinishedImages(imgs)
    }
    const openFile = (e)=>{
        e.preventDefault()
        finishedRef.current.click()
    }
    //레시피 만들기 레시피데이터 저장
    const createRecipe = async(e)=>{
        e.stopPropagation()
        // 재료정보 결합
        const keys = Object.keys(inputRef.current)
        const ingredients = []
        keys.forEach((key)=>{
            let target = inputRef.current[key]
            let value = ''
            let ingredient = target.ingredient !== '' ? target.ingredient : ' '
            let quantity = target.quantity !== '' ? target.quantity : ' '
            let unit = target.unit !== '' ? target.unit : ' '
            if(target.ingredient === ''||target.quantity === ''||target.unit === ''){
                value = 'undefined'
            }else{
                value = ingredient+''+quantity+''+unit
            }
            ingredients.push(value)
        })
        // 조리순서
        const stepsKey = Object.keys(stepsRef.current)
        const steps=[]
        stepsKey.forEach((key,id)=>{
            let target = stepsRef.current[key]
            let value = ''
            if(target.steps === ''){value = 'undefined'}
            else{value= target.steps}
            steps.push(value)
        })
        if(validateValue(recipeRef.current)&&validateValue(ingredients)&&validateValue(steps)){
            const {recipeTitle,name,description,people,time,difficult,type,situation,process,material} = recipeRef.current
            if(e.target.name === 'save'){
                setRecipeData({recipeTitle,name,description,people,time,difficult,steps,type,situation,process,material,open:false,ingredients:ingredients})
            }else if(e.target.name === 'upload'){
                setRecipeData({recipeTitle,name,description,people,time,difficult,steps,type,situation,process,material,open:true,ingredients:ingredients})
            }
        }else{
            return alert('빠진 항목이있습니다')
        }
    } 


    // 레시피데이터가 저장되면 레시피 db로 저장
    useEffect(()=>{
        const recipeSave = async()=>{
            const token = JSON.parse(atob(sessionStorage.getItem('I')))
            let message = ''
            const cookingImgs = []            
            const finishedImgs = []
            const fd = new FormData()//이미지 서버저장
            for(let i in stepsRef.current){
                fd.append('recipeImage',stepsRef.current[i].file)
                fd.append('id',stepsRef.current[i].order)
            }
            finishedImages.forEach(img=>{
                fd.append('finishedImgs',img.file)
            })
            // console.log(stepsRef.current[0])
            await axios.post('recipes/upload',fd,{headers:{'Content-Type':'multipart/form-data','Authorization':`Bearer ${token}`}})
            .then(res => {
                res.data.cookingImgs && res.data.cookingImgs.forEach(data=>{
                    cookingImgs.push(data.value)
                })
                res.data.finishedImgs && res.data.finishedImgs.forEach(data=>{
                    finishedImgs.push(data.value)
                })
            })
            .catch(e=>{
                console.log(e)
                message = e.response.data.message
            })
            if(message !== ''){
                return alert(message)
            }
            // console.log(imgs)
            const {recipeTitle,name,description,people,time,difficult,steps,type,situation,process,material,open,ingredients} = recipeData
            await axios.post('/recipes/add-recipe',{
                recipeTitle,name,description,info:[people,time,difficult],ingredients,steps,category:[type,situation,process,material],open,cookingImgs,finishedImgs
            },{headers:{Authorization:`Bearer ${token}`}})
            .then(res => {
                const {message} = res.data
                // console.log(res.data)
                alert(message)
                navigate('/')
            })
            .catch(e=>{
                console.log(e)
            })
        }
        if(validateValue(recipeData)){
            recipeSave()
        }
    },[recipeData,stepsRef])

    return(
        <div className='wrapper'>
            <h2>레시피 등록</h2>
            <div className='addForm' onChange={inputRecipe}>
                <div className="basicInfo">
                    <label>
                        레시피제목:
                        <input type={'text'} placeholder='레시피제목을 입력하세요' name='recipeTitle' defaultValue={''}/>
                    </label>
                    <label>
                        요리명:
                        <input type={'text'} placeholder='요리이름을 입력하세요' name='name' defaultValue={''}/>
                    </label>
                    <label>
                        요리설명:
                        <textarea maxLength={100} cols={50} rows={3} type={'text'} placeholder='간단한 요리설명을 입력하세요' name='description' defaultValue={''}/>
                    </label>
                    <div>
                        요리정보
                        <div>
                            <label>
                                인원
                                <select defaultValue={''} name='people' >
                                    <option value=''>인원</option>
                                    {people.map((p,id)=>{
                                        return <option key={id} value={p}>{p}</option>
                                    })}
                                </select>
                            </label>
                            <label>
                                시간
                                <select defaultValue={''} name='time'>
                                    <option value=''>시간</option>
                                    {time.map((t,id)=>{
                                        return <option key={id} value={t}>{t}</option>
                                    })}
                                </select>
                            </label>
                            <label>
                                 난이도
                                <select defaultValue={''} name='difficult'>
                                    <option value={''}>난이도</option>
                                    {difficult.map((diff,id)=>{
                                        return <option key={id} value={diff}>{diff}</option>
                                    })}
                                </select>
                            </label>
                        </div>
                        <div>
                            <label>
                                종류별:
                                <select defaultValue={''} name='type'>
                                    <option value={''}>종류별</option>
                                    {type.map((ty,id)=>{
                                        return <option value={ty} key={id}>{ty}</option>
                                    })}
                                </select>    
                            </label>    
                            <label>
                                상황별:
                                <select defaultValue={''} name='situation'>
                                    <option value={''}>상황별</option>   
                                    {situation.map((sit,id)=>{
                                        return <option value={sit} key={id}>{sit}</option>
                                    })}
                                </select>    
                            </label>    
                            <label>
                                방법별:
                                <select defaultValue={''} name='process'>
                                    <option value={''}>방법별</option>   
                                    {process.map((pro,id)=>{
                                        return <option value={pro} key={id}>{pro}</option>
                                    })}
                                </select>    
                            </label>    
                            <label>
                                재료별:
                                <select defaultValue={''} name='material'>
                                    <option value={''}>재료별</option>   
                                    {material.map((mat,id)=>{
                                        return <option value={mat} key={id}>{mat}</option>
                                    })}
                                </select>    
                            </label>    
                        </div>  
                    </div>
                </div>
                <IngredientForm changeHandler={handleInputChange}ref={inputRef}></IngredientForm>
                <StepsForm changeHandler={stepsInputChange} ref={stepsRef} url={urlLink}/>
                <div className='finishedImgs'>
                    <label>완성된 사진 추가
                        <input type={'file'} hidden accept={'image/*'} name={'finishedImgs'} onChange={previewImgs} ref={finishedRef} multiple ></input>
                        <div onClick={openFile}>
                            {finishedImages.length>0 ? 
                                <>
                                    {finishedImages.map((image,id)=>{
                                        return(
                                            <img key={id} src={image.url}></img>
                                        )
                                    })}
                                    <img src='./images/etc/addImage.png' alt='+'/>
                                </>
                                :
                            <div>
                                <img src='./images/etc/addImage.png' alt='사진을 추가해주세요'/>
                            </div>}
                        </div>
                    </label>
                </div>
            </div>
            <div className="control-btns">
                <button name='save' onClick={createRecipe}>레시피 저장</button>
                <button name='upload' onClick={createRecipe}>레시피 공유</button>
            </div>
        </div>
    )
}

const validateValue = (obj)=>{
    return !Object.values(obj).includes('undefined')&&!Object.values(obj).includes('')
}

