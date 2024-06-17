import React from 'react'

export default function Selection({child,name,data}){

    return(
        <label>
            {child}
            <select defaultValue={''} name={name} >
                <option value=''>{child}</option>
                {data.map((value,id)=>{
                    return <option key={id} value={value}>{value}</option>
                })}
            </select>
        </label>
    )
}