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

const Specializing = () =>
  <Page>
    <Page.Section>
      <Card className="card-section">
        <Card.Header as="h1" className="text-center">
          Janitorial Services Program
        </Card.Header>
        <Card.Body>
          <Card.Text>
            We know and understand the cleaning/janitorial industry. We can help you restructure and scale your business
            to increase your revenue! This program is ideal if you've been in business for a minimum of two years and
            are eligible for certification.
          </Card.Text>
          <Card.Text>
            Some elements of this program are...
          </Card.Text>
          <Card.Text as="ul">
            <li>Business Plan</li>
            <li>Pre-Certification Readiness</li>
            <li>Certification</li>
            <li>8A Program</li>
            <li>Business Operations Mentoring</li>
          </Card.Text>
        </Card.Body>
      </Card>
    </Page.Section>
    <Page.Section>
      <Card className="card-section">
        <Card.Header as="h1" className="text-center">
          Authors & Artists
        </Card.Header>
        <Card.Body>
          <Card.Text>
            We love helping creatives! This program is ideal for individuals
            who have been in business for a minimum of one year.
          </Card.Text>
          <Card.Text>
            Some elements of this program are...
          </Card.Text>
          <Card.Text as="ul">
            <li>Investor Deck and Plan</li>
            <li>Crowdfunding Campaign</li>
            <li>Business Operation Mentoring</li>
            <li>Grant Search</li>
          </Card.Text>
        </Card.Body>
      </Card>
    </Page.Section>
    <Page.Section>
      <Card className="card-section">
        <Card.Header as="h1" className="text-center">
          Consultant Growth Strategy Program
        </Card.Header>
        <Card.Body>
          <Card.Text>
            We know this business and what it takes to sustain and grow! We can help you restructure and scale your
            business to increase your revenue! This program requires a minimum of two years in business.
          </Card.Text>
          <Card.Text>
            Some elements of this program are...
          </Card.Text>
          <Card.Text as="ul">
            <li>Business Plan</li>
            <li>Business Operations Mentoring</li>
            <li>Pre-Certification</li>
            <li>Certification</li>
            <li>2-Hours of QuickBooks Training</li>
          </Card.Text>
        </Card.Body>
      </Card>
    </Page.Section>
    <Page.Section>
      <Card className="card-section">
        <Card.Header as="h1" className="text-center">
          Church Growth Program
        </Card.Header>
        <Card.Body>
          <Card.Text>
            We have experience in leadership programs to develop congregations and grow the church presence in the
            community. This particular program is very special to us and is pursued through prayer and a tender
            understanding of marrying the needs of the church with the needs of the community.
          </Card.Text>
          <Card.Text>
            We begin this program with an audit of many facets of the operation of your church. Upon completion of the
            audit, analysis, interviews and research, we will provide some of the following elements (based on client
            needs):
          </Card.Text>
          <Card.Text>
            General Marketing and Growth Plan, to include Event Planning Strategy, Congregation Development Strategy,
            Online Presence Recommendations, Community Plan, Christian Education Ministry and more, under the direction
            and according to the goals of the leadership of the church.
          </Card.Text>
        </Card.Body>
      </Card>
    </Page.Section>
    <Page.Section>
      <Card className="card-section">
        <Card.Header as="h1" className="text-center">
          Fitness Influencer Program
        </Card.Header>
        <Card.Body>
          <Card.Text>
            Fitness and Wellness Professionals, we specialize in helping you reach investors and programs designed to
            help you scale your business to increase your revenue! For this program, you should have a minimum of one
            year in business.
          </Card.Text>
          <Card.Text>
            Some of the elements of this program may include:
          </Card.Text>
          <Card.Text as="ul">
            <li>Investor Deck and Plan</li>
            <li>Business Operations Mentoring</li>
            <li>Pre-Certification</li>
            <li>Certification</li>
            <li>Grant Search</li>
          </Card.Text>
        </Card.Body>
      </Card>
    </Page.Section>
  </Page>

export default Specializing
