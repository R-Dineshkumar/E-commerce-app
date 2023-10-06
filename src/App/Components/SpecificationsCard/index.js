/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react';
import './index.css';

function SpecificationsCard(props) {
  const { productItemDetails } = props;
  const { specifications } = productItemDetails;
  // console.log(productItemDetails);
  return (
    <ul className="specifications-list">
      {Object.keys(specifications).sort().map((item) => (
        <li className="specification" key={item}>
          {`${specifications[item]} ${item.split('_').join(' ')}`}
        </li>
      ))}
      <div className="specifications-button-container">
        <button type="button" className="specifications-button">Add to Cart</button>
        <button type="button" className="specifications-button">Buy Now</button>
      </div>
    </ul>
  );
}

export default SpecificationsCard;
