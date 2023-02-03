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

import { PropsWithChildren, useState } from 'react'
import { Container, Image, Nav, Navbar } from 'react-bootstrap'
import logo from '@/images/logo/logo.svg'

export type SiteNavigationItemProps = {
  href: string
  label: string
}

export const SiteNavigationItem = (props: SiteNavigationItemProps) =>
  <Nav.Item as="li" className="text-center">
    <Nav.Link href={props.href} rel="alternate" target="_self">
      {props.label}
    </Nav.Link>
  </Nav.Item>

export type SiteNavigationProps = PropsWithChildren

export default function SiteNavigation(props: SiteNavigationProps) {
  const [expanded, setExpanded] = useState(false)
  const toggleExpanded = () => expanded ? setExpanded(false) : setExpanded(true)
  return (
    <header className="sticky-top">
      <Navbar expand="md" variant="dark" className="dates-bg-primary" expanded={expanded}>
        <Container fluid>
          <Navbar.Brand href="/" className="d-flex align-items-center mx-0">
            <Image alt="logo" src={logo.src} height={40} width={40} className="navbar-brand-logo"/>
            <span className="h5 mx-1 my-0">The Dates Group</span>
          </Navbar.Brand>
          <Navbar.Toggle onClick={toggleExpanded}/>
          <Navbar.Collapse className="justify-content-end">
            <Nav as="ol">
              {props.children}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  )
}

SiteNavigation.Item = SiteNavigationItem
