import React, { useState, useEffect } from 'react';
import { auth } from "../../firebase";
import { useParams } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { getDocData, getAllData, addCommentText } from '../../firebase'
import "./singleRecipe.scss";
import star from '../../assets/img/star.svg';
import Header from '../Header';
import Footer from '../Footer';

function SingleRecipe() {
    let { id } = useParams();
    const [user] = useAuthState(auth);
    const [recipe, setRecipe] = useState({})
    const [ingredients, setIngredients] = useState([])
    const [steps, setSteps] = useState([])
    const [comments, setComments] = useState([])
    const [commentText, setCommentText] = useState("");

    const getDataRecipe = async () => {
        try {
            const getJournaux = await getDocData("recipes", id);
            setRecipe(getJournaux);
        } catch (error) { console.log(error) }
    }

    const getIngredients = async () => {
        try {
            const getIngredients = await getAllData(`recipes/${id}/ingredients`);
            setIngredients(getIngredients);
        } catch (error) { console.log(error) }
    }

    const addComment = async (e) => {
        try {
            await addCommentText(commentText, user, id);
            await getComments();
        } catch (error) { console.log(error) }
    }


    const getComments = async () => {
        try {
            const getComments = await getAllData(`recipes/${id}/comments`);
            setComments(getComments);
        } catch (error) { console.log(error) }
    }

    const getSteps = async () => {
        try {
            const getSteps = await getAllData(`recipes/${id}/steps`);
            setSteps(getSteps);
        } catch (error) { console.log(error) }
    }

    useEffect(() => {
        getDataRecipe();
        getIngredients();
        getSteps();
        getComments();
    }, [])

    return (
        <div className="singleRecipe container-fluid">
            {<Header />}
            <div className="singleRecipe__container container">
                <div className='singleRecipe__title h1'>{recipe.name}</div>
                <div className='singleRecipe__header'>
                    <div className='singleRecipe__image-container'>
                        <div className='singleRecipe__image' style={{ backgroundImage: `url(${recipe.imgUri})` }}></div>
                    </div>
                    <div className='singleRecipe__header--right'>
                        <div className='singleRecipe__filter'>
                            <div className='singleRecipe__filter-item'>
                                <div className='singleRecipe__filter-title h3'>Complexity</div>
                                {(() => {
                                    const options = [];
                                    for (let i = 0; i < 3; i++) {
                                        options.push(<img key={Math.random()} src={star} alt={`complexity${i}`}></img>)
                                    }
                                    return options;
                                })()}
                            </div>
                            <div className='singleRecipe__filter-item'>
                                <div className='singleRecipe__filter-title h3'>Time</div>
                                <div className="p">{recipe.cookTime}min</div>
                            </div>
                            <div className='singleRecipe__filter-item'>
                                <div className='singleRecipe__filter-title h3'>Serves</div>
                                <div className="p">{recipe.serves}</div>
                            </div>
                            <div className='singleRecipe__filter-item'>
                                <div className='singleRecipe__filter-title h3'>Cuisine</div>
                                <div className="p">{recipe.cuisines}</div>
                            </div>
                        </div>
                        <div className='singleRecipe__description p'>
                            {recipe.description}
                        </div>
                        <div className='singleRecipe__ingradients'>
                            <div className='singleRecipe__ingradients-title h3'>Ingradients:</div>
                            <div className='singleRecipe__ingradients-ingradients'>
                                {Object.keys(ingredients || {}).map(ingredient => (
                                    <div key={Math.random()} className='singleRecipe__ingradients-item'>
                                        <img key={Math.random()} src={ingredients[ingredient].imgUri} alt={`${ingredients[ingredient].name}`}></img>
                                        <div className='p'>{ingredients[ingredient].unit} {ingredients[ingredient].name}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className='singleRecipe__steps'>
                    {Object.keys(steps || {}).map((step, count) => (
                        <div className='singleRecipe__step' key={Math.random()}>
                            <div className='singleRecipe__count p'>{count += 1}</div>
                            <div className='singleRecipe__steps-title h2'>{steps[step].title}</div>
                            <div className='singleRecipe__steps-image-container'>
                                <div className='singleRecipe__image' style={{ backgroundImage: `url(${steps[step].imgUri})` }}></div>
                            </div>
                            <div className='singleRecipe__steps-description p'>{steps[step].description}</div>
                        </div>
                    ))}
                </div>
                <div className='h1 singleRecipe__bonapetit'>Bon appetit!</div>
                <div className='singleRecipe__comments'>
                    <div className='singleRecipe__comments-title h2'>Comments</div>
                    <textarea
                        className='singleRecipe__comments-textarea'
                        value={commentText}
                        placeholder="Add a comment"
                        onChange={(e) => setCommentText(e.target.value)}>
                       
                    </textarea>
                    <button className='button' onClick={addComment}>Send</button>
                    {Object.keys(comments).length === 0 ? <div className='h3'>There are no comments yet. Be the first!</div> :
                        Object.keys(comments || {}).map((comment, count) => (
                            <div className='singleRecipe__comment' key={Math.random()}>
                                <div className='singleRecipe__comment-name '>{comments[comment].userName}</div>
                                <div className='singleRecipe__comment-date p'>{comments[comment].date.toDate().toDateString()}</div>
                                <div className='singleRecipe__comment-comment h3'>{comments[comment].comment}</div>
                            </div>
                        ))}
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default SingleRecipe;