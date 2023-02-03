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
import { PropsWithChildren } from 'react'
import { Container, Fade } from 'react-bootstrap'
import classNames from 'classnames'

export type HeroImageProps = PropsWithChildren & { className?: string, noFade?: boolean }
const HeroImage = (props: HeroImageProps) =>
  <div className={classNames('hero-image', props.className)}>
    {!props.children || props.noFade ? props.children : (
      <Fade appear={true} in={true} timeout={1000}>
        <Container>
          {props.children}
        </Container>
      </Fade>
    )}
  </div>

export default HeroImage
