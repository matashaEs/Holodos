import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";

function Footer() {
    const [user, loading, error] = useAuthState(auth);

    useEffect(() => {
        if (loading) return;
    }, [user, loading]);
    return (
        <div className="footer">
            <div className="footer__text">Holodos ®</div>
        </div>
    );
}
export default Footer;