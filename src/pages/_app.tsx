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

import type { AppProps } from 'next/app'
import Head from 'next/head'
import axios from 'axios'
import { SSRProvider } from '@react-aria/ssr'

// NOTE: global styles need to be delivered first!
import '@/styles/index.scss'

import { Requester } from '@/components/hooks/useRequester'
import SiteNavigation from '@/components/SiteNavigation'
import SiteFooter from '@/components/SiteFooter'

import meta from '@/data/meta.json'
import { ErrorBoundary } from 'next/dist/client/components/error-boundary'
import Page from '@/components/Page'
import { Card } from 'react-bootstrap'

type PageMetaData = {
  readonly name?: string
  readonly description?: string
}

type AppStaticProps = PageMetaData

const ErrorPage = (props: { error: Error }) => {
  console.log(props.error)
  return (
    <Page>
      <Page.Section>
        <Card className="card-clear">
          <Card.Header>
            <Card.Title as="h1">Something went wrong...</Card.Title>
          </Card.Header>
          <Card.Body>
            <Card.Text>Looks like something went wrong:</Card.Text>
            <Card.Text as="code">
              {props.error.message}
            </Card.Text>
          </Card.Body>
        </Card>
      </Page.Section>
    </Page>
  )
}

export default function App({ Component, pageProps }: AppProps<AppStaticProps>) {
  // const router = useRouter()
  const requester = axios.create({
    headers: {
      'Content-Type': 'application/json'
    }
  })

  const isProduction = process.env.NODE_ENV === 'production'
  const pageName = pageProps.name || meta.name
  const pageDescription = pageProps.description || meta.description
  const deploymentUrl = isProduction ? meta.publicUrl : ''
  const themeColor = meta.themeColor

  return (
    <SSRProvider>
      <Requester.Provider axios={requester}>
        <Head>
          <meta charSet="utf-8"/>
          <link rel="icon" href="/favicon.ico"/>
          <link rel="apple-touch-icon" href="/images/logo/logo_192x192.png"/>
          <link rel="manifest" href="/manifest.json"/>
          {/* TODO might be worth uncommenting later {isProduction && <link rel="canonical" href={deploymentUrl + router.pathname}/>}*/}
          <title>The Dates Group</title>

          <meta name="viewport" content="width=device-width, initial-scale=1"/>
          <meta name="theme-color" content={themeColor}/>
          <meta name="description" content={pageDescription}/>
          <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"/>

          <meta property="og:title" content={pageName}/>
          <meta property="og:type" content="website"/>
          <meta property="og:url" content={deploymentUrl}/>
          <meta property="og:image" content={`${deploymentUrl}/images/logo/logo_192x192.png`}/>
          <meta property="og:description" content={pageDescription}/>
          <meta property="og:site_name" content={pageName}/>

          <meta name="twitter:title" content={pageName}/>
          <meta name="twitter:card" content="summary_large_image"/>
          <meta name="twitter:site" content="@datesgroup"/>
          <meta name="twitter:creator" content="@datesgroup"/>
        </Head>
        <SiteNavigation>
          <SiteNavigation.Item href="/" label="Home"/>
          <SiteNavigation.Item href="/services" label="Services"/>
          <SiteNavigation.Item href="/contact" label="Contact"/>
          <SiteNavigation.Item href="/about-us" label="About Us"/>
          <SiteNavigation.Item href="/faqs" label="FAQs"/>
        </SiteNavigation>
        <ErrorBoundary errorComponent={ErrorPage}>
          <Component {...pageProps}/>
        </ErrorBoundary>
        <SiteFooter/>
      </Requester.Provider>
    </SSRProvider>
  )
}
