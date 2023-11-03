/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { Box, Button, ButtonGroup, IconButton, Typography } from '@mui/material';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DoneIcon from '@mui/icons-material/Done';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import Address from '../../Components/Address';
import { cartUrl, orderUrl } from '../../Environment/URL';
import './index.css';
import { useCartContext } from '../../Components/Context/CartContext';

const jwtToken = Cookies.get('jwtToken');

export default function CheckOut() {
    const [cartItems] = useCartContext();
    const [checkoutData, setCheckoutData] = useState([]);
    const email = localStorage.getItem('customerEmail');
    const customerId = localStorage.getItem('customerId');
    const [selected, setSelected] = useState(2);
    const [deliveryAddress, setDeliveryAddress] = useState();
    const [searchParams] = useSearchParams();
    const buyNowId = searchParams.get('buynow');
    const navigate = useNavigate();

    useEffect(
        () => async () => {
            if (jwtToken) {
                if (buyNowId) {
                    setCheckoutData(cartItems.filter((data) => data.productItemId === buyNowId));
                } else setCheckoutData(cartItems);
            }
        },
        []
    );

    const checkOutOrders = async () => {
        const cartProductItemIds = [];
        checkoutData.forEach((data) => {
            cartProductItemIds.push(data.cartProductItemId);
        });
        const orderDetails = {
            customerId,
            shippingAddress: deliveryAddress,
            cartProductItemIds,
        };
        try {
            const options = {
                method: 'POST',
                body: JSON.stringify(orderDetails),
                headers: {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    Authorization: `Bearer ${jwtToken}`,
                },
            };

            const response = await fetch(orderUrl, options);
            console.log(response);
            if (response.status === 200) {
                console.log('checkout');
                navigate('/orderplaced');
            }
        } catch (err) {
            console.log(err);
        }
    };

    const sum = checkoutData?.reduce(
        (accumulator, currentValue) => accumulator + currentValue.price * currentValue.quantity,
        0
    );

    return (
        <div className="checkout-page">
            <Header />
            <div className="checkout-page-inner-container">
                <div className="contents-container">
                    <div className="checkout-page-sub-containers">
                        <div>
                            <span className="title-num">1</span>
                        </div>
                        <div>
                            <div className="checkout-titles">
                                {' '}
                                LOGIN{' '}
                                {email && (
                                    <DoneIcon
                                        color="success"
                                        fontSize="inherit"
                                        sx={{ fontWeight: '700', height: '20px' }}
                                    />
                                )}
                            </div>
                            <p className="email">{email}</p>
                        </div>
                    </div>
                    <div className="checkout-page-sub-containers">
                        <div>
                            <span className="title-num">2</span>
                        </div>
                        <div>
                            <div
                                className="checkout-titles"
                                style={{ color: selected === 2 && 'blue' }}
                            >
                                {' '}
                                DELIVERY ADDRESS{' '}
                                {selected === 3 && (
                                    <DoneIcon
                                        color="success"
                                        fontSize="inherit"
                                        sx={{ fontWeight: '700', height: '20px' }}
                                    />
                                )}
                            </div>
                            <div>
                                {selected === 2 && (
                                    <Address
                                        setDeliveryAddress={setDeliveryAddress}
                                        setSelected={setSelected}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="checkout-page-sub-containers">
                        <div>
                            <span className="title-num">3</span>
                        </div>
                        <div style={{ flexGrow: '1' }}>
                            <div
                                className="checkout-titles"
                                style={{ color: selected === 3 && 'blue' }}
                            >
                                {' '}
                                ORDER SUMMARY
                            </div>
                            {selected === 3 && (
                                <div>
                                    {checkoutData.length === 0 && (
                                        <Typography
                                            color="GrayText"
                                            fontSize={14}
                                            textAlign="center"
                                        >
                                            No products to checkout
                                        </Typography>
                                    )}
                                    {checkoutData?.map((data) => (
                                        <CheckOutItem
                                            data={data}
                                            key={data.cartProductItemId}
                                            setCheckoutData={setCheckoutData}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    {selected === 3 && (
                        <div className="checkout-page-sub-containers checkout-button">
                            <p>
                                Order will be placed with <b>{email}</b>
                            </p>
                            <b>Total Price : ₹ {sum}</b>
                            <button
                                type="button"
                                className="orange-button"
                                onClick={checkOutOrders}
                                disabled={checkoutData.length === 0}
                            >
                                CHECKOUT
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
}

function CheckOutItem(props) {
    const [cartItems, setCartState, changeQuantity, addToCart, removeProduct, setIsLoggedIn] =
        useCartContext();
    const { data, setCheckoutData } = props;
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const d = new Date();
    const day = weekdays[d.getDay() - 1];

    const changeCheckOutQuantity = (mode) => {
        setCheckoutData((prev) =>
            prev.map((element) => {
                if (element.productItemId === data.productItemId) {
                    const quantity = mode === 'increment' ? data.quantity + 1 : data.quantity - 1;
                    return { ...element, quantity };
                }
                return element;
            })
        );
    };

    const increaseQuantity = async () => {
        changeCheckOutQuantity('increment');
        await changeQuantity(data.cartProductItemId, data.quantity + 1);
    };
    const decreaseQuantity = async () => {
        changeCheckOutQuantity('decrement');
        await changeQuantity(data.cartProductItemId, data.quantity - 1);
    };

    const removeCheckOutProduct = () => {
        setCheckoutData((prev) =>
            prev.filter((element) => element.productItemId !== data.productItemId)
        );
    };

    return (
        <Box
            display="flex"
            flexDirection="column"
            border=".5px solid rgba(0,0,0,.2)"
            width="100%"
            margin=".5rem"
        >
            <Box display="flex" gap="4%">
                <Link to={`/product?id=${data.productItemId}`} style={{ padding: '8px' }}>
                    <img
                        className="item-img"
                        src={data.productItemImage.split(',')[0]}
                        alt="cartItem"
                        height={100}
                        width={80}
                    />
                </Link>
                <Box gap={1} display="flex" flexDirection="column">
                    <Typography variant="h6" fontWeight={400} fontSize={18}>
                        {data.productItemName}
                    </Typography>
                    <Typography variant="body1" fontSize={12}>
                        Delivery by next
                        {day}
                    </Typography>
                    <Typography variant="body1" fontSize={12} color="GrayText">
                        {data.sellerName}
                    </Typography>
                    <Typography fontWeight={400} fontSize={16}>
                        ₹{data.price}
                        <span className="offer"> %offers</span>
                    </Typography>
                </Box>
            </Box>
            <ButtonGroup sx={{ margin: '1rem 0' }}>
                <IconButton onClick={decreaseQuantity} disabled={data.quantity <= 1}>
                    <RemoveIcon className="icon-button" fontSize="2rem" />
                </IconButton>
                <span className="quantity">{data.quantity}</span>
                <IconButton onClick={increaseQuantity}>
                    <AddIcon className="icon-button" fontSize="2rem" />
                </IconButton>
                <Button
                    type="button"
                    variant="text"
                    color="inherit"
                    onClick={removeCheckOutProduct}
                >
                    Remove
                </Button>
            </ButtonGroup>
        </Box>
    );
}
