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
import { Button, Card, Col, Row } from 'react-bootstrap'
import Head from 'next/head'
import Page from '@/components/Page'
import ServiceCard from '@/components/ServiceCard'
import { services } from '@/pages/services'
import stockA from '@/images/stock/stock-image-a.webp'
import WhoWeAre from '@/components/WhoWeAre'

const MessageUsButton = () =>
  <Button variant="dates-primary" href="/contact#message-us">Message Us</Button>
const ScheduleACallButton = () =>
  <Button variant="dates-primary" href="/contact#schedule-a-call">Schedule A Call</Button>
const SeeAdditionalServicesButton = () =>
  <Button variant="dates-primary" href="/services">See Additional Services</Button>

// noinspection HtmlUnknownAttribute
const HomePageHero = () =>
  <>
    <Head>
      <link
        // @ts-ignore
        fetchpriority="high" // browser hint that this image is high priority on load
        rel="preload"
        as="image"
        href={stockA.src}
        type="image/webp"
      />
    </Head>
    <Card className="card-clear container-fluid py-4 p-lg-5">
      <Card.Body className="gap-vertical-3 p-2 p-sm-3">
        <Card.Title as="h1" className="col-xxl-11 display-6 fw-bold">
          To meet the business needs of those who dare to dream, by providing result-driven
          solutions for both startups and existing businesses.
        </Card.Title>
        <Card.Text as={Col} lg={8} className="fs-5">
          The Dates Group is here to help make your business the best it can be! By applying decades of expertise and
          fiery passion for establishing businesses, we offer services to help organize, plan, and acquire funding for
          your existing businesses and new startups!
        </Card.Text>
        <div className="d-flex flex-column flex-md-row gap-vertical-2 gap-vertical-md-0 gap-horizontal-md-2">
          <ScheduleACallButton/>
          <SeeAdditionalServicesButton/>
        </div>
      </Card.Body>
    </Card>
  </>

const WhoWeAreSection = () =>
  <Page.Section withFade>
    <WhoWeAre/>
  </Page.Section>

const ServicesSection = () =>
  <Page.Section withFade>
    <Card className="card-section">
      <Card.Header as="h1" className="text-center">Find The Services You Need</Card.Header>
      <Card.Body>
        <Row xs={1} lg={3} className="gap-vertical-2 gap-vertical-lg-0">
          {services.slice(0, 3).map((service, i) =>
            <Col key={`service-${i}`} className="d-flex">
              <ServiceCard service={service}/>
            </Col>
          )}
        </Row>
      </Card.Body>
      <Card.Footer>
        <Row xs={1} lg={2} className="align-items-center justify-content-center">
          <Col lg={9} className="text-center text-lg-start">
            <p className="mb-1">
              The Dates Group uses experience to provide comprehensive business solutions.
            </p>
          </Col>
          <Col lg={3} className="d-flex flex-column">
            <SeeAdditionalServicesButton/>
          </Col>
        </Row>
      </Card.Footer>
    </Card>
  </Page.Section>

const ContactUsSection = () =>
  <Page.Section withFade>
    <Card className="card-section">
      <Card.Header as="h1" className="text-center">
        Ready to explore funding opportunities?
      </Card.Header>
      <Card.Body>
        <Row xs={1} lg={2} className="justify-content-around">
          <Col lg={4} className="d-flex flex-column mb-2 mb-lg-0">
            <MessageUsButton/>
          </Col>
          <Col lg={4} className="d-flex flex-column">
            <ScheduleACallButton/>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  </Page.Section>

const Home = () =>
  <Page className="home-page" hero={HomePageHero}>
    {/* Who We Are Section */}
    <WhoWeAreSection/>
    {/* Services Section */}
    <ServicesSection/>
    {/* Contact Us Section */}
    <ContactUsSection/>
  </Page>

export default Home
