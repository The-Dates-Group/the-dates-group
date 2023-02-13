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
import Page from '@/components/Page'
import ServiceCard from '@/components/ServiceCard'

export type Service = {
  title: string
  href: string
  description?: string
}

export const services: Service[] = [
  {
    title: 'Planning',
    href: '/services/planning'
  },
  {
    title: 'Consulting',
    href: '/services/consulting'
  },
  {
    title: 'Funding',
    href: '/services/funding'
  },
  {
    title: 'Launching',
    href: '/services/launching'
  },
  {
    title: 'Specialization',
    href: '/services/specialization'
  }
]

const ServicesPage = () =>
  <Page title="Services">
    <Page.Section>
      <Card className="card-section">
        <Card.Header as="h1" className="text-center">
          Services
        </Card.Header>
        <Card.Body>
          <Row xs={1} sm={2} lg={3} className="justify-content-center">
            {services.map((service, i) =>
              <Col key={`service-${i}`} className="d-flex mb-4">
                <ServiceCard service={service} height={133} width={200}/>
              </Col>
            )}
          </Row>
        </Card.Body>
      </Card>
    </Page.Section>
  </Page>

export default ServicesPage
