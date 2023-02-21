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

const Launching = () =>
  <Page>
    <Page.Section>
      <Card className="card-section">
        <Card.Header as="h1" className="text-center">
          Ready. Set. Launch!
        </Card.Header>
        <Card.Body>
          <Card.Text>
            Comprehensive and complete bundled package to take your business from zero-to-launch successfully and
            compliantly.
          </Card.Text>
          <Card.Text>
            The program is based on client needs and business structure. Some typical elements included are the
            following:
          </Card.Text>
          <Card.Text as="ul">
            <li>Register Business</li>
            <li>DBA/Assumed Name</li>
            <li>LLC Operating Agreement or Bylaws</li>
            <li>Domain and Email</li>
            <li>Introductory Guidance for Business Banking, Insurance, Technology and Accounting</li>
            <li>Credit Readiness Guidance</li>
            <li>Pre-Certification Readiness (SAM.gov/UEI/Cage #)</li>
          </Card.Text>
        </Card.Body>
      </Card>
    </Page.Section>
    <Page.Section>
      <Card className="card-section">
        <Card.Header as="h1" className="text-center">
          60-Day Nonprofit Launch
        </Card.Header>
        <Card.Body>
          <Card.Text>
            Comprehensive bundled package to create a 501C3 compliantly and prepare for sustainability.
          </Card.Text>
          <Card.Text>
            Includes:
          </Card.Text>
          <Card.Text as="ul">
            <li>
              Guidance with Mission/Vision, Robert’s Rules, Business Licensing,
              Banking, Insurance, Sam.Gov Registration, NTEE codes and Pitch.
            </li>
            <li>Application for 501C3, along with State-specific registrations and compliance.</li>
            <li>
              Our highly effective and very successful Board Development and Compliance Training
              for Founders and their Board of Directors, delivered in 4 sessions.
            </li>
          </Card.Text>
        </Card.Body>
      </Card>
    </Page.Section>
  </Page>

export default Launching
