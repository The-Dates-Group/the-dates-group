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
import { Button, Card, Col, ListGroup, Row } from 'react-bootstrap'
import Page from '@/components/Page'
import { Award, CashCoin, ChatLeftDots, ClipboardCheck, Icon, RocketTakeoff } from 'react-bootstrap-icons'
import { ReactElement } from 'react'

export type Service = {
  title: string
  href: string
  icon?: Icon
  description?: string
  features?: string[]
  render?(): ReactElement | null
}

export const services: Service[] = [
  {
    title: 'Planning',
    href: '/services/planning',
    icon: ClipboardCheck,
    features: [
      'Business Plan',
      'Investor Deck And Plan',
      'Strategic Plan',
      'Estate Plan'
    ]
  },
  {
    title: 'Consulting',
    href: '/services/consulting',
    icon: ChatLeftDots,
    features: [
      'Business Operations Monitoring',
      'Board Development and IRS Compliance',
      'Nonprofit Consultation',
      'General Consultation'
    ]
  },
  {
    title: 'Fund Developing',
    href: '/services/fund-developing',
    icon: CashCoin,
    features: [
      'Grant Searches',
      'Grant Writing',
      'Crowdfunding',
      'Certifications (Including 8A Federal Contracts)'
    ]
  },
  {
    title: 'Launching',
    href: '/services/launching',
    icon: RocketTakeoff,
    features: [
      'Ready. Set. Launch!',
      '60-Day Nonprofit Launch'
    ]
  },
  {
    title: 'Specializing',
    href: '/services/specializing',
    icon: Award,
    features: [
      'Janitorial Services Program',
      'Authors and Artists',
      'Consultant Growth Strategy Plan',
      'Church Growth Program',
      'Fitness Influencer Program'
    ]
  }
]

const ServicesPage = () =>
  <Page title="Services">
    <Page.Section>
      <Row xs={1} md={2} className="d-flex justify-content-center">
        {services.map((service, i) =>
          <Col key={`service-${i}`} xs={12} md={6} className="d-flex">
            <Card className="card-section my-2 my-md-3 d-flex flex-fill">
              <Card.Header as="h2" className="mb-0 text-center">
                {service.icon ? <service.icon className="me-2"/> : null}
                {service.title}
              </Card.Header>
              {!service.features ? null : (
                <ListGroup variant="flush" className="border-bottom border-top">
                  {service.features.map((feature, i) =>
                    <ListGroup.Item key={`feature-${i}`}>
                      {feature}
                    </ListGroup.Item>
                  )}
                </ListGroup>
              )}
              <Card.Body className="d-flex">
                <Button variant="dates-primary-2" href={service.href} className="mt-auto flex-fill">
                  About {service.title} Services
                </Button>
              </Card.Body>
            </Card>
          </Col>
        )}
      </Row>
    </Page.Section>
  </Page>

export default ServicesPage
