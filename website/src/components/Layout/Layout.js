import React, {
	useState,
	useEffect,
	useLayoutEffect,
	useContext,
	useRef,
} from 'react';

import Link from 'next/link';
import styled, { ThemeProvider } from 'styled-components';
import Head from 'next/head';
import AOS from 'aos';
import { ToastContainer } from 'react-nextjs-toast';

import Header from '../Header';
import Footer from '../Footer';

import ModalVideo from '../ModalVideo';

import GlobalContext from '../../context/GlobalContext';

import GlobalStyle from '../../utils/globalStyle';
import GlobalStyleHome from '../../utils/globalStyleHome';

import imgFavicon from '../../assets/favicon.png';

import { TinyButton as ScrollUpButton } from 'react-scroll-up-button';

import { get, merge } from 'lodash';
// the full theme object
import { theme as baseTheme } from '../../utils';

import imgL1LogoWhite from '../../assets/image/logo/white-logo-sm.png';

const Loader = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	background: #fff;
	z-index: 9999999999;
	opacity: 1;
	visibility: visible;
	transition: all 1s ease-out 1.5s;
	&.inActive {
		opacity: 0;
		visibility: hidden;
	}
`;

// options for different color modes
const modes = { light: 'light', dark: 'dark' };

// merge the color mode with the base theme
// to create a new theme object
const getTheme = (mode) =>
	merge({}, baseTheme, {
		colors: get(baseTheme.colors.modes, mode, baseTheme.colors),
	});

const Layout = ({ children, pageContext }) => {
	const gContext = useContext(GlobalContext);

	const [visibleLoader, setVisibleLoader] = useState(true);

	useLayoutEffect(() => {
		AOS.init({
			duration: '50',
		});
		setVisibleLoader(false);
	}, []);

	// Navbar style based on scroll
	const eleRef = useRef();

	useEffect(() => {
		window.addEventListener(
			'popstate',
			function (event) {
				// The popstate event is fired each time when the current history entry changes.
				// gContext.closeAbout();
				// gContext.closeContact();
				// gContext.closeOffcanvas();
			},
			false
		);
		window.addEventListener(
			'pushState',
			function (event) {
				// The pushstate event is fired each time when the current history entry changes.
				// gContext.closeAbout();
				// gContext.closeContact();
				// gContext.closeOffcanvas();
			},
			false
		);
	}, [gContext]);

	if (pageContext.layout === 'bare') {
		return (
			<ThemeProvider
				theme={
					gContext.themeDark ? getTheme(modes.dark) : getTheme(modes.light)
				}
				style={{ height: '100%' }}
			>
				<GlobalStyle />
				<Head>
					{/* <script src="https://checkout.razorpay.com/v1/checkout.js"></script> */}
					<script
						dangerouslySetInnerHTML={{
							__html: `
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
    n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
    document,'script','https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '582955268888858');
    fbq('track', 'PageView');
fbq('track', 'ViewContent');
  `,
						}}
					/>
					<noscript>
						<img
							height="1"
							width="1"
							style={{ display: 'none' }}
							src="https://www.facebook.com/tr?id=582955268888858&ev=PageView&noscript=1"
						/>
					</noscript>

					<script
						dangerouslySetInnerHTML={{
							__html: `
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
    n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
    document,'script','https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '570595444663020');
    fbq('track', 'PageView');
fbq('track', 'ViewContent');
  `,
						}}
					/>
					<noscript>
						<img
							height="1"
							width="1"
							style={{ display: 'none' }}
							src="https://www.facebook.com/tr?id=570595444663020&ev=PageView&noscript=1"
						/>
					</noscript>

					<title>OMG - Season 3 | Register Now</title>
					<link rel="icon" type="image/placeholder-png" href={imgFavicon} />
					<meta
						name="viewport"
						content="width=device-width, initial-scale=1 user-scalable=no"
					/>
				</Head>
				<ToastContainer align={'right'} />
				<Loader id="loading" className={visibleLoader ? '' : 'inActive'}>
					<div className="load-circle">
						<span className="one"></span>
					</div>
				</Loader>
				<div className="desktop-site">
					<div className="desktop-site-message">
						<img
							src={imgL1LogoWhite}
							alt=""
							className="header-logo-desktop white"
							style={{ marginBottom: '30px' }}
						/>
						<div>
							Hey, looks like you are accessing our website from either a
							desktop, laptop or in landscape mode. We recommend you to browse
							our website from your mobile device in portrait mode for the best
							experience.
						</div>
					</div>
				</div>
				<div className="site-wrapper overflow-hidden mobile-site" ref={eleRef}>
					{children}
				</div>

				<ModalVideo />
			</ThemeProvider>
		);
	}

	if (pageContext.layout === 'home') {
		return (
			<>
				<ThemeProvider
					theme={
						gContext.themeDark ? getTheme(modes.dark) : getTheme(modes.light)
					}
				>
					<GlobalStyleHome />
					<Head>
						{/* <script src="https://checkout.razorpay.com/v1/checkout.js"></script> */}
						<script
							dangerouslySetInnerHTML={{
								__html: `
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
    n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
    document,'script','https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '582955268888858');
    fbq('track', 'PageView');
