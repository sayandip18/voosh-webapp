import LoginAftermathDashboard from "./pages/loginAftermath/Dashboard";
import LoginAftermathDashboardWithNoData from "./pages/loginAftermath/DashBoradWithNoData";
import OperationHealthDashboard from "./pages/operationHealth/Dashboard";
import ListingScoreDashBoard from "./pages/listingScore/Dashboard";
import AdsAndAnalytics from "./pages/adsAndAnalytics/AdsAndAnalytics";
import CustomerReviews from "./pages/customerReview/CustomerReview";
import AllReviews from "./pages/customerReview/AllReviews";
import TimeSeriesPages from "./pages/operationHealth/TimeSeriesPage";
import ListingScoreTimeSeriesPage from "./pages/listingScore/TimeSeriesPage";
import Login from "./pages/login/Login";
import { Route, Routes, useLocation } from "react-router-dom";
import RequiredAuth from "./routes/RequiredAuth";
import RedirectRoute from "./routes/RedirectRoute";
import React from "react";
import "./styles/styles.css";
import axios from "axios";
import { useSelector } from "react-redux";
import LayoutWrapper from "./components/LayoutWrapper";
import Error from "./components/Error";
import FinancialDashBoard from "./pages/revenue/FinancialDashBoard";
// ! For testing purpose A and B
import FinancialDashBoard_A from "./pages/revenue/FinancialDashBoard_A";
import FinancialDashBoard_B from "./pages/revenue/FinancialDashBoard_B";
import Settings from "./pages/Settings";
import Notification from "./pages/Notification";
import Signup from "./pages/Signup";
import Greeting from "./pages/Greeting";
import PreSignUp from "./pages/PreSignUp";

function App() {
  const { token } = useSelector((state) => state.auth);
  // const{res_name} = useSelector((state) => state.data.res_name);
  const location = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
    // ! Ignore login page and provie user log(current page)
    if (location.pathname !== "/") {
      (async function () {
        const { data: response } = await axios.post("/update/user-log", {
          token: token,
          location: location.pathname,
        });
        // console.log(response);
      })();
    }
  }, [location.pathname, token]);

  // ?Component that alerts if you click outside of it

  return (
    <div className="main-container">
      <Routes>
        <Route
          path="/"
          element={
            <RedirectRoute>
              <Login />
            </RedirectRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <RedirectRoute>
              <Signup />
            </RedirectRoute>
          }
        />
        <Route
          path="/greeting"
          element={
            <RedirectRoute>
              <Greeting />
            </RedirectRoute>
          }
        />
        <Route path="/settings" element={<Settings />} />
        <Route path="/notification" element={<Notification />} />
        <Route path="/pre-signup" element={<PreSignUp />} />
        <Route
          path="/dashboard"
          element={
            <RequiredAuth>
              <LayoutWrapper
                heading={"Voosh VGN"}
                isHomePage={true}
                headerSize={"big"}
              >
                <LoginAftermathDashboard />
              </LayoutWrapper>
            </RequiredAuth>
          }
        />
        <Route
          path="/dashboard-sample"
          element={<LoginAftermathDashboardWithNoData />}
        />
        <Route
          path="revenue"
          element={
            <RequiredAuth>
              <LayoutWrapper
                heading={"Revenue Dashboard"}
                isHomePage={false}
                isClientBtnNeeded={false}
                headerSize={"large"}
              >
                <FinancialDashBoard_A />
                {/* <FinancialDashBoard_B /> */}
                {/* <FinancialDashBoard /> */}
              </LayoutWrapper>
            </RequiredAuth>
          }
        />
        {/* // Todo Component ka name rename pending!*/}
        <Route
          path="/operationHealth"
          element={
            <RequiredAuth>
              <LayoutWrapper
                heading={"Operation Health"}
                isClientBtnNeeded={true}
              >
                <OperationHealthDashboard />
              </LayoutWrapper>
            </RequiredAuth>
          }
        />
        {/* //! no LayoutWrapper cuz dynamic routes will have diffrent heading */}
        <Route
          path="/operationHealth/:id"
          element={
            <RequiredAuth>
              <TimeSeriesPages />
            </RequiredAuth>
          }
        />

        <Route
          path="/listingScore"
          element={
            <RequiredAuth>
              <LayoutWrapper
                heading={"Listing Score"}
                isHomePage={false}
                isClientBtnNeeded={true}
              >
                <ListingScoreDashBoard />
              </LayoutWrapper>
            </RequiredAuth>
          }
        />

        <Route
          path="/listingScore/:id"
          element={
            <RequiredAuth>
              <ListingScoreTimeSeriesPage />
            </RequiredAuth>
          }
        />
        {/* <Route
          path="/ads&Analytics"
          element={
            <RequiredAuth>
              <LayoutWrapper heading={"Ads&Analytics"} isHomePage={false}>
                <AdsAndAnalytics />
              </LayoutWrapper>
            </RequiredAuth>
          }
        /> */}
        <Route
          path="/customerReviews"
          element={
            <RequiredAuth>
              <LayoutWrapper
                heading={"Customer Reviews"}
                isHomePage={false}
                isClientBtnNeeded={true}
              >
                <CustomerReviews />
              </LayoutWrapper>
            </RequiredAuth>
          }
        />
        <Route
          path="/allReviews"
          element={
            <RequiredAuth>
              <LayoutWrapper
                heading={"All Reviews"}
                isHomePage={false}
                isClientBtnNeeded={true}
              >
                <AllReviews />
              </LayoutWrapper>
            </RequiredAuth>
          }
        />
        <Route
          path="*"
          element={
            <>
              <Error />
            </>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
