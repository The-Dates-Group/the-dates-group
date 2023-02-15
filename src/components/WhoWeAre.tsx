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
import { Card, Carousel, Col, Row } from 'react-bootstrap'
import Image from 'next/image'
import thumbnailA from '@/images/thumbnails/thumbnail-image-a-w1280.webp'
import thumbnailB from '@/images/thumbnails/thumbnail-image-b-w1280.webp'
import thumbnailC from '@/images/thumbnails/thumbnail-image-c-w1280.webp'
import YouTubeEmbed from '@/components/YouTubeEmbed'

const WhoWeAre = () =>
  <Card className="card-section">
    <Card.Header as="h1" className="text-center">Who We Are</Card.Header>
    <Card.Body className="container-fluid gap-vertical-3">
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
          <Card.Title as="h2" className="display-6 text-center">Certified & Professional</Card.Title>
          <Card.Text>
            We are a Limited Liability Corporation with a team of professionals to meet your needs. We're proud to
            have expert, proven grant writers as well as a notary public. We are a minority-owned, woman-owned
            business. We are committed to providing you with professional, efficient and masterful solutions to take
            your business to it's potential.
          </Card.Text>
        </Col>
      </Row>
      <Row xs={1} lg={2} className="align-items-center flex-column flex-lg-row">
        <Col lg={5} className="mb-3 mb-lg-0">
          <Card.Title as="h2" className="display-6 text-center">Trusted Experience</Card.Title>
          <Card.Text>
            We have years of experience solving the needs of small businesses. With backgrounds extending from grant
            writing, business financial services, small business banking, business and workforce development, you can
            trust us with your prized possession, your business. Our passion is in helping people see their goals
            realized. We are dedicated to making your dreams come true for your business.
          </Card.Text>
        </Col>
        <Col lg={7}>
          <YouTubeEmbed videoId="soRIjkFemnc" className="card-img"/>
        </Col>
      </Row>
    </Card.Body>
  </Card>

export default WhoWeAre
