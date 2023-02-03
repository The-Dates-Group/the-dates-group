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
import { Col, Row } from 'react-bootstrap'
import Page, { PageSection } from '@/components/Page'
import ServiceCard from '@/components/ServiceCard'

export type Service = {
  title: string
  href: string
}

export const services: Service[] = [
  {
    title: 'Get Funded',
    href: '/services/get-funded'
  },
  {
    title: 'How To Start My Business',
    href: '/services/how-to-start-my-business'
  },
  {
    title: 'How To Get My 501c3 (Tax-Exempt Nonprofit)',
    href: '/services/how-to-get-my-501c3'
  }
]

const ServicesPage = () =>
  <Page title="Services">
    <PageSection>
      <h1 className="h2 text-center">Services</h1>
      <Row xs={1} sm={2} lg={3}>
        {services.map((service, i) =>
          <Col key={`service-${i}`} className="d-flex mb-4">
            <ServiceCard service={service} height={133} width={200}/>
          </Col>
        )}
      </Row>
    </PageSection>
  </Page>

export default ServicesPage
