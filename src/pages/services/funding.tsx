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
import { Card, Col } from 'react-bootstrap'
import VerticallyRuled from '@/components/VerticallyRuled'

const Funding = () =>
  <Page>
    <Page.Section withFade>
      <Col xs={9} className="me-auto">
        <Card className="card-clear">
          <Card.Header className="text-center">
            <Card.Title className="mb-0" as="h1">
              Grants Made Easy
            </Card.Title>
          </Card.Header>
          <Card.Body>
            <Card.Text>
              This service will include foundation, federal, and state grant-writing. We have three grant writers with
              different areas of specialty who will provide a scope of work to the client prior to accepting the task.
              In that scope of work, we will estimate the number of hours we expect to work for the grants selected for
              or by the client.
            </Card.Text>
            <VerticallyRuled
              className="card-text"
              vrClassName="dates-bg-primary-1"
              innerAs="p"
              innerClassName="dates-bg-primary-4 dates-text-light">
              We have a 3-grant minimum, although in rare cases, there may be an exception.
            </VerticallyRuled>
          </Card.Body>
        </Card>
      </Col>
    </Page.Section>
    <Page.Section withFade>
      <Col xs={9} className="ms-auto">
        <Card className="card-clear">
          <Card.Header className="text-center">
            <Card.Title className="mb-0" as="h1">
              Get Funded!
            </Card.Title>
          </Card.Header>
          <Card.Body>
            <Card.Text>
              Crowdfunding is very popular these days. As a process of raising money to fund a charitable cause,
              crowdfunding can help fund startups and businesses. We will assist with the written portion of the
              campaign. The marketing plan for the campaign will be discussed and coordinated to ensure the writing
              effort can garner the maximum outcome.
            </Card.Text>
          </Card.Body>
        </Card>
      </Col>
    </Page.Section>
  </Page>

export default Funding