fbq('track', 'ViewContent');
  `,
							}}
						/>
						<noscript>
							<img
								height="1"
								width="1"
								style={{ display: 'none' }}
								src="https://www.facebook.com/tr?id=582955268888858&ev=PageView&noscript=1"
							/>
						</noscript>

						<script
							dangerouslySetInnerHTML={{
								__html: `
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
    n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
    document,'script','https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '570595444663020');
    fbq('track', 'PageView');
fbq('track', 'ViewContent');
  `,
							}}
						/>
						<noscript>
							<img
								height="1"
								width="1"
								style={{ display: 'none' }}
								src="https://www.facebook.com/tr?id=570595444663020&ev=PageView&noscript=1"
							/>
						</noscript>
						<title>OMG - Season 3 | Register Now</title>
						<link rel="icon" type="image/placeholder-png" href={imgFavicon} />
						<meta
							name="viewport"
							content="width=device-width, initial-scale=1 user-scalable=no"
						/>
					</Head>
					<Loader id="loading" className={visibleLoader ? '' : 'inActive'}>
						<div className="load-circle">
							<span className="one" />
						</div>
					</Loader>
					<div className="desktop-site">
						<div className="desktop-site-message">
							<img
								src={imgL1LogoWhite}
								alt=""
								className="header-logo-desktop white"
								style={{ marginBottom: '30px' }}
							/>
							<div>
								Hey, looks like you are accessing our website from either a
								desktop, laptop or in landscape mode. We recommend you to browse
								our website from your mobile device in portrait mode for the
								best experience.
							</div>
						</div>
					</div>
					<div
						className="site-wrapper overflow-hidden mobile-site"
						ref={eleRef}
					>
						<ToastContainer align={'right'} />
						<Header
							isDark={gContext.headerDark}
							isHomepage={gContext.homepageFlag}
						/>

						{children}

						<ScrollUpButton ContainerClassName="ScrollUpButton__Container" />

						<Footer
							isDark={gContext.footerDark}
							isHomepage={gContext.homepageFlag}
						/>
					</div>

					<ModalVideo />
				</ThemeProvider>
			</>
		);
	}

	return (
		<>
			<ThemeProvider
				theme={
					gContext.themeDark ? getTheme(modes.dark) : getTheme(modes.light)
				}
			>
				<GlobalStyle />
				<Head>
					{/* <script src="https://checkout.razorpay.com/v1/checkout.js"></script> */}
					<script
						dangerouslySetInnerHTML={{
							__html: `
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
    n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
    document,'script','https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '582955268888858');
    fbq('track', 'PageView');
fbq('track', 'ViewContent');
  `,
						}}
					/>
					<noscript>
						<img
							height="1"
							width="1"
							style={{ display: 'none' }}
							src="https://www.facebook.com/tr?id=582955268888858&ev=PageView&noscript=1"
						/>
					</noscript>
					<title>OMG - Season 3 | Register Now</title>
					<link rel="icon" type="image/placeholder-png" href={imgFavicon} />
					<meta
						name="viewport"
						content="width=device-width, initial-scale=1 user-scalable=no"
					/>
				</Head>
				<Loader id="loading" className={visibleLoader ? '' : 'inActive'}>
					<div className="load-circle">
						<span className="one" />
					</div>
				</Loader>
				<div className="desktop-site">
					<div className="desktop-site-message">
						<img
							src={imgL1LogoWhite}
							alt=""
							className="header-logo-desktop white"
							style={{ marginBottom: '30px' }}
						/>
						<div>
							Hey, looks like you are accessing our website from either a
							desktop, laptop or in landscape mode. We recommend you to browse
							our website from your mobile device in portrait mode for the best
							experience.
						</div>
					</div>
				</div>
				<div className="site-wrapper overflow-hidden mobile-site" ref={eleRef}>
					<ToastContainer align={'right'} />
					<Header
						isDark={gContext.headerDark}
						isHomepage={gContext.homepageFlag}
					/>

					{children}

					<ScrollUpButton ContainerClassName="ScrollUpButton__Container" />
					<Footer
						isDark={gContext.footerDark}
						isHomepage={gContext.homepageFlag}
					/>
				</div>

				<ModalVideo />
			</ThemeProvider>
		</>
	);
};

export default Layout;
