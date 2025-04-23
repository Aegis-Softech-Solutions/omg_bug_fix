import React, { Component } from "react";
import Router from "next/router";
import ReactPlayer from "react-player";
import Link from "next/link";
import styled from "styled-components";
import { Container, Row, Col } from "react-bootstrap";
import { breakpoints } from "../../utils";
import {
  Title,
  Button,
  Section,
  Box,
  Text,
  Input,
  Select,
} from "../../components/Core";

class TermsAndConditions extends Component {
  componentDidMount() {
    window.scrollTo(0, 0);
  }
  render() {
    return (
      <Section pb={"30px"} pt={"20px"}>
        <Container>
          <Row className="text-center">
            <Col xs="12">
              <Text
                variant="small"
                color="#000000"
                style={{ textAlign: "justify" }}
              >
                The following terms and conditions ("T&Cs"/ "Terms and
                Conditions") shall apply to the contest owned, conceptualized,
                and developed by Blanckanvas Media Private Limited for its
                virtual pageant contest “Mr. & Miss. OMG - Face Of The Year”
                (hereinafter referred to as “Contest”), to be conducted on its
                Twitter and Facebook pages and other social media sites as may
                be decided and communicated by
                <strong> BLANCKANVAS MEDIA PVT. LTD.</strong> from time to time.
                <br />
                <br />
                The Participant has read and understood all the terms and
                conditions of the contest and has voluntarily out of his/her own
                free will, consented and accepted the terms and conditions,
                thereby providing his/her explicit consent to abide by the same
                by clicking on the box, “I Accept” and further having accepted
                the terms herein demonstrated his/her conscious decision to
                participate in the contest by making payment to participate in
                the contest and shall now be unconditionally bound by the terms
                and conditions hereof.
                <br />
                <br />
                <strong>
                  Following are the terms that shall apply to the Contest:
                </strong>
                <br />
                <br />
                1. The Contest is open only to Indian citizens, residing in
                India. Citizens and/or residents of countries other than India
                are not eligible to participate. Citizens and/or residents of
                countries other than India residing in India are not eligible to
                participate.
                <br />
                <br />
                2. The Participants must be adult male or female having attained
                the age of eighteen (18) years to participate in the Contest as
                on the date of the Contest. (All persons fulfilling conditions
                mentioned in clauses 1 & 2 shall be hereinafter referred to as
                “Participant/s”. By participating in the Contest, you
                (“Participant”) signify your assent to these Terms and
                Conditions stated below).
                <br />
                <br />
                3. Contest shall be open for participation as per the timelines
                specified by BLANCKANVAS MEDIA PVT. LTD.
                <br />
                <br />
                4. Employees, agents, and promoters (including their immediate
                family members) of BLANCKANVAS MEDIA PVT. LTD. and any of their
                divisions, affiliates and subsidiaries, and others associated
                with the Contest in any manner are not eligible to participate
                in the Contest.
                <br />
                <br />
                5. The Participants shall be required to provide basic personal
                information about them including but not limited to
                Participant's name, address, telephone number, or mobile number
                and email address to register and participate in the Contest.
                The information provided by the Participants may be used by
                BLANCKANVAS MEDIA PVT. LTD. for internal purposes and to send in
                the future to the Participant's promotional information about
                the BLANCKANVAS MEDIA PVT. LTD. network. Providing information
                to us is your choice. The Participant by providing the aforesaid
                sensitive personal information hereby agrees that BLANCKANVAS
                MEDIA PVT. LTD. shall have the right to share the information so
                collected with such other third party as BLANCKANVAS MEDIA PVT.
                LTD. is required for the Contest and the Participants hereby
                consents to share of sensitive personal information to such
                other third parties and shall not hold BLANCKANVAS MEDIA PVT.
                LTD. responsible or liable for the same. By participating in the
                Contest Participant hereby consents to receive information about
                various marketing promotional activities/events of BLANCKANVAS
                MEDIA PVT. LTD. including but not limited to receiving
                information/being contacted by the research team of BLANCKANVAS
                MEDIA PVT. LTD. However, by participating in the contest,
                Participant consent and further authorize BLANCKANVAS MEDIA PVT.
                LTD. to use his/her sensitive personal information for the
                contest.
                <br />
                <br />
                6. The specific details of the Contest including the criteria
                for selection, milestones to be achieved by the Winner, manner,
                day, and the basis of choosing the winner ("Winners") of the
                Contest are detailed hereinbelow.
                <br />
                <br />
                7. For the Contest, each Participant must submit their complete
                Entry/Entries (as defined here below) to qualify as a
                Participant in the Contest as specified at end of these T&C.
                <br />
                <br />
                8. The announcement about the Winners, Prize, distribution time,
                and mode of distribution of the Prize shall be at the sole
                discretion of BLANCKANVAS MEDIA PVT. LTD. and subject to the
                decision of the jury which shall be final and binding upon the
                Participant.
                <br />
                <br />
                9. Participants should ensure the accuracy of the information
                provided by them at the time of entering the Contest.
                <br />
                <br />
                10. BLANCKANVAS MEDIA PVT. LTD. may require Winners to provide
                valid photo identity documents including but not limited to
                Aadhar Card, passport, and ration card before handing over the
                Prize.
                <br />
                <br />
                11. The Prize, when the same are in form of some tangible goods
                or materials or vouchers, shall be sent by post and/or courier
                to the Winners as per the address specified by them at the time
                of registering for the Contest. BLANCKANVAS MEDIA PVT. LTD.
                shall not be responsible if the Prize is damaged in the course
                of delivery through the post and/or courier.
                <br />
                <br />
                12. Participant shall not post any profanity or abusive comments
                on the social media page or in any electronic or print mediums.
                In the event of any such profanity or abusive comments is/are
                posted on any medium, such Participant shall be disqualified
                forthwith and BLANCKANVAS MEDIA PVT. LTD. reserves its rights,
                in addition to removing such post, to take legal action against
                such Participant and/or user.
                <br />
                <br />
                13. Participant agrees no clarifications on the questions and
                the answers used in the Contest shall be entertained by
                BLANCKANVAS MEDIA PVT. LTD.
                <br />
                <br />
                14. BLANCKANVAS MEDIA PVT. LTD. including its respective agents
                and representatives, employees shall not be responsible for any
                loss of Entries for any reason whatsoever including, due to any
                technical problems for Entries received after the deadline as a
                consequence of computer service delays, interruptions,
                electronic failures or overloads, or for lost, misdirected or
                misplaced Entries. The Entries are void if unreadable,
                inaccurate, incomplete, damaged, tampered with, falsified,
                mechanically reproduced, not in the prescribed format, irregular
                in any way, or otherwise not in compliance with these Terms and
                Conditions.
                <br />
                <br />
                15. BLANCKANVAS MEDIA PVT. LTD. reserves its right to select and
                declare or not to declare the Winner in the Contest.
                <br />
                <br />
                16. While accepting the Prize, the Winner may be required to
                sign an “indemnity and release of claims” form provided by
                BLANCKANVAS MEDIA PVT. LTD., as the case may be, which shall
                release BLANCKANVAS MEDIA PVT. LTD. of all liability. Failure to
                complete and sign any documents requested by BLANCKANVAS MEDIA
                PVT. LTD. may result in disqualification and selection of an
                alternate Winner. All decisions of BLANCKANVAS MEDIA PVT. LTD.
                are final in this regard.
                <br />
                <br />
                17. Mere participation/submitting Entries in the Contest does
                not entitle the Participants to win the Prize.
                <br />
                <br />
                18. The Prize will be awarded to the Winners under verification
                and by these Terms and Conditions.
                <br />
                <br />
                19. BLANCKANVAS MEDIA PVT. LTD. may refuse to give the Prize(s)
                to Participant(s) in the event of his/her fraud, dishonesty, or
                non-entitlement to participate in the Contest under these Terms
                and Conditions.
                <br />
                <br />
                20. The Prize is not transferable, assignable, or exchangeable
                for the cash equivalent. Only the prize Winners and no other
                person or agent may claim the Prize.
                <br />
                <br />
                21. In case the Winner is/are found to violate any or all
                rules/T&C of the Contest, BLANCKANVAS MEDIA PVT. LTD. reserves
                the right to initiate legal proceedings against such person(s)
                including but not limited to having the concerned Winners return
                his/her title and Prize and/or refund the Prize(s) won.
                <br />
                <br />
                22. BLANCKANVAS MEDIA PVT. LTD. has the right to substitute the
                Prize with other prizes of equal value, as determined by
                BLANCKANVAS MEDIA PVT. LTD. in its sole discretion.
                <br />
                <br />
                23. BLANCKANVAS MEDIA PVT. LTD. has the right to amend (add,
                delete or modify) the Terms and Condition governing the Contest,
                prospectively or retrospectively, at its discretion and without
                prior notice to the Participant.
                <br />
                <br />
                24. BLANCKANVAS MEDIA PVT. LTD. reserves the right to disqualify
                any participant if it has reasonable grounds to believe that the
                Participant has breached any of these Terms and Conditions.
                <br />
                <br />
                25. BLANCKANVAS MEDIA PVT. LTD. is not responsible for any
                errors or omissions in the terms and conditions contained
                herein. All information provided in the Contest is provided "As
                is" without warranty of any kind. BLANCKANVAS MEDIA PVT. LTD.
                makes no representations and disclaims all express, implied, and
                statutory warranties of any kind to the Participant and/or any
                third party including, without limitation, warranties as to
                accuracy, timeliness, completeness, merchantability, or fitness
                for any particular purpose.
                <br />
                <br />
                26. Under no circumstance, shall BLANCKANVAS MEDIA PVT. LTD.
                and/or their directors, employees, officers, or affiliates, be
                liable to the Participant and/or any third party for any lost
                profits or lost opportunity, indirect, special, consequential,
                incidental, or punitive damages whatsoever. The Participant
                specifically agrees that it shall have no claim or demand
                against BLANCKANVAS MEDIA PVT. LTD. on the subject matter of the
                contest thereby relinquishing and/or waiving any or all
                proceedings against BLANCKANVAS MEDIA PVT. LTD. their directors,
                employees, officers, or affiliates to claim any damages or
                relief in connection with the Contest.
                <br />
                <br />
                27. By entering into the Contest, the Winners/Participants waive
                all copyrights including but not limited to Intellectual
                Property Rights (IPR) and moral rights, rights of publicity, and
                any related rights and consents to BLANCKANVAS MEDIA PVT. LTD.’s
                right to use the pictures, content, writing, and/or any material
                uploaded by the Participant(s) in the captioned posted for the
                Contest. BLANCKANVAS MEDIA PVT. LTD. reserves the sole and
                exclusive right to use a picture, tape, or portray the
                Participant as a Contest Winners, and to exhibit this material
                in any media now existing or hereinafter created, including
                without limitation television, film, radio, and print media,
                without any compensation whatsoever for advertising and
                publicity purposes. The Participant also consents to BLANCKANVAS
                MEDIA PVT. LTD.’s right to use his/her name, voice or picture,
                or the content of his/her Contest Entry (collectively, the
                “Publicity Rights”). The Participant hereby consents that as and
                when called upon by BLANCKANVAS MEDIA PVT. LTD. without claiming
                any compensation thereof, at the cost of BLANCKANVAS MEDIA PVT.
                LTD. he/she shall perfect the title of BLANCKANVAS MEDIA PVT.
                LTD. to the content, picture, writing, and/or material developed
                and/or created by the Participant by assigning all his/her
                right, title, and interest in his/her work, content, picture,
                writing and/or material to the sole, exclusive and proprietary
                right of BLANCKANVAS MEDIA PVT. LTD. BLANCKANVAS MEDIA PVT. LTD.
                may allow its agencies to exercise/exploit the Publicity Rights
                in conjunction with BLANCKANVAS MEDIA PVT. LTD. BLANCKANVAS
                MEDIA PVT. LTD. shall also be free to use any ideas, concepts,
                know-how, or techniques contained in the entries received for
                the Contest for any purpose.
                <br />
                <br />
                28. BLANCKANVAS MEDIA PVT. LTD. does not make any commitment,
                express or implied, to respond to any feedback, suggestion and,
                or, queries of the Participants or furnish any reason or
                explanation for inclusion and, or, exclusion of any particular
                submission of the Entry of a Participant at any stage of the
                Contest.
                <br />
                <br />
                29. The Participant agrees that he/she shall not hold
                BLANCKANVAS MEDIA PVT. LTD. and/or the Jury and/or their
                employees, responsible for delays or any problem in connection
                to the Contest.
                <br />
                <br />
                30. BLANCKANVAS MEDIA PVT. LTD. shall in no manner be
                responsible and/or liable for any injury, death, mental trauma
                caused to the Participants by participating in the contest
                and/or to the Participant in any manner whatsoever or for any
                reason whatsoever in connection to the Contest.
                <br />
                <br />
                31. The Participant shall do any acts and execute all documents
                in such manner and at such location as may be required by
                BLANCKANVAS MEDIA PVT. LTD. in its sole and absolute discretion
                to protect, perfect or enforce any of the rights granted or
                confirmed to BLANCKANVAS MEDIA PVT. LTD. by the Participant
                herein.
                <br />
                <br />
                32. The content, including without limitation, the text,
                software, scripts, graphics, photos, sounds, music, videos,
                interactive features and the like ("Content") and the
                trademarks, service marks, and logos contained therein
                ("Marks"), all Entries, are owned by BLANCKANVAS MEDIA PVT. LTD.
                Content is provided to Participant AS IS for Participant’s
                information and personal use only and may not be used, copied,
                reproduced, distributed, transmitted, broadcast, displayed,
                sold, licensed, or otherwise exploited for any other purposes
                whatsoever without the prior written consent of BLANCKANVAS
                MEDIA PVT. LTD. and/or its respective owners. Participant agrees
                not to engage in the use, copying, or distribution of any of the
                Content other than expressly permitted herein, including any
                use, copying, or distribution of user submissions of third
                parties for any purposes whatsoever.
                <br />
                <br />
                33. Non-conformance by any Participant and /or Winners of the
                Contest will result in immediate disqualification of the
                Participant from participation or winning the Prize as the case
                may be.
                <br />
                <br />
                34. BLANCKANVAS MEDIA PVT. LTD. reserves the right to withdraw
                or discontinue and/or terminate the Contest at any stage without
                prior notice and any liability whatsoever to the Participants.
                <br />
                <br />
                35. Any payment made by the Participant to participate in this
                contest is non-refundable under any circumstances whatsoever
                including but not limited to the contest being withdrawn,
                discontinued, call off, suspended, substituted, replaced, or
                canceled by BLANCKANVAS MEDIA PVT. LTD. without further notice
                to the Participant.
                <br />
                <br />
                36. The decisions of BLANCKANVAS MEDIA PVT. LTD. and its
                representatives shall be final and binding on all aspects of the
                Contest.
                <br />
                <br />
                37. All taxes, levies, and duties due and owing under applicable
                and statutory laws in connection with all Prize if any, and all
                other costs, including insurance, incidental costs, gifts,
                gratuities, and taxes, are the sole responsibility of the
                Prize(s) Winners.
                <br />
                <br />
                38. BLANCKANVAS MEDIA PVT. LTD. shall not be responsible for any
                lost, late or misdirected computer transmission or network,
                electronic failures of any kind or any failure to receive
                entries owing to transmission failures or due to any technical
                reasons
                <br />
                <br />
                39. The Participants by providing sensitive personal information
                hereby consents that BLANCKANVAS MEDIA PVT. LTD. shall have the
                right to share the information so collected with such other
                third party as required by BLANCKANVAS MEDIA PVT. LTD. for the
                Contest and hereby agree that such transfer of information to a
                third party shall not be construed as a breach by BLANCKANVAS
                MEDIA PVT. LTD. and the Participant hereby releases,
                relinquishes and waives BLANCKANVAS MEDIA PVT. LTD. from all
                claims and liabilities arising due to any breach thereof by a
                third party. All information submitted online is subject to the
                due risk of interruption, disruption, slippage, loss of partial
                or whole content, and other such related issues, and therefore
                BLANCKANVAS MEDIA PVT. LTD. does not guarantee any
                confidentiality concerning any information or submissions of
                entry by the Participant submitted online.
                <br />
                <br />
                40. BLANCKANVAS MEDIA PVT. LTD. shall deal with any
                Data/information including sensitive personal information if
                any, that it receives from Participant or otherwise collects,
                holds, uses, and processes in the following manner: a)
                BLANCKANVAS MEDIA PVT. LTD. may also disclose Data/information
                including sensitive personal information, if any, to
                governmental agencies and regulators (e.g., tax authorities),
                social organizations (e.g., the social security administration),
                human resources benefit providers (e.g., health insurers),
                external advisors (e.g., lawyers, accountants, and auditors),
                courts and other tribunals, and government authorities, to the
                extent required or permitted by applicable legal obligations. B
                )The level of data protection measures by BLANCKANVAS MEDIA PVT.
                LTD. shall be such as to comply with all applicable laws.
                <br />
                <br />
                41. Participants confirm that the pictures uploaded by them or
                any part thereof do not infringe upon the statutory rights,
                common law rights, intellectual property rights including
                copyrights in literary, dramatic, musical or motion picture
                rights, patent rights, or the trademark or trade names of any
                person, firm, corporation, association or entity whatsoever.
                Neither the Pictures, content, material nor any part thereof
                violate the statutory rights of, or the right of privacy, or
                constitute a libel or slander against any person, firm,
                corporation, association, or entity whatsoever, or violate any
                other rights. No pictures or any part thereof shall be
                defamatory or contribute contempt of court or breach of
                contract, or breach of any provision of a statute, nor hurt the
                sentiments of religious groups. In the event of any infringement
                and/or any unlawful usage of any information including pictures,
                content, or material provided by the Participant, the
                Participant shall keep BLANCKANVAS MEDIA PVT. LTD. indemnified
                and undertake to make good the costs, liabilities, losses and/or
                damages caused to BLANCKANVAS MEDIA PVT. LTD. in this regard,
                BLANCKANVAS MEDIA PVT. LTD. shall not be held liable on any
                account whatsoever.
                <br />
                <br />
                42. Once uploaded and published, Participants are not allowed to
                request for removal, editing, or altering the Entry in any
                manner whatsoever.
                <br />
                <br />
                43. The Contest shall be governed by and construed by the
                applicable laws in India. All matters concerning the Contests
                are subject to the jurisdiction of the Courts at Mumbai only.
                <br />
                <hr />
                <strong>Overview</strong>
                <br />
                OMG - Face Of The Year is a first of its kind virtual pageant
                which will be covering two categories Mr. & Miss. OMG - Face Of
                The Year. The complete pageant will take place online.
                <br />
                <br />
                <strong>Goals</strong>
                <br />
                1. To run one & first of its kind online talent pageant in this
                era of digitalisation.
                <br />
                2. To encourage and ensure participation from serious players
                and social media enthusiasts, fashion enthusiasts.
                <br />
                3. To engage the positive aspect of social media usage and
                define talent.
                <br />
                <br />
                <strong>Milestones</strong>
                <br />
                1. Registration + Payment <br />
                Selection of Top 500 via Leader board
                <br />
                2. Charismatic Persona
                <br />
                Selection of Top 150
                <br />
                3. Quirky Exhibit
                <br />
                Selection of Top 30
                <br />
                4. Train And Gain
                <br />
                Selection of Top 10
                <br />
                5. Slay in Sync
                <br />
                Selection of Top 5<br />
                6. Swipe The Crown
                <br />
                Selection of Winner
                <br />
                <br />
                <strong>Registration Process</strong>
                <br />
                Name - ______________________
                <br />
                City - ______________________
                <br />
                Age - ______________________
                <br />
                Contact No. - ________________
                <br />
                E - Mail ID - __________________
                <br />
                As the contestant comes up on the registration page on the
                website, we will do a verification process with both contact no.
                and mail id and then proceed for Payment. If the payment is
                successful the contestant will get a confirmation mail regarding
                the payment and the same mail will have the information for the
                user id and password.
                <br />
                Contestants can change the password later.
                <br />
                If the payment is not successful, then an email will be sent to
                the contestant stating that the transaction has failed, along
                with that a link will also be sent as a solution, guiding the
                contestant to register it again. Meanwhile, the contestant can
                also get in touch via chatbots for if there are any queries for
                the same. Once the payment is successful, the contestants are
                supposed to login in their profile and fill in all the
                information required there, a format for the same will be
                shared. Once they fill the form and upload the information
                required - this will be sent to the backend team for approval,
                if all is good to go as per the set guidelines the profile is
                approved and a mail and a message on the mobile are sent saying
                “Your profile is active now and you can share the same with your
                family and friends and get as many likes as possible.” So they
                can be there among the top contestants on the leaderboard, which
                will be one of the judging criteria for the next round, i.e.
                selecting the top 300 in each category. If the Profile does not
                fit as per the guidelines, a mail will be sent to them stating
                kindly check your profile and update the required information,
                the contestant may also use the WhatsApp chat if they have any
                confusion.
                <br />
                The registration process will close on 30th November 2022. The
                voting lines shall remain on for a couple of more days (date
                shall be decided)
                <br />
                NOTE: - We will also be having an introduction video, for
                example for the contestant to see, so they will know how and
                what all they have to say in the Intro Video.
                <br />
                <br />
                <strong>Charismatic Persona</strong>
                <br />
                Once the voting lines are closed. A few days (no.of days yet to
                be decided) shall be taken to count all the votes of the top
                500, evaluating them on other criteria as well, and then declare
                the top 300 in each category. The selection of the top 150 will
                be done from the number of registrations received overall till
                the last date of registration.
                <br />
                A detailed criterion for selection of the TOP - 150 will be as
                following:
                <br />
                1. Top 500 will be selected in each category as per the
                leaderboard and those contestants will further be evaluated on
                the following parameter:
                <br />
                a. Looks by the pictures shared during the registration process
                <br />
                b. Vitals shared during the registration process
                <br />
                c. Intro video shared by the contestant
                <br />
                The contestants will be marked out of 100 in each section. The
                scores will then be totaled along with the no.of likes received
                in public voting and then we will average out with 60% the ratio
                from the backend team and 40% from the no. of likes - based on
                this calculation we get our top 150 contestants in each
                category. The evaluation task by the backend team shall be done
                by them in approximately 7 days.
                <br />
                The top 150 contestants will be displayed on the “Winner Board”.
                <br />
                All the top 150 contestants in each category will get a
                Congratulations Mail with the instructions for the next round
                along with the deadline for submission for the same.
                <br />
                <br />
                <strong>What is a leaderboard and how does it work?</strong>
                <br />
                A leaderboard is a page on the website which will be the most
                functional during the selection of TOP 500, as it will show
                which contestants are leading in online voting.
                <br />
                The top 10 boys and girls getting the maximum no. of votes will
                be shown on the page, this will always be real-time data. Rest
                490 contestants will keep scrolling (horizontally) down below
                the top 10 boys & girls. This page will be viewable to everyone.
                <br />
                <br />
                <strong>Quirky Exhibit</strong>
                <br />
                After the selection of TOP – 150 contestants in each category,
                we now move forward to the next round which is the selection of
                TOP - 30. E-mails have already been sent out to all shortlisted
                contestants along with the details of their next task,
                guidelines, and deadlines too.
                <br />
                Process of Selection :<br />
                Task: Each contestant will have to submit a video which will be
                talent specific. The details of this round have already been
                sent to the contestants.
                <br />
                <br />
                Details Of The Talent Round:
                <br />
                1. There is no restriction in terms of the category of the
                talent round.
                <br />
                2. The contestants can get as creative as they can for this
                round
                <br />
                3. The videos must not be longer than 60 seconds.
                <br />
                Note: Voting lines are not operational in this round.
                <br />
                The contestants shall be judged based on their creativity and
                talent as shown in their video. They shall be evaluated for the
                same out of 100 marks.
                <br />
                The use of props is allowed in the making of the video.
                <br />
                Once the evaluation is done, all the Top – 30 contestants in
                each category will get a Congratulations Mail along with
                detailed instructions for the next round.
                <br />
                <br />
                <strong>Train And Gain</strong>
                <br />
                The selection of TOP-30 contestants in each category has been
                done, and now we move ahead to the next round which is the
                selection of the TOP-10 contestants in each category. The emails
                have already been sent out to the TOP-30 contestants along with
                the self-declaration informing us about their fitness or ailment
                if any for this round along with guidelines and deadline for the
                submission too.
                <br />
                This round will assess the contestants based on their fitness.
                <br />
                Fitness Round :<br />
                The fitness round will have a fitness instructor as a part of
                it. This task will be coordinated for 60 contestants (30 in each
                category). The scheduling will be done for 3 contestants at a
                time. The details of the schedule will already have been shared
                with the contestants before this round. These 3 contestants will
                be given a task on the spot and they will have to perform it
                then and there at the same time. All the tasks will be recorded
                by our camera team which will be present at the fitness
                instructor/jury’s house. We’ll be going live on social media for
                this entire round. The fitness instructor shall be rating the
                contestants out of 100 based on their performance and then
                hand-over the scores to the backend team.
                <br />
                Also, the fitness instructor will announce Miss. Fittest and Mr.
                Fittest based on the performance of all the 30 contestants in
                each category.
                <br />
                The evaluation done based on this round shall give us the Top –
                10 contestants in each category
                <br />
                All the Top-10 contestants in each category will get a
                Congratulations Mail with the instructions for the next round
                along with the deadlines of the same.
                <br />
                <br />
                <strong>Slay In Sync</strong>
                <br />
                Nearing to the finale now, the TOP -10 in each category has been
                selected and it is now that we move ahead to the second last
                round which is the selection of the TOP-5 in each category. The
                emails have already been sent to all the contestants regarding
                this round with guidelines and deadlines. This round will be a
                session with our Fashion Choreographer, wherein the contestants
                will be taught and mentored on how to walk, pose, facial
                expressions, and other nitty-gritty.
                <br />
                All of this will take place online. Our camera team will be
                present at the house of the Fashion Choreographer. They will be
                recording the entire session and the session will also be
                streamed on social media platforms.
                <br />
                There will be two different sessions with each category. During
                the session, the instructor will brief them about their task for
                the selection of TOP-5. As in this level, each girl and boy will
                be paired and they need to create their walk video as Duets. For
                the same, they will be given the song by the backend team along
                with other details and instructions too.
                <br />
                Firstly the girl will upload her walk video on her profile page
                ( she can also record her video from the page itself), once her
                video is uploaded the boy gets a notification regarding the same
                saying he can upload his video now. He should be able to see the
                video uploaded by the girl such that he can match it and record
                his video directly from the page. The contestants will be given
                2 days to do this activity. <br />
                Once all the contestants have uploaded their videos, they will
                be evaluated out of 200. 100 each for the girl and the boy. This
                scoring will give us our TOP-5 finalists in each category.
                <br />
                All the 5 contestants in each category will get a
                Congratulations Mail with the instructions for the next round
                along with the submission deadline.
                <br />
                <br />
                <strong>Swipe The Crown</strong>
                <br />
                The Grand Finale is just a round away and after all the rounds
                and activities have done up till now, the only thing missing is
                a photoshoot. Now that we have our TOP-5 finalists in each
                category, this last round will be a Shoot-At-Home!!
                <br />
                Sounds interesting, right??
                <br />
                We hereby introduce the concept of “Distant Photography”. During
                this process, the photographer and the contestant both will be
                at different locations and we will have a photoshoot done of
                each contestant. All the contestants will be given a theme for
                which they need to be prepared in consultation with the
                photographer. Styling and makeup details too will be provided
                prior to itself.
                <br />
                Once this session is complete, the photographer will edit and
                give each contestant 5 edited pictures, from these 5 pictures
                the contestant will be asked to upload only one of those
                pictures on their Instagram handle. This entire session will be
                covered by our camera team and will also be streamed live on
                social media platforms.
                <br />
                <br />
                No. People present :<br />
                Moderator - 1<br />
                Jury -3
                <br />
                Contestants - 5 from each Category
                <br />
                The much-awaited grand finale is here where we finally reveal
                the OMG - Face Of The Year 2022
                <br />
                The moderator will begin the session and welcome all the jury
                members by introducing and asking them to say a few words about
                this whole concept of the show, contestants, etc.
                <br />
                Post this the moderator will then welcome all the TOP-5
                Finalists from each category. Each the contestant will be called
                out and the moderator will be showing all the pictures shot by
                the photographer and they will have a discussion on the same
                like posing/ expression and general comparison, the post that we
                will share the screen showing the picture shared by the a
                contestant on their Instagram Profile. Jury members will ask the
                contestant why he/she chose that particular picture for their
                Instagram profile.
                <br />
                Depending on their answers and the pictures shown to them, the
                jury will judge them keeping all relevant points in mind and the
                scores given to them will then be shared with the moderator. In
                this, all the contestants will be marked from both the
                categories. Once the jury has interacted with all the
                contestants, and the admin panel team has received the scores of
                all the finalists, the scores will be uploaded at the backend of
                the website.
                <br />
                The winners of MR. & Miss. OMG - 2022 will be declared on the
                same screen on the website.
                <br />
                Note - We will also share the score sheet of the finalists for
                transparency.
              </Text>
            </Col>
          </Row>
        </Container>
      </Section>
    );
  }
}

export default TermsAndConditions;
