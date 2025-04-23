import React, { Component } from 'react';
import Router from 'next/router';
import ReactPlayer from 'react-player';
import Link from 'next/link';
import styled from 'styled-components';
import { Container, Row, Col } from 'react-bootstrap';
import {
	Accordion,
	AccordionItem,
	AccordionItemHeading,
	AccordionItemButton,
	AccordionItemPanel,
} from 'react-accessible-accordion';
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

class FrequentlyAskedQuestions extends Component {
	componentDidMount() {
		window.scrollTo(0, 0);
	}
	render() {
		return (
			<Section pb={'30px'}>
				<Box
					// mb={"40px"}
					// mt={"40px"}
					pb={'30px'}
					pt={'40px'}
					pl={'10px'}
					pr={'10px'}
				>
					<>
						<Container>
							<Row>
								<Col xs="12" className="text-center">
									<Title variant="card" color="#000000" className="mb-4">
										FAQ's
									</Title>
								</Col>
								<Col xs="12">
									<Accordion preExpanded={[1]} allowMultipleExpanded={true}>
										<AccordionItem style={{ paddingBottom: '20px' }} uuid={1}>
											<AccordionItemHeading>
												<AccordionItemButton>
													<strong>1. What is OMG Face of the Year?</strong>
												</AccordionItemButton>
											</AccordionItemHeading>
											<AccordionItemPanel>
												OMG Face Of The Year is India's First Digital Talent
												Hunt.
												<br />
												<br />A platform where you can learn all about Glamour
												Industry while competing online in the most exciting
												ways.
											</AccordionItemPanel>
										</AccordionItem>

										<AccordionItem style={{ paddingBottom: '20px' }} uuid={2}>
											<AccordionItemHeading>
												<AccordionItemButton>
													<strong>
														2. How can I be A part of OMG? Are there any
														grooming charges later?
													</strong>
												</AccordionItemButton>
											</AccordionItemHeading>
											<AccordionItemPanel>
												Follow the registration process on the website(link in
												bio) and complete it by paying a nominal processing fee
												of Rs.499/-
												<br />
												<br />
												There are no grooming charges in the entire competition.
											</AccordionItemPanel>
										</AccordionItem>

										<AccordionItem style={{ paddingBottom: '20px' }} uuid={3}>
											<AccordionItemHeading>
												<AccordionItemButton>
													<strong>
														3. How Can OMG help in shaping my career?
													</strong>
												</AccordionItemButton>
											</AccordionItemHeading>
											<AccordionItemPanel>
												Apart from the winner incentives, you get to learn from
												the best mentors in the industry during webinars. The
												contest challenges also help you to groom yourself.
											</AccordionItemPanel>
										</AccordionItem>

										<AccordionItem style={{ paddingBottom: '20px' }} uuid={4}>
											<AccordionItemHeading>
												<AccordionItemButton>
													<strong>
														4. What are the eligibility criteria for the
														competition?
													</strong>
												</AccordionItemButton>
											</AccordionItemHeading>
											<AccordionItemPanel>
												To be eligible, you need to be:
												<br />
												- Indian Resident
												<br />
												- 18 yrs or above
												<br />- Unmarried
											</AccordionItemPanel>
										</AccordionItem>

										<AccordionItem style={{ paddingBottom: '20px' }} uuid={11}>
											<AccordionItemHeading>
												<AccordionItemButton>
													<strong>
														5. Can I take part in the competition from another
														state?
													</strong>
												</AccordionItemButton>
											</AccordionItemHeading>
											<AccordionItemPanel>
												Yes, this is an all-India Digital Hunt where people can
												participate online from any state.
												<br />
												<br />
												The top 10 males & females will be shortlisted from the
												knockout rounds and will be called to Mumbai for the
												Grand Finale.
											</AccordionItemPanel>
										</AccordionItem>

										<AccordionItem style={{ paddingBottom: '20px' }} uuid={10}>
											<AccordionItemHeading>
												<AccordionItemButton>
													<strong>
														6. What is the prize money & winner Incentives?
													</strong>
												</AccordionItemButton>
											</AccordionItemHeading>
											<AccordionItemPanel>
												Personal photo shoot by Dabboo Ratnani
												<br />
												Acting opportunity in Web Series/Movies
												<br />
												Wildcard entry in Mr. & Ms. Rubaru India
												<br />
												Live radio Interview on Radio City
												<br />
												Glam Onn Calender Shoot as a model
												<br />
												Feature on leading Magazine cover,
												<br />
												Social Media Influencer contract
												<br />
												<br />
												<br />
												The prize money for:
												<br />
												-Winners is Rs 51000,
												<br />
												-Runnerup is Rs 21000,
												<br />
												-Runnerup is Rs 11000.
											</AccordionItemPanel>
										</AccordionItem>

										<AccordionItem style={{ paddingBottom: '20px' }} uuid={6}>
											<AccordionItemHeading>
												<AccordionItemButton>
													<strong>7. What are the levels of OMG?</strong>
												</AccordionItemButton>
											</AccordionItemHeading>
											<AccordionItemPanel>
												1. Registration & Leaderboard
												<br />
												2. Pre-Contest Challenges
												<br />
												<br />
												3. Knock Out Rounds
												<br />
												3.1. Talent Extravaganza
												<br />
												3.2. Capture Con
												<br />
												3.3. Fit Hit
												<br />
												3.4. Walk & Sync
												<br />
												3.5. Personal Interview
												<br />
												3.6. Swipe The Crown (Finale)
											</AccordionItemPanel>
										</AccordionItem>

										<AccordionItem style={{ paddingBottom: '20px' }} uuid={5}>
											<AccordionItemHeading>
												<AccordionItemButton>
													<strong>
														8. How do I complete my profile after payment?
													</strong>
												</AccordionItemButton>
											</AccordionItemHeading>
											<AccordionItemPanel>
												Complete your profile by uploading 3 pictures, a bio,
												and some basic information. Once you successfully
												complete your profile and submit it, it will further go
												for the approval process.
											</AccordionItemPanel>
										</AccordionItem>

										<AccordionItem style={{ paddingBottom: '20px' }} uuid={7}>
											<AccordionItemHeading>
												<AccordionItemButton>
													<strong>
														9. What is a live leaderboard? How can I collect
														votes?
													</strong>
												</AccordionItemButton>
											</AccordionItemHeading>
											<AccordionItemPanel>
												Post profile approval you will appear on the live
												leaderboard.
												<br />
												<br />
												You can now share your profile on social media
												(WhatsApp/Facebook/Instagram) to collect votes.
												Depending upon your vote counts you will be ranked on
												the live leaderboard.
											</AccordionItemPanel>
										</AccordionItem>

										<AccordionItem style={{ paddingBottom: '20px' }} uuid={8}>
											<AccordionItemHeading>
												<AccordionItemButton>
													<strong>
														10. What is a Pre-Contest Challenge? Why are these
														important?
													</strong>
												</AccordionItemButton>
											</AccordionItemHeading>
											<AccordionItemPanel>
												To collect additional bonus votes, you must participate
												in Pre-contest challenges. These votes will help your
												profile to move up on the live leaderboard. Once the
												Pre-Contest Challenges are over, the leaderboard will
												stop and the top 500 males & females will proceed to
												knock out rounds.
											</AccordionItemPanel>
										</AccordionItem>

										<AccordionItem style={{ paddingBottom: '20px' }} uuid={9}>
											<AccordionItemHeading>
												<AccordionItemButton>
													<strong>
														11. What are the Knockout rounds of OMG?
													</strong>
												</AccordionItemButton>
											</AccordionItemHeading>
											<AccordionItemPanel>
												Talent Extravaganza
												<br />
												The top 250 males & females will move to the next round
												<br />
												<br />
												Capture Con
												<br />
												The top 100 males & females will move to the next round
												<br />
												<br />
												Fit Hit
												<br />
												The top 60 males & females will move to the next round
												<br />
												<br />
												Walk & Sync
												<br />
												The top 30 males & females will move to the next round
												<br />
												<br />
												Personal Interview
												<br />
												The top 10 males & females will move to the next round
												<br />
												<br />
												Swipe The Crown (Finale)
											</AccordionItemPanel>
										</AccordionItem>

										<AccordionItem style={{ paddingBottom: '20px' }} uuid={12}>
											<AccordionItemHeading>
												<AccordionItemButton>
													<strong>
														12. I'm a season 1 participant, can I be part of
														Season 3?
													</strong>
												</AccordionItemButton>
											</AccordionItemHeading>
											<AccordionItemPanel>
												Yes, until and unless, you didn’t make it to the grand
												finale of season 1.
											</AccordionItemPanel>
										</AccordionItem>
									</Accordion>
								</Col>
							</Row>
						</Container>
					</>
				</Box>
			</Section>
		);
	}
}

export default FrequentlyAskedQuestions;
