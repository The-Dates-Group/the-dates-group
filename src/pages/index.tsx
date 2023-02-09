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
import { Button, Card, Carousel, Col, Row } from 'react-bootstrap'
import Image from 'next/image'
import Page from '@/components/Page'
import ServiceCard from '@/components/ServiceCard'
import { services } from '@/pages/services'
import thumbnailA from '@/images/thumbnails/thumbnail-image-c-w1280.webp'
import thumbnailB from '@/images/thumbnails/thumbnail-image-b-w1280.webp'
import thumbnailC from '@/images/thumbnails/thumbnail-image-c-w1280.webp'

const HomePageHero = () =>
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
      <Button variant="dates-primary" href="/contact">
        Schedule A Call
      </Button>
    </Card.Body>
  </Card>

const WhoWeAreSection = () =>
  <Page.Section withFade>
    <Card className="card-clear">
      <Card.Header as="h1" className="text-center">Who We Are</Card.Header>
      <Card.Body className="container-fluid">
        {/* at XL screen sizes, expand from a single column to two columns */}
        <Row xs={1} lg={2} className="align-items-center flex-column-reverse flex-lg-row">
          <Col lg={7}>
            <Carousel controls={false} indicators={false} touch={false} fade={true} pause={false}>
              {[thumbnailA, thumbnailB, thumbnailC].map((thumbnail, index) =>
                <Image
                  key={`thumbnail-${index}`}
                  className="card-img carousel-item"
                  src={thumbnail}
                  alt="thumbnail"
                />
              )}
            </Carousel>
          </Col>
          <Col lg={5} className="mb-3 mb-lg-0">
            <Card.Title as="h2" className="text-center">Certified & Professional</Card.Title>
            <Card.Text>
              We are a Limited Liability Corporation with a team of professionals to meet your needs. We're proud to
              have expert, proven grant writers as well as a notary public. We are a minority-owned, woman-owned
              business. We are committed to providing you with professional, efficient and masterful solutions to take
              your business to it's potential.
            </Card.Text>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  </Page.Section>

const ServicesSection = () =>
  <Page.Section withFade>
    <Card className="card-clear">
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
              Dates Group LLC uses experience and care to form, fund and protect your business.
            </p>
            <p className="mb-lg-0">
              Your business is our business!
            </p>
          </Col>
          <Col lg={3} className="d-flex flex-column">
            <Button variant="dates-primary" href="/services">See Additional Services</Button>
          </Col>
        </Row>
      </Card.Footer>
    </Card>
  </Page.Section>

const ContactUsSection = () =>
  <Page.Section withFade>
    <Card className="card-clear">
      <Card.Header as="h1" className="text-center">
        Ready to get your business funded?
      </Card.Header>
      <Card.Body>
        <Row xs={1} lg={2} className="justify-content-around">
          <Col lg={4} className="d-flex flex-column mb-2 mb-lg-0">
            <Button variant="dates-primary" href="/contact#message-us">Message Us</Button>
          </Col>
          <Col lg={4} className="d-flex flex-column">
            <Button variant="dates-primary" href="/contact#schedule-a-call">Schedule A Call</Button>
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
