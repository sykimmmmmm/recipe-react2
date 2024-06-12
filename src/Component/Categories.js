import React from "react";
import { useSearchParams } from "react-router-dom";

export default function Categories({setFilterData}){
    const type = ['전체','밑반찬','메인반찬','국/탕','찌개','디저트','면/만두','밥/죽/떡','퓨전','김치/젓갈/장류','양념/소스/잼','양식','샐러드','스프','빵','과자','차/음료/술','기타']
    const situation = ['전체','일상','초스피드','손님접대','술안주','다이어트','도시락','영양식','간식','야식','푸드스타일링','해장','명절','이유식','기타']
    const process = ['전체','볶음','끓이기','부침','조림','무침','비빔','찜','절임','튀김','삶기','굽기','데치기','회','기타']
    const material = ['전체','소고기','돼지고기','닭고기','육류','채소류','해물류','달걀/유제품','가공식품류','쌀','밀가루','건어물류','버섯류','과일류','콩/견과류','곡류','기타']
    const [filter,setFilter] = useSearchParams({})
    const searchFilter =(e,id)=>{
        filter.set(e.target.name,e.target.value)
        setFilterData(filter)
    }

    return(
        <div className="category">
            <div>
                <span>종류별</span>
                    {type.map((value,id)=>{
                        return (
                        <label key={id} htmlFor={`${value}type`}>{value}
                                <input id={`${value}type`} name={'type'} value={value} type='radio' hidden onChange={e=>searchFilter(e,id)} defaultChecked={id===0}/>
                            </label>
                        )
                    })}                
            </div>
            <div>
                <span>상황별</span>
                    {situation.map((value,id)=>{
                        return (
                            <label key={id} htmlFor={`${value}situation`}>{value}
                                <input id={`${value}situation`} name={'situation'} value={value} type='radio' hidden onChange={e=>searchFilter(e,id)} defaultChecked={id===0}/>
                            </label>
                        )
                    })}                
            </div>
            <div>
                <span>방법별</span>
                    {process.map((value,id)=>{
                        return (
                            <label key={id} htmlFor={`${value}process`}>{value}
                                <input id={`${value}process`} name={'process'} value={value} type='radio' hidden onChange={e=>searchFilter(e,id)} defaultChecked={id===0}/>
                            </label>
                        )
                    })}                
            </div>
            <div>
                <span>재료별</span>
                    {material.map((value,id)=>{
                        return (
                            <label key={id} htmlFor={`${value}material`}>{value}
                                <input id={`${value}material`} name={'material'} value={value} type='radio' hidden onChange={e=>searchFilter(e,id)} defaultChecked={id===0}/>
                            </label>
                        )
                    })}                
            </div>
        </div>
    )
}