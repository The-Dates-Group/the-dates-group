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
import Page from '@/components/Page'
import { Card, ListGroup } from 'react-bootstrap'

const Consulting = () =>
  <Page>
    <Page.Section>
      <Card className="card-section">
        <Card.Header as="h1" className="text-center">
          Business Operations Mentoring
        </Card.Header>
        <Card.Body>
          Five weeks of one-on-one mentoring to cover business operations, which includes direction in the following
          areas, based on client needs: marketing, production & fulfillment, sales, online presence, inventory
          management, strategy, team-building, lead generation, technology, accounting and customer service.
        </Card.Body>
      </Card>
    </Page.Section>
    <Page.Section>
      <Card className="card-section">
        <Card.Header as="h1" className="text-center">
          Board Development & Compliance
        </Card.Header>
        <Card.Body className="pb-0">
          <Card.Subtitle as="h2" className="mb-2 fs-4">
            4-Part Training in Roles/Responsibilities
          </Card.Subtitle>
        </Card.Body>
        <ListGroup variant="flush">
          <ListGroup.Item>Financial Duties</ListGroup.Item>
          <ListGroup.Item>Strategic Planning/Sustainability Action Plan</ListGroup.Item>
          <ListGroup.Item>Fundraising</ListGroup.Item>
          <ListGroup.Item>Ratios</ListGroup.Item>
        </ListGroup>
        <Card.Footer>
          <Card.Text as="p">
            The Dates Group also offers Executive Director/Founder Training,
            Board Training, and Impact and Historical Statements.
          </Card.Text>
        </Card.Footer>
      </Card>
    </Page.Section>
    <Page.Section>
      <Card className="card-section">
        <Card.Header as="h1" className="text-center">
          Nonprofit Consultation
        </Card.Header>
        <Card.Body>
          <Card.Text>
            This consultation supports the process of starting or restructuring a nonprofit organization.
          </Card.Text>
        </Card.Body>
      </Card>
    </Page.Section>
    <Page.Section>
      <Card className="card-section">
        <Card.Header as="h1" className="text-center">
          General Consultation
        </Card.Header>
        <Card.Body>
          <Card.Text>
            This refers to any business consultation outside of a specific
            service or program and after the free initial consultation.
          </Card.Text>
        </Card.Body>
      </Card>
    </Page.Section>
  </Page>

export default Consulting
