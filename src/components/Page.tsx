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
import type { ElementType, ForwardedRef, PropsWithChildren } from 'react'
import { Component, forwardRef, useState } from 'react'
import classNames from 'classnames'
import { Container } from 'react-bootstrap'
import Head from 'next/head'
import HeroImage from '@/components/HeroImage'
import { FadeInOnPosition } from '@/components/helpers/waypoint-transitions'

type PageSectionContainerProps = PropsWithChildren<{ className?: string }>
const PageSectionContainer = forwardRef((props: PageSectionContainerProps, ref: ForwardedRef<any>) => (
  <Container as="section" className={classNames('my-auto', 'py-2', props.className)} ref={ref}>
    {props.children}
  </Container>
))

export type PageSectionProps = PageSectionContainerProps & {
  className?: string
  withFade?: boolean
}

export function PageSection({ withFade, children, ...containerProps }: PageSectionProps) {
  const [element, setElement] = useState<HTMLElement | null>(null)

  if(withFade) return (
    <FadeInOnPosition once element={element} options={{ rootMargin: { bottom: -200 } }}>
      <PageSectionContainer {...containerProps} ref={setElement}>
        {children}
      </PageSectionContainer>
    </FadeInOnPosition>
  )

  return <PageSectionContainer {...containerProps} ref={setElement}>{children}</PageSectionContainer>
}

export type PageProps = PropsWithChildren<{
  className?: string
  hero?: ElementType
  title?: string
}>

export default class Page extends Component<PageProps> {
  static displayName = 'Page'

  constructor(props: PageProps) {
    super(props)
  }

  render() {
    const { title, className, hero: Hero, children } = this.props
    return (
      <>
        {!title ? null : (
          <Head>
            <title>{title}</title>
          </Head>
        )}
        <main className={classNames('page', 'd-flex', 'flex-column', 'pb-2', className)}>
          {!Hero ? null : (
            <HeroImage>
              <Hero/>
            </HeroImage>
          )}
          {children}
        </main>
      </>
    )
  }

  static Section = PageSection
}

PageSection.displayName = 'PageSection'
PageSectionContainer.displayName = 'PageSectionContainer'
