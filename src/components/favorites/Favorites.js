import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { getAllData, favorites } from '../../firebase'
import './../recipes/recipes.scss';
import Header from '../Header';
import Footer from '../Footer';

import { useAuthState } from "react-firebase-hooks/auth";

function Registration() {
    const [user, loading] = useAuthState(auth);
    const [recipes, setRecipes] = useState({});
    const navigate = useNavigate();

    const getDataRecipes = async () => {
        try {
            const getRecipes = await getAllData(`users/${user.uid}/favoriteRecipes`);
            setRecipes(getRecipes);
            console.log(recipes);
        } catch (error) { console.log(error) }
    }

    const addToFavorites = async (e, recipe) => {
        e.preventDefault();
        await favorites(user, recipe);
        setTimeout(() => {
            getDataRecipes();;
        }, 100)
    }

    useEffect(() => {
        if (!user) return navigate("/login");
        if (user) {
            getDataRecipes();
        }
    }, [loading, user])

    return (
        <div className="recipes container-fluid">
            {<Header />}
            <div className="recipes__container container">
                <div className='recipes__title h1'>Favorites</div>
                <div className='recipes__recipes'>
                    {Object.keys(recipes).length != 0 ?
                        Object.keys(recipes || {}).map(item => (
                            <div key={Math.random()} className='recipes__recipe'>
                                <Link
                                    to={{ pathname: `/recipes/${item}` }}>
                                    <div className='recipes__recipe-image' style={{ backgroundImage: `url(${recipes[item].imgUri})` }}>
                                        <div className='recipes__recipe--bottom'>
                                            <div className='h3 recipes__recipe-title'>{recipes[item].name}</div>
                                            <button
                                                onClick={(e) => addToFavorites(e, item)}
                                                className={`recipes__recipe-like-button recipes__recipe-like-button--red p`}>SAVE IT</button>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))
                        : <div className='h3'>Do you have any favorite recipes?&nbsp;
                            <Link to="/recipes">
                                <button className="button--green h3"> Add them!</button>
                            </Link></div>
                    }
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Registration;