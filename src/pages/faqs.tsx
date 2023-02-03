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
import Accordion from 'react-bootstrap/Accordion'
import Page, { PageSection } from '../components/Page'
import faqs from '@/data/faqs.json'
import { Card } from 'react-bootstrap'

const FAQs = () =>
  <Page title="FAQs">
    <PageSection>
      <Card className="card-clear">
        <Card.Header as="h1" className="text-center">
          Frequently Asked Questions
        </Card.Header>
        <Card.Body as={Accordion}>
          {faqs.map((value, index) =>
            <Accordion.Item eventKey={`item-${index}`} key={`item-${index}`}>
              <Accordion.Button>{value.question}</Accordion.Button>
              <Accordion.Body className="dates-bg-secondary-1">{value.answer}</Accordion.Body>
            </Accordion.Item>
          )}
        </Card.Body>
      </Card>
    </PageSection>
  </Page>

export default FAQs
