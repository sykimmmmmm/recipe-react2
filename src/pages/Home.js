import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import RecipeList from '../Component/RecipeList';
import './styles/Home.css'
export default function Home(){
    return (
        <>
            <RecipeList/>
        </>
    )
}