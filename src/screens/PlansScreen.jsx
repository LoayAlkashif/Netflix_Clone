import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../features/userSlice';
import db from '../firebase';
import { loadStripe } from '@stripe/stripe-js';
import './PlansScreen.css';

function PlansScreen() {
  const [products, setProducts] = useState([]);
  const user = useSelector(selectUser);
  const [subscription, setSubscription] = useState(null);


  useEffect(() => {
    db.collection('customers')
    .doc(user.uid)
    .collection('subscriptions')
    .get()
    .then(querySnapshot => {
        querySnapshot.forEach(async subscription => {
            setSubscription({
                role: subscription.data().role,
                current_period_end: subscription.data().current_period_end.seconds,


            });
        });
    });
  }, [user.uid]);


  useEffect(() => {
    db.collection('products')
      .where('active', '==', true)
      .get()
      .then((querySnapshot) => {
        const products = {};
        querySnapshot.forEach(async (productDoc) => {
          products[productDoc.id] = productDoc.data();
          const priceSnap = await productDoc.ref.collection('prices').get();
          priceSnap.docs.forEach((doc) => {
            products[productDoc.id].prices = {
              priceId: doc.id,
              priceData: doc.data(),
            };
          });
        });
        setProducts(products);
      });
  }, []);

  console.log(products);
  console.log(subscription)

  const loadCheckout = async (priceId) => {
    const docRef = await db
      .collection('customers')
      .doc(user.uid)
      .collection('checkout_sessions')
      .add({
        success_url: window.location.origin,
        cancel_url: window.location.origin,
        line_items: [{ price: priceId, quantity: 1 }],
        payment_method_types: ['card'],
        mode: 'subscription',
        allow_promotion_codes: true,
      });

    docRef.onSnapshot(async (snap) => {
      const { error, sessionId } = snap.data();

      if (error) {
        //show an error to your customer and 
        //inspect your cloud function logs in the firebase console 
        alert(`An error occurred: ${error.message}`);
      }

      if (sessionId) {
        const stripe = await loadStripe(
          'pk_test_51MtAfHDIrL20RUCe9TDbmMjIxBS7hTypC2m2dPrnFzwWFrNX73mGBXNrUMAjvNTq2bC3yYUZ8kjBfERz54ZpkUGj00f6NtHfbX'
        );
        stripe.redirectToCheckout({ sessionId });
      }
    });
  };

  return (
    <div className="planScreen">
        <br />
        { subscription&& <p>Renewal date: {new Date(
            subscription?.current_period_end * 1000).toLocaleDateString()}</p>}

      {Object.entries(products).map(([productId, productData]) => {
        
        const isCurrentpackage = productData.name
        ?.toLowerCase()
        .includes(subscription?.role);

        return (
          <div key={productId} 
          className={`${ 
            isCurrentpackage && "plansScreen__plan--disabled"} plansScreen__plan`} >
            <div className="plansScreen__info">
              <h5>{productData.name}</h5>
              <h6>{productData.description}</h6>
            </div>

            <button
              onClick={() => {
               !isCurrentpackage && loadCheckout(productData.prices.priceId);
              }}
            >
              {isCurrentpackage ? "Current Package" : "Subscribe"}
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default PlansScreen;
