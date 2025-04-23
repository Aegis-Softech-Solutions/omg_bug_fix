import React, { Component } from 'react';
import Router from 'next/router';
import ReactPlayer from 'react-player';
import Link from 'next/link';
import styled from 'styled-components';
import { Container, Row, Col } from 'react-bootstrap';
import { breakpoints } from '../../utils';
import {
	Title,
	Button,
	Section,
	Box,
	Text,
	Input,
	Select,
} from '../../components/Core';

import centerImg from '../../assets/image/about-us/center.jpg';
import topLeftImg from '../../assets/image/about-us/topLeft.jpg';
import topRightImg from '../../assets/image/about-us/topRight.jpg';
import bottomLeftImg from '../../assets/image/about-us/bottomLeft.jpg';
import bottomRightImg from '../../assets/image/about-us/bottomRight.jpg';

class AboutUs extends Component {
	componentDidMount() {
		window.scrollTo(0, 0);
	}

	render() {
		return (
			<Section pb={'0px'}>
				<Box
					// mb={"40px"}
					// mt={"40px"}
					pb={'0px'}
					pt={'40px'}
					pl={'10px'}
					pr={'10px'}
				>
					<>
						<Container>
							<Row className="text-center">
								<Col xs="12">
									<Title variant="card" color="#000000" className="mb-4">
										About Us
									</Title>
									<Text
										variant="small"
										color="#000000"
										style={{ textAlign: 'left' }}
									>
										OMG-Face Of The Year, a platform that brings together the who's
										who of the industry, a mentorship that sets all eyes on you and on
										the path of a game-changing career.
										<br />
										<br />
										This Contest is designed with such holistic rounds meant to test
										your personality and agility as a whole that takes you one step closer
										to be India's next popular face, gets your hands on a whopping cash prize
										of Rs.51,000 to winners, 21000 to 1st runner up, 11000 to 2nd runner up and
										also a wild card entry in one of India's national beauty pageant
										(Rubaru Mr India & Rubaru Miss India elite). A platform that lets you take
										the centre stage, and be the next trend-setter, it is designed with such
										compelling rounds one after the other that not only braces you to be one of
										the finest but helps you groom through this entire journey while you interact
										with the best in the business. All of this while you stay-at-home and with a
										bare minimum registration fee of Rs.499.
										<br />
										So, get your fashion game on point and talent hats on as we set on to this
										adventurous journey like never before where we unwind elegance with Mr. & Miss/Mrs.
										OMG face of the Year  with an exemplary panel of judges accompanied by interactions
										and learnings of a lifetime.
										<br />
										<br />
										This season, a new category has been introduced, where the top 10 hairstylists,
										selected digitally from across India, will also compete in Mumbai for the title of
										'Streax Hairstyle Icon.' Streax Professional aims to scout for talent and aptitude
										from across the country and change the way hairdressing industry awards are conducted
										in India.  The winners  will be clicked by ace photographer Dabboo Ratnani, along with
										other exciting cash prize of Rs. 3,00,000 to the winner, Rs 75,000 to the 1st runner up
										& Rs 25,000 to the second runner up.
									</Text>
								</Col>
							</Row>
							<Row>
								<Col xs="12" style={{ display: 'block', height: '70vh' }}>
									<img
										src={topLeftImg}
										style={{
											position: 'absolute',
											height: '30%',
											left: '10%',
											top: '15%',
										}}
										data-aos="fade-up-left"
										data-aos-duration="2000"
										data-aos-once="true"
										data-aos-delay="500"
									/>
									<img
										src={topRightImg}
										style={{
											position: 'absolute',
											height: '30%',
											right: '5%',
											top: '5%',
											boxShadow: '0 0 4px 1px #cecece',
										}}
										data-aos="fade-up-right"
										data-aos-duration="2000"
										data-aos-once="true"
										data-aos-delay="500"
									/>
									<img
										src={bottomLeftImg}
										style={{
											position: 'absolute',
											height: '30%',
											left: '1%',
											bottom: '20%',
										}}
										data-aos="fade-down-left"
										data-aos-duration="2000"
										data-aos-once="true"
										data-aos-delay="500"
									/>
									<img
										src={bottomRightImg}
										style={{
											position: 'absolute',
											height: '35%',
											right: '2%',
											bottom: '15%',
										}}
										data-aos="fade-down-right"
										data-aos-duration="2000"
										data-aos-once="true"
										data-aos-delay="500"
									/>
									<img
										src={centerImg}
										style={{
											position: 'absolute',
											height: '33%',
											left: '33%',
											top: '25%',
										}}
										data-aos="fade"
										data-aos-duration="1000"
										data-aos-once="true"
									/>
								</Col>
							</Row>
						</Container>
					</>
				</Box>
			</Section>
		);
	}
}

export default AboutUs;
