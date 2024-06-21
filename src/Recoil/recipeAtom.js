import { atom } from 'recoil'

export const ingredientFormAtom = atom({
    key: 'ingredientForm',
    default: [{id:0,ingredient:'',quantity:'',unit:''}]
})

export const stepsFormAtom = atom({
    key: 'stepsForm',
    default:[{id:0,steps:'',files:'',order:'undefined'}]
})

export const finishedImagesAtom = atom({
    key: 'finishedImages',
    default : null
})