import React,{ useRef, useState } from "react";
import { finishedImagesAtom } from "../../Recoil/recipeAtom"
import { useRecoilState } from "recoil"
import imageCompression from 'browser-image-compression'
export default function FinishImg(){

    const [finishedImages,setFinishedImages] = useRecoilState(finishedImagesAtom)
    const [urlLink,setUrlLink] = useState()
    const [prevLink,setPrevLink] = useState()
    const fileRef = useRef()
    
    const fileOpen = (e)=>{
        e.preventDefault()
        fileRef.current.click()
    }

    const previewImgs = async(e)=>{
        if(e.target.files[0]){
            const file = e.target.files[0]            
            const type = file.type.split('/')[0]
            if(type !=='image'){
                return alert('이미지파일만 가능합니다')
            }
            const options = {
                maxSizeMB: 0.2,
                maxWidthOrHeight: 1920,
                useWebWorker: true
            }
            const compressedFile = await imageCompression(file,options)
            const btoF = new File([compressedFile],file.name,{type:file.type})
            setPrevLink(URL.createObjectURL(file))
            setFinishedImages(btoF)
            setUrlLink(URL.createObjectURL(file))
        }
        
    }
    return(
        <div className='finishedImgs'>
            <label>완성된 사진 추가(테스트사이트로 한개만 추가가능합니다)
                <input type={'file'} hidden accept={'image/*'} name={'finishedImgs'} onChange={previewImgs} ref={fileRef}></input>
                <div>
                    {finishedImages ?
                    <>
                        <div>
                            <img src={urlLink? urlLink: prevLink}/>
                        </div>
                        <div>
                            <img src='./images/etc/addImage.png' alt='+' onClick={fileOpen}/>
                        </div>
                    </> 
                    :
                    <div>
                        <img src='./images/etc/addImage.png' alt='사진을 추가해주세요' onClick={fileOpen}/>
                    </div>
                    }
                </div>
            </label>
        </div>
    )
}