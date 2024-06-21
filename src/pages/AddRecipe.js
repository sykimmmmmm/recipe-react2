import React,{useEffect, useRef, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/AddRecipe.css'
import axios from 'axios'
import IngredientForm from '../Component/Recipe/IngredientForm';
import StepsForm from '../Component/Recipe/StepsForm';
import Selection from '../Component/Recipe/Selection';
import { useRecoilState, useRecoilValue } from 'recoil'
import { ingredientFormAtom, stepsFormAtom, finishedImagesAtom } from "../Recoil/recipeAtom";
import FinishImg from '../Component/Recipe/FinishImg';

const people = ['1인분','2인분','3인분','4인분','5인분','6인분 이상']
const time = ['5분 이내','10분 이내','15분 이내','20분 이내','30분 이내','60분 이내','90분 이내','2시간 이내','2시간 이상']
const difficult = ['누구나 가능','쉬움','보통','어려움','매우 어려움']
const type = ['밑반찬','메인반찬','국/탕','찌개','디저트','면/만두','밥/죽/떡','퓨전','김치/젓갈/장류','양념/소스/잼','양식','샐러드','스프','빵','과자','차/음료/술','기타']
const situation = ['일상','초스피드','손님접대','술안주','다이어트','도시락','영양식','간식','야식','푸드스타일링','해장','명절','이유식','기타']
const process = ['볶음','끓이기','부침','조림','무침','비빔','찜','절임','튀김','삶기','굽기','데치기','회','기타']
const material = ['소고기','돼지고기','닭고기','육류','채소류','해물류','달걀/유제품','가공식품류','쌀','밀가루','건어물류','버섯류','과일류','콩/견과류','곡류','기타']

export default function AddRecipe(){
    const navigate = useNavigate()
    // 레시피 기본정보 입력
    const [recipeBasicInfo,setRecipeBasicInfo] = useState({})
    const inputRecipe = (e)=>{
        let {name, value} = e.target
        setRecipeBasicInfo({...recipeBasicInfo,[name]:value})
    }

    //ingredientForm 정보 저장
    const ingredientForm = useRecoilValue(ingredientFormAtom)

    // stepsForm 정보 저장
    const stepsForm = useRecoilValue(stepsFormAtom)

    /* 이미지 저장 */
    const finishedImages = useRecoilValue(finishedImagesAtom)

    // 레시피 데이터 병합
    const [allData,setAllData]= useState({})
    // //레시피 만들기 레시피데이터 저장
    const createRecipe = (e)=>{
        e.stopPropagation()
        // 재료정보 결합
        const newIngredients = ingredientForm.map(ingredients=>{
            let {ingredient,quantity,unit} = ingredients
            return ingredient + quantity + unit
        })
        // 조리순서
        const newSteps= stepsForm.map(steps=>{
            return steps.steps
        })
        
        if(validateValue(newIngredients)&&validateValue(newSteps)){
            const {recipeTitle,description,people,time,difficult,type,situation,process,material} = recipeBasicInfo
            if(e.target.name === 'save'){
                setAllData({recipeTitle,description,people,time,difficult,steps:newSteps,type,situation,process,material,open:false,ingredients:newIngredients})
            }else if(e.target.name === 'upload'){
                setAllData({recipeTitle,description,people,time,difficult,steps:newSteps,type,situation,process,material,open:true,ingredients:newIngredients})
            }
        }else{
            return alert('빠진 항목이있습니다')
        }
    } 
    // 레시피데이터가 저장되면 레시피 db로 저장
    useEffect(()=>{
        const recipeSave = async()=>{
            const token = JSON.parse(atob(sessionStorage.getItem('I')))
            const cookingImgs = []            
            const finishedImgs = []
            const formData = new FormData()
            stepsForm.forEach(steps=>{
                formData.append('recipeImages',steps.files)
                formData.append('order',steps.order)            
            })
            finishedImages && formData.append('finishedImgs',finishedImages)
            // console.log(stepsRef.current[0])
            await axios.post('recipes/upload',formData,{headers:{'Content-Type':'multipart/form-data','Authorization':`Bearer ${token}`}})
            .then(res => {
                console.log(res)
                res.data.cookingImgs && res.data.cookingImgs.forEach(data=>{
                    cookingImgs.push(data.value)
                })
                res.data.finishedImgs && res.data.finishedImgs.forEach(data=>{
                    finishedImgs.push(data.value)
                })
            })
            .catch(e=>{
                console.log(e)
            })
            // console.log(imgs)
            // const {recipeTitle,description,people,time,difficult,steps,type,situation,process,material,open,ingredients} = allData
            // await axios.post('/recipes/add-recipe',{
            //     recipeTitle,description,info:[people,time,difficult],ingredients,steps,category:[type,situation,process,material],open,cookingImgs,finishedImgs
            // },{headers:{Authorization:`Bearer ${token}`}})
            // .then(res => {
            //     const {message} = res.data
            //     // console.log(res.data)
            //     alert(message)
            //     navigate('/')
            // })
            // .catch(e=>{
            //     console.log(e)
            // })
        }
        if(validateValue(allData)){
            recipeSave()
        }
    },[allData])

    return(
        <div className='wrapper'>
            <h2>레시피 등록</h2>
            <div className='addForm' >
                <div className="basicInfo" onChange={inputRecipe}>
                    <label>
                        레시피제목:
                        <input type={'text'} placeholder='레시피제목을 입력하세요' name='recipeTitle' defaultValue={''}/>
                    </label>
                    <label>
                        요리설명:
                        <textarea maxLength={500} cols={50} rows={3} type={'text'} placeholder='간단한 요리설명을 입력하세요' name='description' defaultValue={''}/>
                    </label>
                    <div>
                        요리정보
                        <div>
                            <Selection child={'인원'} name='people' data={people}/>
                            <Selection child={'시간'} name='time' data={time}/>
                            <Selection child={'난이도'} name='difficult' data={difficult}/>
                        </div>
                        <div>
                            <Selection child={'종류별'} name='type' data={type}/>
                            <Selection child={'상황별'} name='situation' data={situation}/>
                            <Selection child={'방법별'} name='process' data={process}/>
                            <Selection child={'재료별'} name='material' data={material}/>
                        </div>  
                    </div>
                </div>
                <IngredientForm></IngredientForm>
                <StepsForm></StepsForm>
                <FinishImg/>
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

