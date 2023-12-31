/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
/* eslint-disable react/no-array-index-key */
/* eslint-disable max-len */
/* eslint-disable react/jsx-curly-brace-presence */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/mouse-events-have-key-events */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useState } from 'react';
import { Box } from '@mui/system';
import {
  useMediaQuery, Typography, CircularProgress, Button,
} from '@mui/material';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import StarRateIcon from '@mui/icons-material/StarRate';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import Cookies from 'js-cookie';
import Header from '../../Components/Header';
import { Categories } from '../../Components/Header/Categories';
import Footer from '../../Components/Footer';
import './index.css';
import { getProductUrl, cartUrl } from '../../Environment/URL';
import ProductRatingsAndReviews from '../../Components/ProductPageReviews';
import { useCartContext } from '../../Components/Context/CartContext';

export default function ProductPage() {
  const [data, setData] = useState({});
  const [hover, setHover] = useState('0');
  const [imgData, setImgData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cartItems, setCartState, changeQuantity, addToCart, removeProduct, setIsLoggedIn] = useCartContext();
  const isProductInCart = cartItems.filter((item) => item.productItemId === data?.productItemId).length > 0;
  const isMobile = useMediaQuery('(max-width:850px)');
  const [searchParams] = useSearchParams();
  const [variants, setVariants] = useState({});
  const id = searchParams.get('id');
  const navigate = useNavigate();
  const location = useLocation();
  const {
    specifications, sellers, productItemDescription, productItemId,
  } = data;
  const descriptions = productItemDescription?.split('_');
  const customerId = localStorage.getItem('customerId');
  const jwtToken = Cookies.get('jwtToken');
  const style = {
    border: '1px solid blue',
    boxShadow: '0px 0px 3px blue',
  };

  const handleChange = (e) => {
    setHover(e.target.id);
  };

  const getData = async () => {
    try {
      const options = {
        method: 'GET',
      };
      const response = await fetch(`${getProductUrl}${id}`, options);
      const responseJson = await response.json();
      const { productItemDetails, availableVariantOptions } = responseJson;
      setData({ ...productItemDetails });
      setImgData(productItemDetails.productItemImage.split(','));
      setVariants(availableVariantOptions);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getData();
  }, [id]);

  const addProductToCart = async () => {
    setLoading(true);
    if (jwtToken) {
      const { sellerId } = sellers[0];
      await addToCart(productItemId, sellerId);
    } else {
      navigate(`/account/login?value=true&redirectTo=${location.pathname}${location.search}`);
    }
    setLoading(false);
  };

  const handleBuyNow = async () => {
    if (jwtToken) {
      if (!isProductInCart) await addProductToCart();
      navigate(`/checkout?buynow=${data.productItemId}`);
    } else {
      navigate(`/account/login?value=true&redirectTo=${location.pathname}${location.search}`);
    }
  };

  const navigateVariant = async (e) => {
    const { ariaLabel, innerText } = e.target;
    try {
      const options = {
        method: 'GET',
      };

      const response = await fetch(
        `https://localhost:7258/api/Product/variant/${data.productId}?${ariaLabel}=${innerText}`,
        options,
      );
      const responseJson = await response.json();
      navigate(`/product?id=${responseJson.variants[0].productItemId}`);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Box sx={{ overflow: 'auto' }} height="100vh" bgcolor="#f1f3f6">
      <Header />
      <Categories />
      {Object.keys(data).length > 0 ? (
        <Box
          display={isMobile ? 'block' : 'grid'}
          gridTemplateColumns="45% 55%"
          margin={isMobile ? '1rem 1rem' : '.5rem'}
          bgcolor="#fff"
        >
          <Box
            position={isMobile ? 'static' : 'sticky'}
            top="60px"
            height={isMobile ? 'unset' : '90vh'}
          >
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              flexDirection={isMobile ? 'column-reverse' : 'row'}
            >
              <Box
                display="flex"
                flexDirection={isMobile ? 'row' : 'column'}
                alignItems="center"
                justifyContent="center"
                m={1}
                overflow={isMobile && 'auto'}
                width={isMobile ? '100%' : '20%'}
              >
                {imgData.length > 0
                                    && imgData.map((img, index) => {
                                      if (index < 6) {
                                        return (
                                          <div
                                            key={`${index * 2}`}
                                            className="img-item"
                                            style={
                                                        hover === `${index}`
                                                          ? style
                                                          : { border: '1px double black' }
                                                    }
                                          >
                                            <img
                                              src={img}
                                              id={index}
                                              alt="img"
                                              onMouseOver={handleChange}
                                              onClick={handleChange}
                                              className="product-img"
                                            />
                                          </div>
                                        );
                                      }
                                    })}
              </Box>
              <Box margin={2} width="100%" className="displaying-img-container">
                <img src={imgData[hover]} alt="img" className="displaying-img" />
              </Box>
            </Box>
            <Box className="buy-cart-buttons-container">
              {isProductInCart ? (
                <button
                  type="button"
                  className="cart-button"
                  onClick={() => navigate('/cart')}
                >
                  <ShoppingCartIcon fontSize="inherit" /> GO TO CART
                </button>
              ) : (
                <button
                  type="button"
                  className="cart-button"
                  onClick={addProductToCart}
                  disabled={loading}
                >
                  {loading ? (
                    <CircularProgress />
                  ) : (
                    <ShoppingCartIcon fontSize="inherit" />
                  )}
                  {loading ? 'Adding to Cart' : 'Add to cart'}
                </button>
              )}
              <button type="button" className="buy-button" onClick={handleBuyNow}>
                <FlashOnIcon fontSize="inherit" /> BUY NOW
              </button>
            </Box>
          </Box>
          <Box m={1} flexGrow={1}>
            <div className="mobile-details">
              <Typography variant="h5" className="mobile-title">
                {data.productItemName}
              </Typography>
              <div className="rating">
                <Typography variant="subtitle2" fontSize="inherit">
                  {data.rating}
                </Typography>
                <StarRateIcon color="inherit" fontSize="inherit" />
              </div>
              <div className="mobile-price-tag">
                <Typography
                  variant="h5"
                  component="h5"
                >{`₹ ${data.price}`}
                </Typography>
                <Typography>Delivery within 3 days of order</Typography>
                <Box display="flex" flexDirection="row" gap="4px">
                  <LocalOfferIcon color="success" fontSize="3" />
                  <Typography variant="body2">
                    Bank Offer ₹3000 Off On HDFC Bank Credit Non EMI, Credit and
                    Debit Card EMI Transactions T&C
                  </Typography>
                </Box>
                <Box display="flex" flexDirection="row" gap="4px">
                  <LocalOfferIcon color="success" fontSize="3" />
                  <Typography variant="body2">
                    Bank Offer ₹5000 Off On ICICI Bank Credit Non EMI, Credit
                    and Debit Card EMI Transactions T&C
                  </Typography>
                </Box>
              </div>
              <Box display="grid" fontSize="14px">
                <Box
                  marginTop={1}
                  display="grid"
                  gridTemplateColumns="30% 70%"
                  alignItems="center"
                >
                  <Box>
                    <Typography fontWeight="500" fontSize="inherit">
                      Color
                    </Typography>
                  </Box>
                  <Box>
                    <ul className="color-list">
                      {variants.Colour.map((color) => (
                        <li
                          className={
                                                        color === specifications.Colour
                                                          ? 'selected-specs'
                                                          : 'not-selected-specs'
                                                    }
                          aria-label="Colour"
                          onClick={navigateVariant}
                          key={color}
                        >
                          {color}
                        </li>
                      ))}
                    </ul>
                  </Box>
                </Box>
                <Box
                  marginTop={1}
                  display="grid"
                  gridTemplateColumns="30% 70%"
                  alignItems="center"
                >
                  <Box>
                    <Typography fontWeight="500" fontSize="inherit">
                      RAM
                    </Typography>
                  </Box>
                  <Box>
                    <ul className="color-list">
                      {variants.RAM.map((ram) => (
                        <li
                          className={
                                                        ram === specifications.RAM
                                                          ? 'selected-specs'
                                                          : 'not-selected-specs'
                                                    }
                          aria-label="RAM"
                          onClick={navigateVariant}
                          key={ram}
                        >
                          {ram}
                        </li>
                      ))}
                    </ul>
                  </Box>
                </Box>
                <Box
                  marginTop={1}
                  display="grid"
                  gridTemplateColumns="30% 70%"
                  alignItems="center"
                >
                  <Box>
                    <Typography fontWeight="500" fontSize="inherit">
                      Storage
                    </Typography>
                  </Box>
                  <Box>
                    <ul className="color-list">
                      {variants.Storage.map((storage) => (
                        <li
                          className={
                                                        storage === specifications.Storage
                                                          ? 'selected-specs'
                                                          : 'not-selected-specs'
                                                    }
                          aria-label="Storage"
                          onClick={navigateVariant}
                          key={storage}
                        >
                          {storage}
                        </li>
                      ))}
                    </ul>
                  </Box>
                </Box>
              </Box>
              <Box
                marginTop={1}
                display="grid"
                gridTemplateColumns="30% 70%"
                fontSize="14px"
              >
                <Box>
                  <Typography fontWeight="500" fontSize="inherit">
                    Highlights
                  </Typography>
                </Box>
                <Box>
                  <ul className="highlights-list">
                    <li>
                      {specifications.RAM} RAM | {specifications.Storage} ROM
                    </li>
                    <li>
                      {specifications.Screen_Size} {specifications.Resolution}{' '}
                      AMOLED Display
                    </li>
                    <li>
                      {specifications.Primary_Camera} (OIS) Primary Camera |{' '}
                      {specifications.Secondary_Camera} Front Camera
                    </li>
                    <li>{specifications.Battery} Lithium Polymer Battery</li>
                    <li>{specifications.Processor}</li>
                  </ul>
                </Box>
              </Box>
              <Box
                marginTop={1}
                marginBottom={1}
                display="grid"
                gridTemplateColumns="30% 70%"
                fontSize="14px"
              >
                <Box>
                  <Typography fontWeight="500" fontSize="inherit">
                    Available Sellers
                  </Typography>
                </Box>
                <Box>
                  <label htmlFor="seller">
                    <input type="radio" id="seller" defaultChecked />{' '}
                    {sellers[0].sellerName}
                  </label>
                </Box>
              </Box>
              <Box marginTop={1} display="grid" rowGap={2} fontSize="14px">
                {descriptions.map((e, index) => {
                  if (index % 2 === 0) {
                    return (
                      <Box
                        display="grid"
                        gridTemplateColumns="30% 60%"
                        key={e}
                      >
                        <Box>
                          <Typography fontWeight="500" fontSize="inherit">
                            {e}
                          </Typography>
                        </Box>
                        <Box color="GrayText">
                          {descriptions[index + 1]}
                        </Box>
                      </Box>
                    );
                  }
                })}
              </Box>
              <Box>
                <ProductRatingsAndReviews productId={data.productId} />
              </Box>
            </div>
          </Box>
        </Box>
      ) : (
        <Box height="50vh" textAlign="center" width="100vw">
          <CircularProgress />
        </Box>
      )}
      <Footer />
    </Box>
  );
}
