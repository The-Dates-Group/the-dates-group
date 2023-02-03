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
import { createContext, PropsWithChildren, ReactElement, useContext, useEffect, useState } from 'react'
import breakpoints, { Breakpoint, BreakpointName } from '@/utils/media-breakpoints'

type Boundary = 'max-width' | 'min-width'

const createMediaQuery = (boundary: Boundary, breakpoint: Breakpoint | BreakpointName): MediaQueryList => {
  if(typeof breakpoint === 'string')
    breakpoint = breakpoints[breakpoint]
  if(typeof window === 'undefined') return undefined as unknown as MediaQueryList
  return window.matchMedia(`(${boundary}: ${breakpoint}px)`)
}

const MediaQueryListContext = createContext(undefined as unknown as MediaQueryList)

export type MediaQueryProviderProps = PropsWithChildren<{ boundary: Boundary, breakpoint: Breakpoint | BreakpointName }>

class MediaQueryContext {
  static displayName = 'MediaQueryContext'
  readonly Provider: (props: MediaQueryProviderProps) => (ReactElement | null) = (props) => {
    const [mediaQuery, setMediaQuery] = useState<MediaQueryList>(undefined as unknown as MediaQueryList)
    useEffect(() => setMediaQuery(createMediaQuery(props.boundary, props.breakpoint)), [props])
    return (
      <MediaQueryListContext.Provider value={mediaQuery}>
        {props.children}
      </MediaQueryListContext.Provider>
    )
  }
}

export const MediaQuery = new MediaQueryContext()

export const useMediaQueryMatches = (): boolean => {
  const mediaQuery = useContext(MediaQueryListContext)
  return useMediaQuery(mediaQuery)
}

export const useMaxWidth = (breakpoint: Breakpoint | BreakpointName): boolean =>
  useMediaQuery(createMediaQuery('max-width', breakpoint))

export const useMinWidth = (breakpoint: Breakpoint | BreakpointName): boolean =>
  useMediaQuery(createMediaQuery('min-width', breakpoint))

export const useMediaQuery = (mediaQuery: MediaQueryList) => {
  const [isMatching, setIsMatching] = useState(typeof mediaQuery !== 'undefined' ? mediaQuery.matches : false)
  useEffect(() => {
    if(mediaQuery) {
      setIsMatching(mediaQuery.matches)
      const listener = (matches: MediaQueryListEvent) => setIsMatching(matches.matches)
      mediaQuery.addEventListener('change', listener)
      return () => mediaQuery.removeEventListener('change', listener)
    }
  }, [mediaQuery])
  return isMatching
}
