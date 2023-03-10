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
import classNames from 'classnames'
import Image, { StaticImageData } from 'next/image'
import { Button, Card, Col, Collapse, Fade, Row } from 'react-bootstrap'
import { useMediaQueryMatches } from '@/components/hooks/useMediaQuery'
import { FadeInOnPosition } from '@/components/helpers/waypoint-transitions'
import { fromPrevState } from '@/utils/component-utils'

type TeamMemberImageProps = { src: StaticImageData, name: string, noLazy?: boolean }

const TeamMemberImage = (props: TeamMemberImageProps) =>
  <div className="mb-3 mb-lg-0 mx-1 mx-lg-0">
    <Image
      src={props.src}
      alt={`${props.name} photo`}
      className="card-img"
      priority={props.noLazy}
      loading={props.noLazy ? 'eager' : 'lazy'}/>
  </div>

type TeamMemberDescriptionProps = PropsWithChildren<{ occupation: string, element: Element | null }>
type TeamMemberDescriptionState = { subtitleFadedIn: boolean, collapsed: boolean }

function TeamMemberDescription(props: TeamMemberDescriptionProps) {
  const isBelowLg = useMediaQueryMatches()
  const [{ subtitleFadedIn, collapsed }, setState] = useState<TeamMemberDescriptionState>({
    subtitleFadedIn: isBelowLg,
    collapsed: true
  })
  const onSubtitleFadedIn = () => setState(fromPrevState({ subtitleFadedIn: true }))
  const onCollapseToggled = () => setState(fromPrevState(prevState => ({ collapsed: !prevState.collapsed })))
  return (
    <>
      <FadeInOnPosition
        once
        options={{ rootMargin: { top: -300, bottom: -300 } }}
        element={props.element}
        appear={!isBelowLg}
        in={isBelowLg}
        onEntered={onSubtitleFadedIn}
        timeout={600}>
        <Card.Subtitle
          as={isBelowLg ? 'div' : 'h3'}
          className={isBelowLg ? 'd-flex' : 'h5 fst-italic mb-2'}>
          {!isBelowLg ? props.occupation :
            <Button
              variant="dropdown"
              className={classNames('p-0 flex-fill', collapsed ? 'collapsed' : null)}
              onClick={onCollapseToggled}>
              <h3 className="h5 fst-italic mb-0">{props.occupation}</h3>
            </Button>
          }
        </Card.Subtitle>
      </FadeInOnPosition>
      <Fade appear={!isBelowLg} in={subtitleFadedIn} timeout={600}>
        <div>
          {!isBelowLg ? props.children :
            <Collapse appear={false} mountOnEnter={false} in={!isBelowLg || !collapsed}>
              <div className={isBelowLg ? 'mt-2' : undefined}>
                {props.children}
              </div>
            </Collapse>
          }
        </div>
      </Fade>
    </>
  )
}

export type TeamMemberCardLayout = 'image-left' | 'image-right'
export type TeamMemberCardProps = PropsWithChildren<{
  src: StaticImageData
  name: string
  noLazy?: boolean
  occupation: string
  direction: TeamMemberCardLayout
}>

export default function TeamMemberCard(props: TeamMemberCardProps) {
  const [element, setElement] = useState<HTMLDivElement | null>(null)
  return (
    <Card ref={setElement} className="card-team-member">
      <Card.Header>
        <Card.Title as="h2" className="mb-0">
          {props.name}
        </Card.Title>
      </Card.Header>
      <Card.Body className="rounded-bottom">
        <Row xs={1} lg={2} className={classNames(props.direction, 'align-items-center', 'flex-lg-row')}>
          <Col lg={props.direction === 'image-left' ? 5 : 7}>
            {props.direction === 'image-left' ?
              <TeamMemberImage src={props.src} name={props.name} noLazy={props.noLazy}/> :
              <TeamMemberDescription element={element} occupation={props.occupation}>
                {props.children}
              </TeamMemberDescription>
            }
          </Col>
          <Col lg={props.direction === 'image-right' ? 5 : 7}>
            {props.direction === 'image-right' ?
              <TeamMemberImage src={props.src} name={props.name} noLazy={props.noLazy}/> :
              <TeamMemberDescription element={element} occupation={props.occupation}>
                {props.children}
              </TeamMemberDescription>
            }
          </Col>
        </Row>
      </Card.Body>
    </Card>
  )
}
