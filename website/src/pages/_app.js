// import App from 'next/app'
import Layout from "../components/Layout";
import { GlobalProvider } from "../context/GlobalContext";

import { ApolloProvider } from "react-apollo";
import { ApolloProvider as ApolloHooksProvider } from "@apollo/react-hooks";
import withData from "../utils/apollo-client";

import "../assets/fonts/fontawesome-5/webfonts/fa-brands-400.ttf";
import "../assets/fonts/fontawesome-5/webfonts/fa-regular-400.ttf";
import "../assets/fonts/fontawesome-5/webfonts/fa-solid-900.ttf";
import "../assets/fonts/typography-font/Circular-Std-Book.ttf";
import "../assets/fonts/typography-font/CircularStd-Black.ttf";
import "../assets/fonts/typography-font/CircularStd-BlackItalic.ttf";
import "../assets/fonts/typography-font/CircularStd-Bold.ttf";
import "../assets/fonts/typography-font/CircularStd-BoldItalic.ttf";
import "../assets/fonts/typography-font/CircularStd-Book.ttf";
import "../assets/fonts/typography-font/CircularStd-BookItalic.ttf";
import "../assets/fonts/typography-font/CircularStd-Medium.ttf";
import "../assets/fonts/typography-font/CircularStd-MediumItalic.ttf";

import "../assets/fonts/icon-font/fonts/avasta.ttf";
import "../assets/fonts/icon-font/css/style.css";

import "../components/Layout/bootstrap-custom.scss";
import "../../node_modules/slick-carousel/slick/slick.css";
import "../../node_modules/slick-carousel/slick/slick-theme.css";
import "../../node_modules/aos/dist/aos.css";
import "../../node_modules/video-react/dist/video-react.css";

import "../assets/fonts/icon-font/css/style.css";
import "../assets/fonts/typography-font/typo.css";
import "../assets/fonts/fontawesome-5/css/all.css";

import "react-responsive-carousel/lib/styles/carousel.min.css";
import "react-multi-carousel/lib/styles.css";
import "react-accessible-accordion/dist/fancy-example.css";
import "react-image-crop/dist/ReactCrop.css";
import "react-datepicker/dist/react-datepicker.css";

const MyApp = ({ Component, pageProps, router, apollo }) => {
  if (
    router.pathname.match(/sign|reset|fashion-hunt|coming/) ||
    router.pathname === "/"
  ) {
    return (
      <ApolloProvider client={apollo}>
        <ApolloHooksProvider client={apollo}>
          <GlobalProvider>
            <Layout pageContext={{ layout: "bare" }} style={{ height: "100%" }}>
              <Component {...pageProps} />
            </Layout>
          </GlobalProvider>
        </ApolloHooksProvider>
      </ApolloProvider>
    );
  }
  if (router.pathname.match(/home|login|registration/)) {
    return (
      <ApolloProvider client={apollo}>
        <ApolloHooksProvider client={apollo}>
          <GlobalProvider>
            <Layout pageContext={{ layout: "home" }}>
              <Component {...pageProps} />
            </Layout>
          </GlobalProvider>
        </ApolloHooksProvider>
      </ApolloProvider>
    );
  }

  return (
    <ApolloProvider client={apollo}>
      <ApolloHooksProvider client={apollo}>
        <GlobalProvider>
          <Layout pageContext={{}}>
            <Component {...pageProps} />
          </Layout>
        </GlobalProvider>
      </ApolloHooksProvider>
    </ApolloProvider>
  );
};

export default withData(MyApp);
