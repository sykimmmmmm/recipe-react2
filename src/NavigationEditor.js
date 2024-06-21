import React, { useEffect, useState } from "react";
import './styles/NavigationEditor.css'
import axios from "axios";
import { useRecoilState } from "recoil";
import { mainMenuAtom, subMenuAtom } from "../../../../Recoil/AdminAtom";
import classNames from "classnames";

function NavigationEditor ({token}) {
    
    const [mainMenu, setMainMenu] = useRecoilState(mainMenuAtom)
    const [subMenu, setSubMenu] = useRecoilState(subMenuAtom)

    const addMainMenu = () => {
        setMainMenu([...mainMenu, {
            mainIdx: mainMenu[mainMenu.length-1].mainIdx+1,
            mainName: '',
            mainPath: ''
        }])
    }

    const deleteMainMenu = (e, idx) => {
        if(mainMenu.length===1){
            return
        }

        const filteredMain = mainMenu.filter((check, i) =>{
            return check.mainIdx !== idx
        })
        
        const newMain = filteredMain.map((list, i) => {
            if(idx < list.mainIdx){
                list = {...list, mainIdx : list.mainIdx - 1}
            }
            return list
        })
        setMainMenu(newMain)
    }

    
    const addSubMenu = (e, idx) => {
        if(subMenu[idx]){
            setSubMenu({...subMenu, [idx] : [...subMenu[idx], {subIdx: subMenu[idx].length, subName: '', subPath: ''}]})
        }else{
            setSubMenu({...subMenu, [idx] : [{subIdx:0, subName: '', subPath: ''}]})
        }
    }

    const deleteSubMenu = (e, idx) => {
        if(!subMenu[idx]){
            return
        }
        const deleteLastMenu = subMenu[idx].filter((_, check) => {
            return check !== subMenu[idx].length - 1
        })
        setSubMenu({...subMenu, [idx] : [...deleteLastMenu]})
    }

    const inputMainValue = (e, idx) => { // 메인메뉴 인풋이벤트
        const {name, value} = e.target

        if(name.includes('Path') && value.includes('/')){
            return alert('"/"는 입력이 불가능 합니다.')
        }

        const mappingMenu = mainMenu.map((check, i)=>{
            if(check.mainIdx === idx){
                return {...check, [name]: value}
            }
            return check
        })

        setMainMenu(mappingMenu)
    }

    const inputSubValue = (e, mainIdx, $subIdx) => { // 서브메뉴 인풋이벤트
        const {name, value} = e.target

        if(name.includes('Path') && value.includes('/')){
            return alert('"/"는 입력이 불가능 합니다.')
        }

        const mappingMenu = subMenu[mainIdx].map(check => {
            if(check.subIdx === $subIdx){
                return {...check, [name]: value}
            }
            return check
        })
        setSubMenu({...subMenu, [mainIdx] : mappingMenu})
    }

    const saveNavData = async () => {
        const {data} = await axios.post('platform/upload/data', {
            navMainList: mainMenu, navSubList: subMenu
        },{headers : {'Authorization' : `Bearer ${token}`}})
        alert(data.msg)
    }

    const resetNavData = () => {
        let answer = prompt('초기화 하시겠습니까?')
        if(answer === '초기화'){
            setMainMenu([{mainIdx : 0, mainName: '', mainPath: ''}])
            setSubMenu({})
        }else{
            alert('초기화가 취소되었습니다.')
        }
    }

    const [openDetail1, setOpenDetail1] = useState(false)
    const [openDetail2, setOpenDetail2] = useState(false)

    // 유치원 안내, 교육마당, 알림마당, 학부모 마당, 홍보 마당, 정보공개
    // 교육 방향, 연혁
    return(
        <section className="navi-edit">
            <div className={classNames("summary", {skip : openDetail1})}>
                <h2>네비게이션 바 <button onClick={()=>setOpenDetail1(!openDetail1)}><span>{openDetail1 ? '설명보기' : '설명접기'}</span></button></h2>
                <p>현재 사용자가 어떤 위치에 있는지 확인할 수 있으며, 다른 메뉴로 이동을 돕는 기능을 말합니다.</p>
                <span>* 홈페이지간 페이지를 이동할 수 있는 있는 버튼의 모임입니다.</span>
            </div>
            <div className={classNames("summary", {skip : openDetail2})}>
                <h2>경로(URL) <button onClick={()=>setOpenDetail2(!openDetail2)}><span>{openDetail1 ? '설명보기' : '설명접기'}</span></button></h2>
                <p>현재 사용자의 위치에 대한 이름입니다.</p>
                <span>* http://www.kindermoumi.com / [경로] </span> <br/>
                <span>* 하위 메뉴의 경로는 "주소 / [상위 경로] / [하위 경로]" 입니다.</span>
            </div>
            <div className="remote-btns">
                <p>메뉴</p><span></span>
                <button onClick={addMainMenu}>추가</button>
                <button onClick={saveNavData}>저장</button>
                <button onClick={resetNavData}>초기화</button>
            </div>
            <div className="input-box upload">
                {mainMenu.map((_, idx1)=>{
                    return(
                        <div className="main-menu" key={idx1}>
                            <div className="half option-box">
                                <div className="btns">
                                    <p>대메뉴{idx1+1}</p>
                                    <button onClick={(e)=>deleteMainMenu(e, idx1)}>삭제</button>
                                </div>
                                <label>
                                    <p>메뉴명 <span>:</span></p><input placeholder="상위 메뉴명" name="mainName" onChange={(e)=>inputMainValue(e, idx1)} value={mainMenu[idx1].mainName}/>
                                </label>
                                <label>
                                    <p>경로 <span>:</span></p><input placeholder='"/" 없이 작성해주세요' name="mainPath" onChange={(e)=>inputMainValue(e, idx1)} value={mainMenu[idx1].mainPath}/>
                                </label>
                            </div>
                            <div className="half option-box">
                                <div className="btns">
                                    <p>대메뉴{idx1+1} 
                                    <span className="material-symbols-outlined">arrow_forward_ios</span>
                                    소메뉴</p>
                                    <button onClick={(e)=>addSubMenu(e, idx1)}>추가</button>
                                    <button onClick={(e)=>deleteSubMenu(e, idx1)}>삭제</button>
                                </div>
                                    {subMenu && subMenu[idx1] && subMenu[idx1].map((check, idx2)=>{
                                        return(
                                            <div className="sub-menu" key={idx2}>
                                                <label>
                                                    <p>메뉴명{idx2+1} <span>:</span></p> <input placeholder="하위 메뉴명" name="subName" onChange={(e)=>inputSubValue(e, idx1, idx2)} value={subMenu[idx1][idx2].subName}/>
                                                </label>
                                                <label>
                                                    <p>경로 <span>:</span></p> <input placeholder='"/" 없이 작성해주세요' name="subPath" onChange={(e)=>inputSubValue(e, idx1, idx2)} value={subMenu[idx1][idx2].subPath}/>
                                                </label>
                                            </div>
                                        )
                                    })}
                            </div>
                        </div>
                    )
                })} 
            </div>
            <div className="summary">
                <h2>마우스 오버 이벤트</h2>
                <p>마우스를 해당 위치에 올렸을 때 생기는 이벤트 입니다.</p>
                <span>(예시) 색상 변환, 하위 목록 열림 </span>
            </div>
            <div className="remote-btns">
                <p>공통 옵션</p><span></span>
                <button >저장</button>
                <button >초기화</button>
            </div>
            <div className="input-box">
                <div className="main-menu">
                    <div className="option-box">
                        <p>폰트 크기</p>
                        <div className="inner">
                            <label>
                                <p>대메뉴</p><input /><span>(px)</span>
                            </label>
                            <label>
                                <p>소메뉴</p><input/><span>(px)</span>
                            </label>
                        </div>
                    </div>
                    <div className="option-box">
                    <p>마우스 오버시 색상</p>
                        <label>
                            <input />
                        </label>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default NavigationEditor