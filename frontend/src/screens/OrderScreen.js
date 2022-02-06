import React, { useEffect, useState } from 'react';
import { PayPalButton } from 'react-paypal-button-v2';
import { Button, Card, Col, Image, ListGroup, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getOrderDetails, payOrder } from '../actions/orderActions';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { addDecimals, addPayPalScript, generateString } from '../utils/app-lib';
import { ORDER_PAY_RESET } from '../constants/orderConstants';

const OrderScreen = ({ match }) => {
  const orderId = match.params.id;
  const [sdkReady, setSdkReady] = useState(false);

  const dispatch = useDispatch();

  const orderDetails = useSelector(state => state.orderDetails);
  const { loading, order, error } = orderDetails;

  const orderPay = useSelector(state => state.orderPay);
  const { loading: loadingPay, success: successPay } = orderPay;

  const userLogin = useSelector(state => state.userLogin);
  const { userInfo } = userLogin;
  if (!loading) {
    order.itemsPrice = addDecimals(
      order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0)
    )
  }

  useEffect(() => {
    if (!order || order._id !== orderId || successPay) {
      // order가 생성되면서 reRednering되고 
      // successPay가 true가 되면서 다시 실행되기 때문에 orderPay가 reset되어야함
      dispatch({type: ORDER_PAY_RESET});
      dispatch(getOrderDetails(orderId));
    } else if (!order.isPaid) {
      if (!window.paypal) {
        addPayPalScript(setSdkReady);
      } else {
        setSdkReady(true);
      }
    }
  }, [order, orderId, dispatch, successPay]);

  const successPaymentHandler = (paymentResult) => {
    dispatch(payOrder(orderId, paymentResult));
  }

  const fakePaymentHandler = (paymentResult) => {
    dispatch(payOrder(orderId, paymentResult));
  }

  return (
    <>
      {
        loading
          ? <Loader />
          : error
            ? <Message variant="danger">{error}</Message>
            : <>
              <h1>Order {order._id}</h1>
              <Row>
                <Col md={8}>
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      <h2>Shipping</h2>
                      <p><strong>Name: </strong> {order.user.name}</p>
                      <p><strong>Email: </strong><a href={`mailto:${order.user.email}`}>{order.user.email}</a></p>
                      <p>
                        <strong>Address:</strong>
                        {order.shippingAddress.address}, {order.shippingAddress.city}{"  "}
                        {order.shippingAddress.postalCode},{"  "}{order.shippingAddress.country}
                      </p>
                      {
                        order.isDelivered
                          ? <Message variant="success">Delivered on {order.deliveredAt}</Message>
                          : <Message variant="danger">Not Delivered</Message>
                      }
                    </ListGroup.Item>

                    <ListGroup.Item>
                      <h2>Payment Method</h2>
                      <p>
                        <strong>Method: </strong>
                        {order.paymentMethod}
                      </p>
                      {
                        order.isPaid
                          ? <Message variant="success">Paid on {order.paidAt}</Message>
                          : <Message variant="danger">Not Paid</Message>
                      }
                    </ListGroup.Item>

                    <ListGroup.Item>
                      <h2>Order Items</h2>
                      {
                        order.orderItems.length === 0
                          ? <Message>Order is Empty</Message>
                          : (
                            <ListGroup variant="flush">
                              {order.orderItems.map((item, idx) =>
                                <ListGroup.Item key={idx}>
                                  <Row>
                                    <Col md={1}>
                                      <Image
                                        src={item.image}
                                        alt={item.name}
                                        fluid rounded
                                      />
                                    </Col>
                                    <Col>
                                      <Link to={`/product/${item.product}`}>
                                        {item.name}
                                      </Link>
                                    </Col>
                                    <Col md={4}>
                                      {item.qty} x {"$"}{item.price} = {"$"}{item.qty * item.price}
                                    </Col>
                                  </Row>
                                </ListGroup.Item>
                              )}
                            </ListGroup>
                          )
                      }
                    </ListGroup.Item>
                  </ListGroup>
                </Col>
                <Col md={4}>
                  <Card>
                    <ListGroup variant="flush">
                      <ListGroup.Item>
                        <h2>Order Summary</h2>
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <Row>
                          <Col>Items</Col>
                          <Col>{"$"}{order.itemsPrice}</Col>
                        </Row>
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <Row>
                          <Col>Shipping</Col>
                          <Col>{"$"}{order.shippingPrice}</Col>
                        </Row>
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <Row>
                          <Col>Tax</Col>
                          <Col>{"$"}{order.taxPrice}</Col>
                        </Row>
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <Row>
                          <Col>Total</Col>
                          <Col>{"$"}{order.totalPrice}</Col>
                        </Row>
                      </ListGroup.Item>
                      {!order.isPaid && (
                        <ListGroup.Item>
                          {loadingPay && <Loader />}
                          {!sdkReady ? <Loader /> : (
                            // <PayPalButton
                            //   amount={order.totalPrice}
                            //   onSuccess={successPaymentHandler}
                            // />
                            <Button onClick={e => {
                              fakePaymentHandler({
                                id: generateString(17),
                                status: "COMPLETED",
                                update_time: new Date(),
                                payer: { email_address: userInfo.email },
                              })
                            }}>
                              Fake PayPal Payment
                            </Button>
                          )}
                        </ListGroup.Item>
                      )}
                    </ListGroup>
                  </Card>
                </Col>
              </Row>
            </>
      }
    </>
  );
};

export default OrderScreen;
