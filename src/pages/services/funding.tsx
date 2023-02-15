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
import { Card } from 'react-bootstrap'
import Page from '@/components/Page'
import VerticallyRuled from '@/components/VerticallyRuled'
import BusinessPlanForm from '@/components/BusinessPlanForm'

const Funding = () =>
  <Page>
    <Page.Section>
      <Card className="card-section">
        <Card.Header as="h1" className="text-center">
          Grants
        </Card.Header>
        <Card.Body>
          <section>
            <Card.Subtitle as="h2" className="mb-2 fs-4">
              We strive to provide you the grants your business needs!
            </Card.Subtitle>
            <Card.Text>
              The Dates Group will set you up with one of our expert grant writers. They will review the grants selected
              during the grant search. Based on the requirements of each grant, they will provide a "scope of work,"
              which will include an estimate of how many hours it should take to write a proposal. Upon your approval,
              you will be invoiced for the first half of the estimate. When the grant writing is completed, approved by
              you, and ready for submission, you will be billed for the remainder of the hours.
            </Card.Text>
            <Card.Text
              as={VerticallyRuled}
              className="mb-4 mx-auto w-75"
              vrClassName="dates-bg-primary-1"
              innerAs="p"
              innerClassName="dates-bg-primary-4 dates-text-light">
              The grant search process will take anywhere from 4 to 6 hours of searches for grants through paid grant
              databases, government databases and foundations.
            </Card.Text>
          </section>
          <section>
            <Card.Subtitle as="h2" className="mb-2 fs-4">
              You can count on us!
            </Card.Subtitle>
            <Card.Text>
              The Dates Group prides itself on being long-term members of the largest professional association in the
              grant profession, the Grant Professionals Association. You can be sure that we stay up-to-date on
              professional standards and best practices in the industry. We are also proud to announce that our grant
              writers are officers on the Board of Directors for the Chicago chapter of the GPA.
            </Card.Text>
            <Card.Text>
              Through our long-standing membership with the Association of Fundraising Professionals, we have ongoing
              access to many professional fundraising courses. We stay connected and continuously network with other
              fundraising professionals.
            </Card.Text>
            <Card.Text as="blockquote" className="mx-auto w-75 justify-content-center">
              "The AFP’s Code of Ethics is the only enforceable code in the sector, which every member must sign
              each year and adhere to its standards and practices."
              <a className="quoted stretched-link" href="https://afpglobal.org/" target="_blank" rel="noreferrer">
                AFPGlobal
              </a>
            </Card.Text>
            <Card.Text>
              You can feel confident knowing that the accountability for members of the AFP is serious and enforced.
            </Card.Text>
          </section>
        </Card.Body>
      </Card>
    </Page.Section>
    <Page.Section>
      <Card className="card-section">
        <Card.Header as="h1" className="text-center">
          Crowdfunding
        </Card.Header>
        <Card.Body>
          <Card.Subtitle as="h2" className="mb-2 fs-4">
            Tested and proven strategies!
          </Card.Subtitle>
          <Card.Text>
            The Dates Group understands that crowdfunding is very popular these days. As a process of raising money
            to fund a charitable cause, crowdfunding can help fund startups and businesses. We will assist with the
            written portion of the campaign, discussing and coordinating a marketing strategy to ensure you get the
            most out of your crowdfunding!
          </Card.Text>
        </Card.Body>
      </Card>
    </Page.Section>
    <Page.Section>
      <Card className="card-section">
        <Card.Header as="h1" className="text-center">
          Certifications
        </Card.Header>
        <Card.Body>
          <Card.Subtitle as="h2" className="mb-2 fs-4">
            We'll eliminate the confusion with certifications!
          </Card.Subtitle>
          <Card.Text>
            Certifications provide access to corporate and government contracts and bids. The process can be tedious,
            to
            say the least. Here at The Dates Group, we not only help you become certified, we also walk you through
            the
            process of pre-certification. We ensure that you know your next steps once your certification is approved.
            We’re able to guide you as to which certifying agency is best suited for you and your industry.
          </Card.Text>
          <Card.Text>
            We work extensively with the following certifications:
          </Card.Text>
          <Card.Text as="ul">
            <li>Minority-Owned</li>
            <li>Women-Owned</li>
            <li>Veteran-Owned</li>
            <li>Disabled Veteran-Owned</li>
            <li>LGBTQ-Owned</li>
          </Card.Text>
        </Card.Body>
      </Card>
    </Page.Section>
    <Page.Section>
      <Card className="card-section">
        <Card.Header as="h1" className="text-center">
          Form
        </Card.Header>
        <BusinessPlanForm/>
      </Card>
    </Page.Section>
  </Page>

export default Funding
