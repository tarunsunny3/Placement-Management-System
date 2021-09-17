import React from 'react'
import './FooterStyles.css';
const Footer = () => {
    return (
        <div className="footer-content">
            <footer>
                <div className="main-content">
                    <div className="left box">
                        <h2>About us</h2>
                        <div className="content">
                            <p>University of Hyderabad is one of the best universities in India. The Placement cell of the University team and the students have been working so hard and keeping up the reputation of the college.</p>
                            <div className="social">
                                <a href="#"><span className="fab fa-facebook"></span></a>
                                <a href="#"><span className="fab fa-twitter"></span></a>
                                <a href="#"><span className="fab fa-instagram"></span></a>
                                <a href="#"><span className="fab fa-youtube"></span></a>
                            </div>
                        </div>
                    </div>
                    <div className="center box">
                        <h2>Address</h2>
                        <div className="content">
                            <div className="place">
                                <span className="fas fa-map-marker-alt"></span>
                                <span className="text">Gachibowli, Hyderabad</span>
                            </div>
                            <div className="phone">
                                <span className="fas fa-phone-alt"></span>
                                <span className="text">+918886555591</span>
                            </div>
                            <div className="email">
                                <span className="fas fa-envelope"></span>
                                <span className="text">tarunsunny3@gmail.com</span>
                            </div>
                        </div>
                    </div>
                    <div className="right box">
                        <h2>Contact us</h2>
                        <form action="#">
                            <div className="email">
                                <div className="text">Email </div>
                                <input type="email" name="email" required/>
                            </div>
                            <div className="message">
                                <div className="text">Message </div>
                                <textarea name="message" cols="25" rows="3" required></textarea>
                            </div>
                            <div className="btn">
                                <button type="submit">Send</button>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="bottom">
                    <center>
                    <span className="credit">Created By <a href="#">Tarun</a> | </span>
                    <span className="far fa-copyright"></span><span> 2021 All rights reserved.</span>
                    </center>
                </div>
            </footer>

        </div>
    )
}

export default Footer
