import React from 'react'
import bgImage from './images/bgImage.jpg';
import './HomePage.css';
const HomePage = () => {
  // style={{position: "relative", width: "98vw", opacity: "0.2","zIndex": "-1", backgroundColor: "rgba(0,0,0,.5)",  height: "100vh", backgroundImage: `url(${bgImage})`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}
  return (
    <div>
  <div className="bg">

    <div style={{backgroundColor: "#FDD2BF", display: "flex", direction: "column", justifyContent: "center", alignItems: "center"}}>
      <h1 style={{textAlign: "center", fontSize: "40px", color: "#3C5186", paddingTop: "5%", paddingBottom: "5%"}}>
        Welcome to Placement Management System
      </h1>
      
    </div>
    <img src={bgImage} style={{width: "100%", height: "100vh", objectFit: "cover"}} alt="background"/>
    </div>
    <footer id="footer" className="footer">
        <div className="footer-content">
            <div className="footer-section about">
                <h1>Contact Me</h1>
                <div className="contact">
                    <span><i className="fas fa-phone">&nbsp; +918886555591</i></span>
                    <span><i className="fas fa-envelope">&nbsp; tarunsunny3@gmail.com</i></span>
                </div>
                <div className="social-media">
                    <a href="https://www.facebook.com/tarunsunny111"><i className="fab fa-facebook"></i></a>
                    <a href="https://www.instagram.com/tarunsunny115/">&nbsp;<i className="fab fa-instagram"></i></a>
                    <a href="https://github.com/tarunsunny3/">&nbsp;<i className="fab fa-github"></i></a>
                </div>
            </div>
            <div className="footer-bottom">&copy;Tarun apps.com</div>
        </div>

      </footer>
    </div>
  )
}

export default HomePage
