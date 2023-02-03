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
import type { PropsWithChildren } from 'react'
import type { Service } from '@/pages/services'
import { Card } from 'react-bootstrap'

export type ServiceCardProps = PropsWithChildren & {
  service: Service
  height?: number | string
  width?: number | string
}

const ServiceCard = (props: ServiceCardProps) =>
  <Card className="card-service align-self-stretch flex-fill">
    <Card.Body className="d-flex">
      <Card.Title as="h2">
        <a href={props.service.href}>{props.service.title}</a>
      </Card.Title>
      <Card.Text>{props.children}</Card.Text>
    </Card.Body>
  </Card>

export default ServiceCard
