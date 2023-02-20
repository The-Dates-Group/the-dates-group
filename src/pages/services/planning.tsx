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
import { Card } from 'react-bootstrap'

const Planning = () =>
  <Page>
    <Page.Section>
      <Card className="card-section">
        <Card.Header as="h1" className="text-center">
          Business Plan
        </Card.Header>
        <Card.Body>
          <Card.Text>
            Includes comprehensive business plan focused on funding. The business plan includes competitive landscape,
            marketing and sales general plan, milestones, industry trends and projections and more. They tend to be
            between 20-30 pages. They also include a pitch deck.
          </Card.Text>
        </Card.Body>
      </Card>
    </Page.Section>
    <Page.Section>
      <Card className="card-section">
        <Card.Header as="h1" className="text-center">
          Investor Deck and Plan
        </Card.Header>
        <Card.Body>
          <Card.Text>
            Includes competitive landscape, marketing and sales general plan, milestones, all financial statements,
            industry trends, investment thesis, business intelligence, predictive analytics, and more. They tend to be
            between 30-40 pages. The deck is specifically the focus for potential investors and will contain a majority
            of the business plan info as well. Our graphics will tie everything into your branding.
          </Card.Text>
        </Card.Body>
      </Card>
    </Page.Section>
    <Page.Section>
      <Card className="card-section">
        <Card.Header as="h1" className="text-center">
          Strategic Plan
        </Card.Header>
        <Card.Body>
          <Card.Text>
            Partnered with the board of directors and founder, the strategic plan comes together under the
            administration, direction and graphics of The Dates Group.
          </Card.Text>
        </Card.Body>
      </Card>
    </Page.Section>
    <Page.Section>
      <Card className="card-section">
        <Card.Header as="h1" className="text-center">
          Estate Plan
        </Card.Header>
        <Card.Body>
          <Card.Text>
            The complete estate planning package includes wills, trusts, powers-of-attorney, business
            powers-of-attorney, and physician directives.
          </Card.Text>
        </Card.Body>
      </Card>
    </Page.Section>
  </Page>

export default Planning
