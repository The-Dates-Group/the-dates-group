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
import { lazy, Suspense, useEffect, useState } from 'react'
import { Card, Nav, Tab } from 'react-bootstrap'
import Page, { PageSection } from '@/components/Page'
import LoadingSpinner from '@/components/LoadingSpinner'

type TabKey = 'send-a-message' | 'schedule-a-call'

const defaultKey = (): TabKey => {
  switch(document.location.hash.toLowerCase()) {
    case '#schedule-a-call':
      return 'schedule-a-call'
    case '#send-a-message':
    default:
      return 'send-a-message'
  }
}

const tabs = [
  {
    title: 'Send A Message',
    key: 'send-a-message',
    render: lazy(() => import('@/components/MessageUsForm'))
  },
  {
    title: 'Schedule A Call',
    key: 'schedule-a-call',
    render: lazy(() => import('@/components/ScheduleCalendar'))
  }
]

export default function ContactPage() {
  const [key, setKey] = useState<TabKey>(undefined as unknown as TabKey)
  useEffect(() => {
    if(!key) setKey(defaultKey())
  }, [key])

  const handleTabSelected = (key: string | null) => setKey((key as TabKey | null) || defaultKey())

  return (
    <Page title="Contact">
      <PageSection>
        <Card className="card-clear">
          <Tab.Container
            activeKey={key}
            onSelect={handleTabSelected}
            generateChildId={(eventKey, type) => `${eventKey}-${type}`}>
            <Nav fill variant="tabs" as="ul">
              {tabs.map((tab, index) => (
                <Nav.Item key={`tab-nav-${index}`} as="li" role="presentation">
                  <Nav.Link eventKey={tab.key} as="button">{tab.title}</Nav.Link>
                </Nav.Item>
              ))}
            </Nav>
            <Tab.Content>
              {tabs.map((tab, index) => (
                <Tab.Pane active={key === tab.key} key={`tab-pane-${index}`} eventKey={tab.key}>
                  <Suspense fallback={<LoadingSpinner className="message-us-form"/>}>
                    <tab.render/>
                  </Suspense>
                </Tab.Pane>
              ))}
            </Tab.Content>
          </Tab.Container>
        </Card>
      </PageSection>
    </Page>
  )
}
