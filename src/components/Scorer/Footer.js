import React from 'react'
import { Link } from "react-router-dom";

function Footer() {
    return (
        <>
        <footer className="bg-light text-center border-top text-lg-start p-3">
            <div className="text-center rwt-txt-dark-blue ">
                &copy; 2024, Designed and Developed by - 
                <Link  to="/"
                    className="foot-link text-decoration-none fw-bold"> Vipul J </Link>
            </div>
        </footer> 
        </>
    )
}

export default Footer