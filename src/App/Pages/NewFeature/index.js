/* eslint-disable react/prop-types */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import orderplaced from '../../Images/orderplace.webp';
import './index.css';

function NewFeature({ heading }) {
  const navigate = useNavigate();
  const comingSoonUrl = 'https://cdn.dribbble.com/users/88000/screenshots/2487367/shot.png';

  const GoBack = () => {
    navigate(-1);
  };
  const GoToHome = () => {
    navigate('/');
  };

  return (
    <div className="new-feature-container">
      {heading && <h2>{heading}</h2>}
      <img src={comingSoonUrl} alt="coming soon" className="coming-soon-image" />
      <button type="button" className="go-back-button" onClick={GoBack}>Go Back</button>
      <button type="button" className="go-back-button" onClick={GoToHome}>Continue Shopping</button>
    </div>
  );
}
export function OrderPlaced() {
  const navigate = useNavigate();

  const ToHome = () => {
    navigate('/');
  };

  const ToOrder = () => {
    navigate('/profile?value=orders');
  };

  return (
    <div className="new-feature-container">
      <img src={orderplaced} alt="coming soon" className="order-placed-image" />
      <div className="order-placed-button-container">
        <button type="button" className="orange-button" onClick={ToHome}>Go To Home</button>
        <button type="button" className="orange-button" onClick={ToOrder}>Go To Order Page</button>
      </div>
    </div>
  );
}

export default NewFeature;
