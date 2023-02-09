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

import { Fade, FadeProps } from 'react-bootstrap'
import { PropsWithChildren, useState } from 'react'
import useWaypoint, { Position, WaypointOptions } from '@restart/ui/useWaypoint'

type TransitionInOnPositionProps = PropsWithChildren & {
  readonly once?: boolean
  readonly options?: WaypointOptions
  readonly element: Element | null
}

type FadeInOnPositionProps = TransitionInOnPositionProps & FadeProps

export function FadeInOnPosition(
  { in: initiallyIn, element, once, children, options, ...fadeProps }: FadeInOnPositionProps) {
  const [fadedIn, setFadedIn] = useState(initiallyIn)

  useWaypoint(element, (details) => {
    if(details.position == Position.INSIDE) { // inside
      if(once && fadedIn) return // if only runs once and already faded in, return
      setFadedIn(true)
    } else if(!once && fadedIn) { // NOT inside, but NOT running once AND faded in
      setFadedIn(false)
    }
  }, options)

  return <Fade in={fadedIn} {...fadeProps}>{children}</Fade>
}
