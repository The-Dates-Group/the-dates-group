/*
 * Copyright 2023 Kaidan Gustave
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { Card, Col, Row } from 'react-bootstrap'
import Image, { StaticImageData } from 'next/image'
import Page from '@/components/Page'
import TeamMemberCard from '@/components/TeamMemberCard'
import { MediaQuery } from '@/components/hooks/useMediaQuery'
import WhoWeAre from '@/components/WhoWeAre'

import chiDatesImg from '@/images/staff/chi-dates.webp'
import melissaWalterImg from '@/images/staff/melissa-walter.webp'
import jodiDoaneImg from '@/images/staff/jodi-doane.webp'
import cynthiaMcMillanImg from '@/images/staff/cynthia-mcmillan.webp'
import brittanyVaughanImg from '@/images/staff/brittany-vaughan.webp'
import lisaGreenImg from '@/images/staff/lisa-green.webp'

import afpLogo from '@/images/associations/afp-logo.webp'
import certifiedQuickbooksProadvisorLogo from '@/images/associations/certified-quickbooks-proadvisor-logo.webp'
import femaleFounderCollectiveLogo from '@/images/associations/female-founder-collective-logo.webp'
import grantProfessionalsAssociationLogo from '@/images/associations/grant-professionals-association-logo.webp'
import nationalNotaryAssociationLogo from '@/images/associations/national-notary-association-logo.webp'
import the10thHouseLogo from '@/images/associations/the-10th-house-logo.webp'
import nationalSmallBusinessAssociationLogo from '@/images/associations/national-small-business-association-logo.webp'
import willowbrookBurrRidgeChamberOfCommerceAndIndustryLogo
  from '@/images/associations/willowbrook-burr-ridge-chamber-of-commerce-and-industry-logo.webp'

type AssociationLogoProps = {
  name: string
  src: StaticImageData
  url?: string
}

function AssociationLogo(props: AssociationLogoProps) {
  return (
    <Col className="position-relative">
      <Image src={props.src} alt={`${props.name} logo`} className="card-img"/>
      {props.url && <a href={props.url} className="stretched-link" target="_blank" rel="noreferrer"></a>}
    </Col>
  )
}

const AboutUs = () =>
  <Page title="About Us">
    <Page.Section>
      <WhoWeAre/>
    </Page.Section>
    <Page.Section>
      <Card className="card-section">
        <Card.Header id="our-team" as="h1" className="text-center">
          Our Team
        </Card.Header>
        <Card.Body className="gap-vertical-3">
          <MediaQuery.Provider boundary="max-width" breakpoint="lg">
            <TeamMemberCard
              noLazy
              name="Chi Dates"
              occupation="CEO | Executive Director"
              src={chiDatesImg}
              direction="image-left">
              <Card.Text>
                Chi Dates has a passion for small business owners, stemming from her 25 years in the financial industry
                servicing them. Through business estate planning, insurance, and small business banking, she has helped
                hundreds of small business owners over the years in the Chicagoland area, Los Angeles, St. Louis,
                Memphis, and Colorado Springs. Chi is a member of the Grant Professionals Association, the Association
                of Fundraising Professionals, the National Notary Association, and the League of Women Voters, and
                currently serves on the Economic Development committee of the National Small Business Association’s
                Leadership Council. She is passionate about business development, family, generational wealth, and the
                advancement of women, minorities, and every protected class of citizens. By marrying business planning,
                marketing, financial statements, and growth strategy into sophisticated solutions to attract funders,
                investors, and grantors, Chi has served as Executive Director for two nonprofits over the past 8 years.
                Currently, she is the Executive Director of The Dates Group Project and excels in nonprofit
                consultation and board development.
              </Card.Text>
            </TeamMemberCard>
            <TeamMemberCard
              name="Melissa Walter"
              occupation="Bookkeeper | QuickBooks Pro Advisor"
              src={melissaWalterImg}
              direction="image-right">
              <Card.Text>
                Melissa Walter is strong with cloud-based accounting solutions for small business owners. She has always
                had an overwhelming desire to help people succeed and learn, helping small business owners by giving
                them the freedom to get back to running their business, rather than wasting their precious time in their
                books. Melissa has as her core values: God first, people and relationships matter, and integrity.
              </Card.Text>
            </TeamMemberCard>
            <TeamMemberCard
              name="Cynthia McMillan, JD"
              occupation="Estate Planner | Nonprofit Law"
              src={cynthiaMcMillanImg}
              direction="image-left">
              <Card.Text>
                Cynthia McMillan, a Chicago native, is a legal professional with 25 years’ experience in Dallas, working
                for Fortune 500 companies and 6 years in the private sector. Cynthia has legal experience in a broad
                range of areas, including commercial litigation, patent prosecution, franchise law, insurance, mergers
                and acquisitions, and nonprofit law. Through her personal experience with her parents, she gained a
                passion for estate planning and invested her skillset in that particular area of law, where she now
                specializes.
              </Card.Text>
            </TeamMemberCard>
            <TeamMemberCard
              name="Lisa Green"
              occupation="Federal and State Grant Writer"
              src={lisaGreenImg}
              direction="image-right">
              <Card.Text>
                Lisa Green is a certified CF APMP proposal writer and a proud officer of the Board of Directors for the
                Grant Professionals Association Chicago Chapter. She has worked for Illinois State Senator Heather
                Steans of the 7th District, handling legislative research, constituent relations, and community
                engagement. Lisa has helped clients with their government procurement needs and has worked on several
                public-private projects, including:
              </Card.Text>
              <Card.Text as="ul" className="mt-3 mb-0">
                <li>The South Lakefront Corridor Transit Study</li>
                <li>The Buffalo Billion Project</li>
                <li>The Cabrini Green Redevelopment Project</li>
                <li>CTA LoopLink Project</li>
              </Card.Text>
            </TeamMemberCard>
            <TeamMemberCard
              name="Jodi Doane"
              occupation="Grant Writer"
              src={jodiDoaneImg}
              direction="image-left">
              <Card.Text>
                Jodi Doane is passionate about social justice and guided by the core value of tikkun olam, repairing the
                world. She fights for voting rights, women’s rights, a strong workforce development system, positive
                youth development, common sense gun laws, sensible juvenile justice practices, fair and compassionate
                immigration, and animal welfare; and against human trafficking. With an expansive history of board and
                committee engagement in both Chicago and Los Angeles, Jodi is an advocate for change and advancement
                through a women-centered and equity lens, specializing in Government Relations, grant writing, program
                development, effective communication, Board development and advocacy.
              </Card.Text>
            </TeamMemberCard>
            <TeamMemberCard
              name="Brittany Vaughan"
              occupation="Grant Writer | Business Plan Writer"
              src={brittanyVaughanImg}
              direction="image-right">
              <Card.Text>
                Brittany (Britt) Vaughan is an experienced nonprofit professional with expertise in grants management,
                outcome measurement, strategic planning, and relationship management. She takes pride in her
                demonstrated ability to be an inspiring, yet planful agent of change for her nonprofit partners. Driven
                in her professional and personal life to help others empower themselves, Britt serves on several local
                boards, committees, and organizations. Britt is also passionate about building a better world for women
                and girls, currently serving as a director for Zonta International and the Zonta Foundation for Women, a
                human rights organization holding General Consultative Status with the United Nations. Ms. Vaughan has
                been recognized by Business Life Magazine as a “Woman Achiever”; is the recipient of a Robert Woodruff
                Fellowship; and has received a Congressional Recognition for Service to Community from United States
                House of Representatives Congressman Adam Schiff. Britt is a Los Angeles native who in her free time,
                stays busy through travel, life-long learning, entertaining friends, getting crafty, and discovering
                great food.
              </Card.Text>
            </TeamMemberCard>
          </MediaQuery.Provider>
        </Card.Body>
      </Card>
    </Page.Section>
    <Page.Section>
      <Card className="card-section">
        <Card.Header id="proud-members-of" as="h1" className="text-center">
          Proud Members Of
        </Card.Header>
        <Card.Body>
          <Row xs={2} md={3} xl={5} className="justify-content-around">
            <AssociationLogo
              name="afp"
              src={afpLogo}
              url="https://afpglobal.org/"
            />
            <AssociationLogo
              name="certified quickbooks proadvisor"
              src={certifiedQuickbooksProadvisorLogo}
            />
            <AssociationLogo
              name="female founder collective"
              src={femaleFounderCollectiveLogo}
              url="https://femalefoundercollective.com/"
            />
            <AssociationLogo
              name="grant professionals association"
              src={grantProfessionalsAssociationLogo}
              url="https://grantprofessionals.org/"
            />
            <AssociationLogo
              name="national notary association"
              src={nationalNotaryAssociationLogo}
              url="https://www.nationalnotary.org/"
            />
            <AssociationLogo
              name="the 10th house"
              src={the10thHouseLogo}
              url="https://the10thhouse.femalefoundercollective.com/"
            />
            <AssociationLogo
              name="national small business association"
              src={nationalSmallBusinessAssociationLogo}
              url="https://www.nsba.biz/"
            />
            <AssociationLogo
              name="willowbrook burr ridge chamber of commerce and industry"
              src={willowbrookBurrRidgeChamberOfCommerceAndIndustryLogo}
              url="https://www.wbbrchamber.org/"
            />
          </Row>
        </Card.Body>
      </Card>
    </Page.Section>
  </Page>

export default AboutUs
