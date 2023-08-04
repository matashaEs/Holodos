import { auth } from "../../firebase";
import { getAllData, filter, favorites, getUserId } from '../../firebase'
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import CreatableSelect from 'react-select/creatable';
import { useAuthState } from "react-firebase-hooks/auth";
import "./recipes.scss";
import star from '../../assets/img/star.svg';
import person from '../../assets/img/person.svg';
import close from '../../assets/img/close.svg';
import Header from '../Header';
import Footer from "../Footer";

function Recipes() {
  const [user, loading] = useAuthState(auth);
  const [recipes, setRecipes] = useState({})
  const [categories, setCategories] = useState({})
  const [searchValue, setSearchValue] = useState("")
  const [searchResult, setSearchResult] = useState({})
  const [searchError, setSearchError] = useState("")
  const [categoryActive, setCategoryActive] = useState("")
  const [popup, setPopup] = useState("")
  const [favoritesRecipe, setFavoritesRecipe] = useState({});
  const navigate = useNavigate();

  const cookTimeOptions = [
    { value: 30, label: "<30 min", name: "cookTime", action: "<=" },
    { value: 60, label: "<60 min", name: "cookTime", action: "<=" },
    { value: 60, label: ">60 min", name: "cookTime", action: ">=" },
  ];

  const complexityOptions = [
    { value: 1, label: <div><img src={star} alt="complexity1"></img></div>, name: "complexity", action: "==" },
    { value: 2, label: <div><img src={star} alt="complexity2"></img> <img src={star} alt="complexity2"></img></div>, name: "complexity", action: "==" },
    { value: 3, label: <div><img src={star} alt="complexity3"></img> <img src={star} alt="complexity3"></img> <img src={star} alt="complexity3"></img></div>, name: "complexity", action: "==" },
    { value: 4, label: <div><img src={star} alt="complexity4"></img> <img src={star} alt="complexity4"></img> <img src={star} alt="complexity4"></img> <img src={star} alt="complexity4"></img></div>, name: "complexity", action: "==" },
    { value: 5, label: <div><img src={star} alt="complexity5"></img> <img src={star} alt="complexity5"></img> <img src={star} alt="complexity5"></img> <img src={star} alt="complexity5"></img> <img src={star} alt="complexity5"></img></div>, name: "complexity", action: "==" },
  ];

  const servesOptions = [
    { value: 1, label: <div><img src={person} alt="serves1"></img></div>, name: "serves", action: "==" },
    { value: 2, label: <div><img src={person} alt="serves2"></img><img src={person} alt="serves2"></img></div>, name: "serves", action: "==" },
    { value: 3, label: <div><img src={person} alt="serves3"></img><img src={person} alt="serves3"></img><img src={person} alt="serves3"></img>+</div>, name: "serves", action: ">=" },
  ];

  const cuisinesOptions = [
    { value: "Italian", label: "Italian", name: "cuisines", action: "==" },
    { value: "French", label: "French", name: "cuisines", action: "==" },
    { value: "Spanish", label: "Spanish", name: "cuisines", action: "==" },
    { value: "Indian", label: "Indian", name: "cuisines", action: "==" },
    { value: "Mexican", label: "Mexican", name: "cuisines", action: "==" },
    { value: "American", label: "American", name: "cuisines", action: "==" },
  ];

  const getDataRecipes = async () => {
    try {
      const getRecipes = await getAllData("recipes");
      setRecipes(getRecipes);
    } catch (error) { console.log(error) }
  }

  const getDataCategories = async () => {
    try {
      const getCategories = await getAllData("categories");
      setCategories(getCategories);
    } catch (error) { console.log(error) }
  }

  const filterRecipe = async (selectedOptions) => {
    try {
      setSearchError("");
      const filterResults = await filter(selectedOptions.name, selectedOptions.action, selectedOptions.value);
      if (Object.keys(filterResults).length === 0) {
        setSearchError("No recipes match your criteria");
      } else {
        setSearchResult(filterResults);
      }
    } catch (error) { console.log(error) }
  }

  const filterCategoryRecipe = async (e, categor) => {
    e.preventDefault();
    setCategoryActive(categor)
    setSearchError("");
    const results = {};
    try {
      const getRecipes = await getAllData("recipes");
      Object.keys(getRecipes || {}).map(async recipe => {
        const getCategories = await getAllData(`recipes/${recipe}/categories`);
        Object.keys(getCategories || {}).map(async category => {
          if (getCategories[category].name === categor) {
            results[recipe] = getRecipes[recipe];
            setSearchResult(results);
          }
        })
        if (Object.keys(results).length === 0) {
          setSearchError("No recipe match your criteria");
        }
      })
    } catch (error) { console.log(error) }
  }

  const searchRecipe = (e) => {
    e.preventDefault();
    navigate(`/recipes?q=${searchValue}`)
    const results = {};
    Object.keys(recipes || {})
      .filter(key => recipes[key].name.toLowerCase().includes(searchValue.toLowerCase()))
      .forEach((key) => {
        results[key] = recipes[key];
        setSearchResult(results);
      })
  }

  const isFavorites = async () => {
    try {
      const getUsId = await getUserId(user);
      setFavoritesRecipe(getUsId);
    } catch (error) { console.log(error) }
  }

  const addToFavorites = async (e, recipe) => {
    e.preventDefault();
    if (user) {
      await favorites(user, recipe);
      setTimeout(() => {
        isFavorites();
      }, 100)

    } else {
      setPopup("--active");
    }
  }

  const customStyles = {
    option: () => ({
      display: 'flex',
      alignSelf: 'center',
      color: "#2A2D34",
      paddingLeft: '15px',
      height: '25px',
      marginBottom: '5px',
      "&:hover": {
        backgroundColor: "#80899E"
      }
    }),
    container: (provided) => ({
      ...provided,
      width: "170px",
      position: 'relative',
    }),
    control: () => ({
      backgroundColor: '#23957E',
      display: 'flex',
      width: '100%',
      borderRadius: '100px',
      position: 'relative',
      zIndex: '100',
      justifyContent: 'space-between',
    }),
    indicatorSeparator: () => ({
      display: 'none',
    }),
    indicatorsContainer: () => ({
      marginRight: '1rem',
      display: 'flex',
      alignItems: 'center',
    }),
    placeholder: () => ({
      color: '#FBFEF9',
      fontFamily: 'var(--font-poppins);',
      fontSize: '16px',
      fontWeight: '400',
    }),
    valueContainer: () => ({
      display: 'flex',
      alignItems: 'center',
      paddingLeft: '13px',
    }),
    menu: () => ({
      background: '#F2F2F2',
      borderRadius: '0px 0px 10px 10px',
      position: 'absolute',
      width: '100%',
      marginTop: '-3rem',
      zIndex: '1',
      paddingTop: '35px',
    }),
    singleValue: (state) => ({
      opacity: state.isDisabled ? 0.5 : 1,
      transition: 'opacity 300ms',
      color: '#FBFEF9',
    })
  }

  useEffect(() => {
    getDataRecipes();
    getDataCategories();
    if (user) {
      isFavorites();
    }
  }, [loading, user])

  return (
    <div className="recipes container-fluid">
      {<Header />}
      <div className="recipes__container container">
        <div className='recipes__title h1'>Recipes</div>
        <form className='recipes__form' onSubmit={(e) => { searchRecipe(e) }}>
          <input
            className='recipes__input'
            type="search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search recipes"
          />
          <button type="submit" className='recipes__button'></button>
        </form>

        <div className='recipes__categories'>
          {Object.keys(categories || {}).map(category => (
            <div onClick={(e) => filterCategoryRecipe(e, categories[category].name)}
              className={`recipes__category-${categoryActive === categories[category].name && 'active'} recipes__category`}
              key={Math.random()} >
              <div className='p recipes__category-name'>{categories[category].name}</div>
              <div className='recipes__category-image-container'>
                <div className='recipes__category-image'
                  style={{ backgroundImage: `url(${categories[category].imgUri})` }}></div>
              </div>
            </div>
          ))}
        </div>

        <div className='recipes__selects'>
          <CreatableSelect isClearable
            onChange={filterRecipe}
            styles={customStyles}
            placeholder="Cook Time"
            options={cookTimeOptions}
          />
          <CreatableSelect isClearable
            onChange={filterRecipe}
            styles={customStyles}
            placeholder="Complexity"
            options={complexityOptions}
          />
          <CreatableSelect isClearable
            onChange={filterRecipe}
            styles={customStyles}
            placeholder="Serves"
            options={servesOptions}
          />
          <CreatableSelect isClearable
            onChange={filterRecipe}
            styles={customStyles}
            placeholder="Cuisines"
            options={cuisinesOptions}
          />
        </div>

        <div className='recipes__recipes'>
          {searchError === "" ?
            Object.keys(Object.keys(searchResult).length === 0 ? recipes : searchResult || {}).map(item => (
              <div key={Math.random()} className='recipes__recipe'>
                <Link
                  to={{ pathname: `/recipes/${item}` }}>
                  <div className='recipes__recipe-image' style={{ backgroundImage: `url(${recipes[item].imgUri})` }}>
                    <div className='recipes__recipe--bottom'>
                      <div className='h3 recipes__recipe-title'>{recipes[item].name}</div>
                      <button
                        onClick={(e) => addToFavorites(e, item)}
                        className={`recipes__recipe-like-button recipes__recipe-like-button--${(!favoritesRecipe[item]) ? "white" : favoritesRecipe[item].name === recipes[item].name && "red"} p`}>SAVE IT</button>
                    </div>
                  </div>
                </Link>
              </div>
            ))
            : searchError
          }
        </div>

        <div className={`recipes__popup recipes__popup${popup}`}>
          <div className='recipes__popup-title h3'>
            You need to log in to add a recept to your favorites
          </div>
          <Link to="/login">
            <button className="button p recipes__popup-button">Log in</button>
          </Link>
          <img src={close} alt="close-icon" onClick={(e) => setPopup("")} />
        </div>
      </div>
      <Footer />
    </div>
  )
}
export default Recipes