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

import { Suspense } from 'react'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import axios from 'axios'
import { SSRProvider } from '@react-aria/ssr'

// NOTE: global styles need to be delivered first!
import '@/styles/index.scss'

import { Requester } from '@/components/hooks/useRequest'
import SiteNavigation from '@/components/SiteNavigation'
import SiteFooter from '@/components/SiteFooter'
import LoadingSpinner from '@/components/LoadingSpinner'

import meta from '@/data/meta.json'

type AppHeadTagProps = { name: string, description: string, deploymentUrl: string, themeColor: string }
const AppHeadTag = (props: AppHeadTagProps) =>
  <Head>
    <meta charSet="utf-8"/>
    <link rel="icon" href="/favicon.ico"/>
    <link rel="apple-touch-icon" href="/images/logo/logo_192x192.png"/>
    <link rel="manifest" href="/manifest.json"/>
    <title>The Dates Group</title>

    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <meta name="theme-color" content={props.themeColor}/>
    <meta name="description" content={props.description}/>
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"/>

    <meta property="og:title" content={props.name}/>
    <meta property="og:type" content="website"/>
    <meta property="og:url" content={props.deploymentUrl}/>
    <meta property="og:image" content={`${props.deploymentUrl}/images/logo/logo_192x192.png`}/>
    <meta property="og:description" content={props.description}/>
    <meta property="og:site_name" content={props.name}/>

    <meta name="twitter:title" content={props.name}/>
    <meta name="twitter:card" content="summary_large_image"/>
    <meta name="twitter:site" content="@datesgroup"/>
    <meta name="twitter:creator" content="@datesgroup"/>
  </Head>

export default function App({ Component, pageProps }: AppProps) {
  const requester = axios.create({
    headers: {
      'Content-Type': 'Application/Json'
    }
  })

  return (
    <SSRProvider>
      <Requester.Provider axios={requester}>
        <AppHeadTag
          name={meta.name}
          description={meta.description}
          deploymentUrl={process.env.NODE_ENV === 'production' ? meta.publicUrl : 'http://localhost:3000'}
          themeColor={meta.themeColor}
        />
        <SiteNavigation>
          <SiteNavigation.Item href="/" label="Home"/>
          <SiteNavigation.Item href="/services" label="Services"/>
          <SiteNavigation.Item href="/contact" label="Contact"/>
          <SiteNavigation.Item href="/about-us" label="About Us"/>
          <SiteNavigation.Item href="/faqs" label="FAQs"/>
        </SiteNavigation>
        <Suspense fallback={<LoadingSpinner/>}>
          <Component {...pageProps}/>
        </Suspense>
        <SiteFooter/>
      </Requester.Provider>
    </SSRProvider>
  )
}
