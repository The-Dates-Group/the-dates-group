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
import type { PropsWithChildren, ReactElement } from 'react'
import { Col, Container, Nav, Row } from 'react-bootstrap'
import socials from '@/utils/constants/socials'
import styles from '@/styles/components/SiteFooter.module.scss'

type FooterLinkCategoryProps = PropsWithChildren & {
  title: string
}

type FooterLinkProps = {
  rel?: string
  icon?: ReactElement
  href: string
  label: string
  target?: string
}

const FooterLinkCategory = (props: FooterLinkCategoryProps) =>
  <Col>
    {/* use span with h5 class help with assistive technologies */}
    <span className="h5">{props.title}</span>
    <Nav as="ol" className="flex-column mt-2">
      {props.children}
    </Nav>
  </Col>

const FooterLink = (props: FooterLinkProps) =>
  <Nav.Item as="li" className={styles['footer-item']}>
    <Nav.Link href={props.href} className={styles['footer-link']} rel={props.rel} target={props.target}>
      {props.icon}
      {props.label}
    </Nav.Link>
  </Nav.Item>

const SiteFooter = () =>
  <Container fluid as="footer" className={styles['site-footer']}>
    <Row>
      <Col xs={12} sm={6} md={7} xl={8} xxl={9} className="mb-4 mb-sm-0">
        <span className="h5">Business Hours (CST)</span>
        <Row className="align-items-center">
          <Col xs="auto">M, T, Th</Col>
          <Col>8:30 AM - 6:30 PM</Col>
        </Row>
        <Row className="align-items-center">
          <Col xs="auto">Sat, Sun</Col>
          <Col>9:00 AM - 1:00 PM</Col>
        </Row>
      </Col>
      <FooterLinkCategory title="Links">
        <FooterLink href="/" label="Home" rel="alternate"/>
        <FooterLink href="/services" label="Services" rel="alternate" target="_self"/>
        <FooterLink href="/contact" label="Contact" rel="alternate" target="_self"/>
        <FooterLink href="/about-us" label="About Us" rel="alternate" target="_self"/>
        <FooterLink href="/faqs" label="FAQs" rel="alternate" target="_self"/>
      </FooterLinkCategory>
      <FooterLinkCategory title="Social Media">
        {socials.map(({ link, type, BsIcon }) =>
          <FooterLink
            rel="me"
            target="_blank"
            key={`link-${type}`}
            href={link}
            label={type}
            icon={BsIcon ? <BsIcon className="me-2"/> : undefined}
          />
        )}
      </FooterLinkCategory>
    </Row>
  </Container>

export default SiteFooter
