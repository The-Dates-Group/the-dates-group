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
import React from 'react'
import Page from '../components/Page'
import { Button, Card, Col } from 'react-bootstrap'

const NotFoundPage = () =>
  <Page title="Not Found">
    <Page.Section withFade>
      <Card className="card-clear text-center text-md-start">
        <Card.Body className="ms-md-5">
          <Card.Title className="display-2">
            Not Found
          </Card.Title>
          <Card.Text className="fs-4">
            Looks like that page doesn't exist.
          </Card.Text>
          <Col xs={12} md={4} className="d-flex">
            <Button variant="dates-primary" href="/" className="flex-fill">
              Home
            </Button>
          </Col>
        </Card.Body>
      </Card>
    </Page.Section>
  </Page>

export default NotFoundPage
