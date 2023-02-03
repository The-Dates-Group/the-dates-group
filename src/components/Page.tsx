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
import type { ElementType, PropsWithChildren } from 'react'
import classNames from 'classnames'
import HeroImage from './HeroImage'
import { Container } from 'react-bootstrap'
import Head from 'next/head'

import styles from '@/styles/components/Page.module.scss'

export type PageProps = PropsWithChildren & {
  className?: string
  hero?: ElementType
  title?: string
}

const Page = (props: PageProps) =>
  <>
    {!props.title ? null : (
      <Head>
        <title>{props.title}</title>
      </Head>
    )}
    <main className={classNames(styles['page'], props.className)}>
      {!props.hero ? null : (
        <HeroImage>
          <props.hero/>
        </HeroImage>
      )}
      {props.children}
    </main>
  </>

export type PageSectionProps = PropsWithChildren & {
  className?: string
}

export const PageSection = (props: PageSectionProps) =>
  <Container as="section" className={classNames(styles['page-section'], props.className)}>
    {props.children}
  </Container>

export default Page
