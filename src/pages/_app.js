import { useState, useEffect } from "react";
import "styles/globals.css";
import Layout from 'components/Layout/Layout';
import LoadingPanel from "components/Loader/Loader";
import Router from "next/router";
import { useRouter } from "next/router";
import axios from "axios";
import Login from "components/Login/Login";

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState();

  useEffect(() => {
    const start = () => {
      console.log("start");
      setLoading(true);
    };

    const end = () => {
      console.log("ended");
      setLoading(false);
    };

    Router.events.on("routeChangeStart", start);
    Router.events.on("routeChangeComplete", end);
    Router.events.on("routeChangeError", end);

    return () => {
      Router.events.off("routeChangeStart", start);
      Router.events.off("routeChangeComplete", end);
      Router.events.off("routeChangeError", end);
    };
  }, []);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    setUser(userData)
  }, [])

  if (router.pathname == "/login") {
    return (
      <Component {...pageProps} />
    );
  }

  return (
    <Layout>
      {loading && (<LoadingPanel />)}
      <Component {...pageProps} />
    </Layout>
  )
}

export default MyApp


