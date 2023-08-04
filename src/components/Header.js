import React, { useEffect, useState } from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
    useNavigate
} from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db, logout, getUser } from "../firebase";
import logo from '../assets/img/logo.svg';
import menu from '../assets/img/menu.svg';

function Header() {
    const [user, loading, error] = useAuthState(auth);
    const [name, setName] = useState("");
    const [active, setActive] = useState(false);
    const navigate = useNavigate();

    const getUserName = async () => {
        try {
            const getName = await getUser(user);
            setName(getName);
        } catch (error) { console.log(error) }
    }

    useEffect(() => {
        if (loading) return;
        getUserName();
    }, [user, loading]);
    return (
        <div className="header">
            <div className="container header__desktop-container header__desktop">
                <div className="header__desktop-left">
                    <Link
                        to={{ pathname: `/home` }}><img className="header__desktop-logo" src={logo}></img>
                    </Link>
                    <Link
                        to={{ pathname: `/recipes` }}><div className="header__desktop-link h3">Recipes</div>
                    </Link>
                    {user ?
                        <Link
                            to={{ pathname: `/my-products` }}><div className="header__desktop-link h3">My products</div>
                        </Link>
                        : ""}
                    {user ?
                        <Link
                            to={{ pathname: `/favorites` }}><div className="header__desktop-link h3">Favorites</div>
                        </Link>
                        : ""}

                </div>
                {user ?
                    <div className="header__desktop-right p">
                        Hi,&nbsp;
                        <div>{name}</div>
                        <button className="button--green header__desktop-logout p" onClick={logout}>
                            Log out
                        </button>
                    </div> :
                    <div className="header__desktop-right p">
                        <Link to="/login">
                            <button className="button--green header__desktop-logout p">
                                Log in
                            </button>
                        </Link>
                    </div>
                }
            </div>

            <div className="container header__mobile-container header__mobile">
                <div className="header__mobile-main">
                    <div className="header__mobile-width"></div>
                    <Link
                        to={{ pathname: `/home` }}><img className="header__mobile-logo" src={logo}></img>
                    </Link>
                    <button className="header__mobile-menu" onClick={() => setActive(!active)}>
                        <img src={menu}></img>
                    </button>
                </div>
                <div className={`header__mobile-extended header__mobile-extended--${active}`}>
                    <Link
                        to={{ pathname: `/recipes` }}><div className="header__mobile-link h3">Recipes</div>
                    </Link>
                    {user ?
                        <Link
                            to={{ pathname: `/my-products` }}><div className="header__mobile-link h3">My products</div>
                        </Link>
                        : ""}
                    {user ?
                        <Link
                            to={{ pathname: `/favorites` }}><div className="header__mobile-link h3">Favorites</div>
                        </Link>
                        : ""}
                    {user ?
                        <div className="header__mobile-right p">
                            
                            <button className="button--green header__mobile-logout p" onClick={logout}>
                                Log out
                            </button>
                        </div> :
                        <div className="header__mobile-right p">
                            <Link to="/login">
                                <button className="button--green header__mobile-logout p">
                                    Log in
                                </button>
                            </Link>
                        </div>
                    }
                </div>
            </div>
        </div>
    );
}
export default Header;