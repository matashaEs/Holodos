import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db, logout, getAllData, filter, favorites, getUserId, searchByProducts } from "../../firebase";
import { query, collection, getDocs, where } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import CreatableSelect from 'react-select/creatable';
import './../recipes/recipes.scss';
import star from '../../assets/img/star.svg';
import deleteIcon from '../../assets/img/delete.svg';
import person from '../../assets/img/person.svg';
import close from '../../assets/img/close.svg';
import hero from '../../assets/img/hero.png';
import shadow from '../../assets/img/shadow.png';
import Header from '../Header';
import Footer from '../Footer';

function Home() {
  const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState("");
  const [recipes, setRecipes] = useState({})
  const [products, setProducts] = useState({})
  const [productsSearch, setProductsSearch] = useState([])
  const [searchProductResult, setSearchProductResult] = useState({})
  const [productsHide, setProductsHide] = useState("")
  const [categories, setCategories] = useState({})
  const [searchValue, setSearchValue] = useState("")
  const [searchResult, setSearchResult] = useState({})
  const [searchError, setSearchError] = useState("")
  const [categoryActive, setCategoryActive] = useState("")
  const [popup, setPopup] = useState("")
  const [favoritesRecipe, setFavoritesRecipe] = useState({});
  const productsCol = {};
  const navigate = useNavigate();


  const fetchUserName = async () => {
    try {
      const q = query(collection(db, "users"), where("uId", "==", user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
      setName(data.name);
    } catch (err) {
      console.error(err);
      alert("An error occured while fetching user data");
    }
  };

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

  const searchProductsa = [
    { id: "LMDoZuducI00IUrFqwM7", "sort": 1 },
    { id: "LMDoZuducI00IUrFqwM7", "sort": 2 },
    { id: "LMDoZuducI00IUrFqwM7", "sort": 1 },
  ]

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

  const getDataProducts = async () => {
    try {
      const getDataProducts = await getAllData("products");
      setProducts(getDataProducts);

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

  const searchProduct = (e) => {
    e.preventDefault();
    setProductsHide("");
    navigate(`/home?q=${searchValue}`)
    const results = {};
    Object.keys(products || {})
      .filter(key => products[key].name.toLowerCase().includes(searchValue.toLowerCase()))
      .forEach((key) => {
        results[key] = products[key];
        setSearchProductResult(results);
      })
  }

  const addProduct = (e, product) => {
    e.preventDefault();
    setProductsHide("recipes__products--hide");
    productsCol[product] = products[product];
    setProductsSearch([...productsSearch, productsCol[product]]);
  }

  const deleteProduct = (e, product) => {
    e.preventDefault();
    setProductsSearch(productsSearch =>
      productsSearch.filter(pr => {
        return pr.name !== productsSearch[product].name;
      }),
    );
  }

  const searchByProduct = async () => {
    let numberOfMathces = [];
    let a = 0
    let max = Object.keys(recipes).length * Object.keys(productsSearch).length;
    try {
      Object.keys(recipes || {}).map(async item => {
        let i = 1;
        Object.keys(productsSearch || {}).map(async product => {
          const getDataProducts = await searchByProducts(productsSearch[product].name, item);
          if (Object.keys(getDataProducts).length != 0) {
            numberOfMathces.push({
              "id": item,
              "sort": i,
            })
            i++;
          }
          a++;
          if (a == max) {
            sortProduct(numberOfMathces);
          }
        });
      });
    } catch (error) { console.log(error) }
  }

  const sortProduct = async (numberOfMathces) => {
    let numDescending = [...numberOfMathces].sort((a, b) => b.sort - a.sort);
    const uniqueIds = [];
    console.log(numberOfMathces);
    try {
      setTimeout(() => {
        const uniqueEmployees = numDescending.filter(element => {
          const isDuplicate = uniqueIds.includes(element.id);
          if (!isDuplicate) {
            uniqueIds.push(element.id);
            return true;
          }
          return false;
        });
        sortProductData2(uniqueEmployees);
      }, 500)
    } catch (error) { console.log(error) }
  }

  const sortProductData2 = async (uniqueEmployees) => {
    let allData = {};
    uniqueEmployees.map(product => {
      allData[product.id] = recipes[product.id];
      setSearchResult(allData);
    });
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
    if (loading) return;
    if (user) {
      isFavorites();
    }
    getDataRecipes();
    getDataCategories();
    getDataProducts();
  }, [user, loading]);
  return (
    <div className="recipes container-fluid">
            {<Header />}
      <div className="recipes__container container">
        <div className="recipes__hero-container">
          <div className="recipes__hero" style={{ backgroundImage: `url(${hero})` }}></div>
          <div className="recipes__hero-content h3">Welcome to Holodos!<br />
            Holodos is made to help you in choosing which testy dish to cook. You can finde the most suitable meal by name,
            category and according to what you actually have in fridge.<br /><br />
            Bon Appetit!</div>
          <img className="recipes__hero-shadow" src={shadow}></img>
        </div>
        <div className='recipes__title recipes__title--home h1'>Holodos</div>
        <form className='recipes__form' onChange={(e) => { searchProduct(e) }}>
          <input
            className='recipes__input'
            type="search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search products"
          />
          <button type="submit" className='recipes__button'></button>
          <div className={`recipes__products ${productsHide}`}>
            {Object.keys(searchProductResult || {}).map(product => (
              <div className="recipes__product" key={Math.random()} onClick={(e) => { addProduct(e, product) }}>
                {searchProductResult[product].name}
              </div>
            ))}
          </div>
        </form>
        <div className="recipes__products-container">
          {
            Object.keys(productsSearch || {}).map(product => (
              <div className="recipes__products-container-item" key={Math.random()}>
                <img className="recipes__products-container-delete" src={deleteIcon} alt="delete" onClick={(e) => deleteProduct(e, product)}></img>
                <img className="recipes__products-image" key={Math.random()} src={productsSearch[product].imageUri} alt={`${productsSearch[product].name}`}></img>
                <div className="p">{productsSearch[product].name}</div>
              </div>
            ))}
          <div className="recipes__products-container-button-container">
            <button className="recipes__products-container-button" onClick={() => searchByProduct()}>
              Search
            </button>
          </div>
        </div>

        <div className='recipes__categories'>
          {Object.keys(categories || {}).map(category => (
            <div onClick={(e) => filterCategoryRecipe(e, categories[category].name)} className={`recipes__category-${categoryActive === categories[category].name && 'active'} recipes__category`} key={Math.random()} >
              <div className='p recipes__category-name'>{categories[category].name}</div>
              <div className='recipes__category-image-container'>
                <div className='recipes__category-image' style={{ backgroundImage: `url(${categories[category].imgUri})` }}></div>
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
      </div >

      <Footer />
    </div >
  );
}
export default Home;