import React, { useContext } from 'react';
import styled from 'styled-components';
import { Container, Row, Col } from 'react-bootstrap';

import { Title, Button, Section, Box, Text } from '../../components/Core';
import { Carousel } from 'react-responsive-carousel';
import GlobalContext from '../../context/GlobalContext';

import homepageBanner1 from '../../assets/image/homepage/banners/homepage-banner-1.jpg';
import homepageBanner2 from '../../assets/image/homepage/banners/homepage-banner-2.jpg';
import homepageBanner3 from '../../assets/image/homepage/banners/homepage-banner-3.jpg';
import homepageBanner4 from '../../assets/image/homepage/banners/homepage-banner-4.jpg';
import homepageBannerRohit from '../../assets/image/homepage/banners/homepage-banner-rohit.jpg';
import homepageBannerDabboo from '../../assets/image/homepage/banners/homepage-banner-dabboo.jpg';
import homepageBanner2022 from '../../assets/image/homepage/banners/poster_website_compressed.jpeg';
import homepageBannernov182022 from '../../assets/image/homepage/banners/homepage-banner-18nov.jpg';
import homepageBannerapr25202 from '../../assets/image/homepage/banners/PC_CoverPage_Website.jpeg';
import homepageBannermay12 from '../../assets/image/homepage/banners/pre-contest-1-banner-winner.jpeg';
import homepageBannermay18 from '../../assets/image/homepage/banners/PreContest02_Website_18May.jpeg';
import homepageBannerJune12 from '../../assets/image/homepage/banners/PreContest_Website_2_winner-banner.jpg';
import homepageBannerJune14 from '../../assets/image/homepage/banners/PreContest_Website_3.jpeg';
import homepageBannerJune24 from '../../assets/image/homepage/banners/PreContest_Website_3Winners.jpeg';
import homepageBannerJuly11 from '../../assets/image/homepage/banners/talent-round-1.jpeg';
import homepageBannerJuly18 from '../../assets/image/homepage/banners/talent-round-2.jpg';
import homepageBannerJuly22 from '../../assets/image/homepage/banners/top100.jpeg';
import homepageBannerJuly26 from '../../assets/image/homepage/banners/top60.jpeg';
import winnersBanner from '../../assets/image/homepage/banners/winners-min.jpg';
import sponsorBanner from '../../assets/image/homepage/banners/banner-sponsor-v2.jpg';
import season3Banner from '../../assets/image/homepage/banners/banner-comp.jpeg';
import season3Banner2 from '../../assets/image/homepage/banners/homepage-banner-season3.jpg';

import newBanner1 from '../../assets/image/homepage/banners/homepage-new-banner-1.jpg';
import newBanner2 from '../../assets/image/homepage/banners/homepage-new-banner-2.jpg';
import newBanner3 from '../../assets/image/homepage/banners/homepage-new-banner-3.jpg';

const Hero = () => {
	const gContext = useContext(GlobalContext);

	return (
		<>
			{/* <!-- Hero Area --> */}
			<Section className="p-0">
				<Container className="p-0 banner-container">
					<Carousel
						showThumbs={false}
						showStatus={false}
						showArrows={true}
						showIndicators={true}
						infiniteLoop={true}
						swipeable={true}
						swipeScrollTolerance={5}
						interval={5000}
					>
						{/* <div>
              <div
                className="homepage-banner"
                style={{
                  backgroundImage: "url(" + homepageBannerDabboo + ")",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              />
              <Text
                fontSize="18px"
                as="h4"
                className="mb-4 homepage-banner-text"
                variant="custom-title"
                style={{
                  color: "#FFFFFF",
                  textAlign: "left",
                  // marginLeft: "20px",
                }}
              >
                DABBOO IS LOOKING FOR HIS NEXT FACE. ARE YOU THE ONE?
              </Text>
            </div>
            <div>
              <div
                className="homepage-banner"
                style={{
                  backgroundImage: "url(" + homepageBannerRohit + ")",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              />
              <Text
                fontSize="18px"
                as="h4"
                className="mb-4 homepage-banner-text"
                variant="custom-title"
                style={{
                  color: "#FFFFFF",
                  textAlign: "left",
                  // marginLeft: "20px",
                }}
              >
                ARE YOU READY TO BE THE NEXT SUPER MODEL LIKE ROHIT KHANDELWAL?
              </Text>
            </div> */}

						{/* <div>
              <a href="/my-profile">
                <div
                  className="homepage-banner"
                  style={{
                    backgroundImage: "url(" + homepageBannerJuly26 + ")",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                  }}
                />
              </a>
              <Text
                fontSize="18px"
                as="h4"
                className="mb-4 homepage-banner-text"
                variant="custom-title"
                style={{
                  color: "#FFFFFF",
                  textAlign: "left",
                }}
              >
              </Text>
            </div> */}

						<div>
							<div
								className="homepage-banner"
								style={{
									backgroundImage: 'url(' + newBanner1 + ')',
									backgroundSize: 'cover',
									backgroundPosition: 'center',
									backgroundRepeat: 'no-repeat',
								}}
							/>
						</div>
            <div>
							<div
								className="homepage-banner"
								style={{
									backgroundImage: 'url(' + newBanner2 + ')',
									backgroundSize: 'cover',
									backgroundPosition: 'center',
									backgroundRepeat: 'no-repeat',
								}}
							/>
						</div>
            <div>
							<div
								className="homepage-banner"
								style={{
									backgroundImage: 'url(' + newBanner3 + ')',
									backgroundSize: 'cover',
									backgroundPosition: 'center',
									backgroundRepeat: 'no-repeat',
								}}
							/>
						</div>
					</Carousel>
				</Container>
			</Section>
		</>
	);
};

export default Hero;
