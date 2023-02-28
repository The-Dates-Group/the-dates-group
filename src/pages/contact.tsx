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
import { useEffect, useState } from 'react'
import { Card, Nav, Tab } from 'react-bootstrap'
import Page from '@/components/Page'
import SignUpForNewsletterForm from '@/components/SignUpForNewsletterForm'
import ScheduleCalendar from '@/components/ScheduleCalendar'
import { useRouter } from 'next/router'

type TabKey = 'sign-up-for-newsletter' | 'schedule-a-call'

const tabs = [
  {
    title: 'Sign Up For Newsletter',
    key: 'sign-up-for-newsletter',
    Component: SignUpForNewsletterForm
  },
  {
    title: 'Schedule A Call',
    key: 'schedule-a-call',
    Component: ScheduleCalendar
  }
]

const defaultActiveKey: TabKey = 'sign-up-for-newsletter'

export default function ContactPage() {
  const { asPath } = useRouter()
  const [selectedKey, setSelectedKey] = useState<TabKey>(undefined as unknown as TabKey)
  useEffect(() => {
    if(typeof selectedKey === 'undefined') {
      const pathParts = asPath.split('#', 2)
      const activeKey = pathParts.length === 1 ?
        defaultActiveKey : pathParts[1] === 'sign-up-for-newsletter' || pathParts[1] === 'schedule-a-call' ?
          pathParts[1] : defaultActiveKey
      setSelectedKey(activeKey)
    }
  }, [asPath, selectedKey])

  const handleTabSelected = (key: string | null) =>
    setSelectedKey((key as TabKey | null) || defaultActiveKey)

  return (
    <Page title="Contact">
      <Page.Section>
        <Card className="card-section">
          <Tab.Container
            mountOnEnter={false}
            defaultActiveKey={defaultActiveKey}
            activeKey={selectedKey}
            onSelect={handleTabSelected}
            generateChildId={(eventKey, type) => `${eventKey}-${type}`}>
            <Nav fill variant="tabs" as="ul">
              {tabs.map(({ key, title }, index) =>
                <Nav.Item as="li" key={`tab-nav-${index}`} role="presentation">
                  <Nav.Link eventKey={key} as="button">{title}</Nav.Link>
                </Nav.Item>
              )}
            </Nav>
            <Tab.Content>
              {tabs.map(({ key, Component }, index) =>
                <Tab.Pane key={`tab-pane-${index}`} eventKey={key} transition={false}>
                  <Component/>
                </Tab.Pane>
              )}
            </Tab.Content>
          </Tab.Container>
        </Card>
      </Page.Section>
    </Page>
  )
}
