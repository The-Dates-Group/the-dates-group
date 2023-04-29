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
import { useState } from 'react'
import { Card, Spinner } from 'react-bootstrap'
import IframeResizer from 'iframe-resizer-react'
import styles from '@/styles/components/ScheduleCalendar.module.scss'

export default function ScheduleCalendar() {
  const [state, setState] = useState({ loaded: false })
  const onIFrameLoaded = () => setState({ loaded: true })
  return <div className={styles['schedule-calendar']}>
    {/* Loading spinner present before iFrame loads */}
    {state.loaded ? null : (
      <div className={styles['iframe-loading-spinner']}>
        <Spinner animation="border"/>
      </div>
    )}
    <Card.Img
      // @ts-ignore
      warningTimeout={0}
      as={IframeResizer}
      title="calendar"
      autoResize={true}
      loading="lazy"
      checkOrigin={false} // maybe not the smartest idea to just not check, but I'll look into this later
      src="https://calendly.com/datesgroup"
      onLoad={onIFrameLoaded}
    />
  </div>
}
