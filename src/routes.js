import { createBrowserRouter } from "react-router-dom";
import Shop from "./Shop";
import ShopApplicationWrapper from "./pages/ShopApplicationWrapper";
import ProductListPage from "./pages/ProductListPage/ProductListPage";
import ProductDetails from "./pages/ProductDetailPage/ProductDetails";
import { loadProductBySlug } from "./routes/products";
import AuthenticationWrapper from "./pages/AuthenticationWrapper";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import OAuth2LoginCallback from "./pages/OAuth2LoginCallback";
import Cart from "./pages/Cart/Cart";
import Account from "./pages/Account/Account";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import Checkout from "./pages/Checkout/Checkout";
import ConfirmPayment from "./pages/ConfirmPayment/ConfirmPayment";
import OrderConfirmed from "./pages/OrderConfirmed/OrderConfirmed";
import Profile from "./pages/Account/Profile";
import Orders from "./pages/Account/Orders";
import Settings from "./pages/Account/Settings";
import { AdminPanel } from "./pages/AdminPanel/AdminPanel";
import NewArrivals from "./pages/ProductListPage/newarrivals";
import AboutUs from "./pages/Aboutus/AboutUs";
import ContactUs from "./pages/Contactus/Contactus";


export const router = createBrowserRouter([
    {
      path: "/",
      element: <ShopApplicationWrapper />,
      children:[
        {
            path:"/",
            element:<Shop />
        },
        {
          path:"/shopnow",
          element:<ProductListPage />
        },
        {
          path:"/about-us",
          element:<AboutUs />
        },
        {
          path:"/newarrivals",
          element:<NewArrivals />
        },
        {
          path:"/product",
          element: <ProductDetails />
        },
        {
          path:'/contact-us',
          element: <ContactUs />
        },
        {
         path:'/cart-items',
         element: <Cart />
        },
        {
          path:'/account-details/',
          element: <ProtectedRoute><Account /></ProtectedRoute>,
          children:[
            {
              path:'profile',
              element:<ProtectedRoute><Profile/></ProtectedRoute>
            },
            {
              path:'orders',
              element:<ProtectedRoute><Orders/></ProtectedRoute>
            },
            {
              path:'settings',
              element:<ProtectedRoute><Settings /></ProtectedRoute>
            }
          ]
         },
         {
          path:'/place-order',
          element:<ProtectedRoute><Checkout /></ProtectedRoute>
         },
         {
          path:'/orderConfirmed',
          element: <OrderConfirmed />
         }
      ]
    },
    {
      path:"/v1/",
      element:<AuthenticationWrapper />,
      children:[
        {
          path:"login",
          element:<Login />
        },
        {
          path:"register",
          element:<Register />
        }
      ]
    },
    {
      path:'/oauth2/callback',
      element:<OAuth2LoginCallback />
    },
    {
      path:'/confirmPayment',
      element:<ConfirmPayment />
    },
    {
      path:'/admin/*',
      element:<ProtectedRoute><AdminPanel /></ProtectedRoute>
    }
  ]);
