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
import { createContext, PropsWithChildren, useContext } from 'react'
import globalAxios, { AxiosInstance } from 'axios'

export type RequesterProviderProps = PropsWithChildren<{ axios?: AxiosInstance }>

// Internals

const InternalContext = createContext<Requester>(undefined as unknown as Requester)

// Context

export class Requester {
  readonly axios: AxiosInstance

  private constructor(axios?: AxiosInstance) {
    this.axios = axios || globalAxios
  }

  public static Provider = (props: RequesterProviderProps) =>
    <InternalContext.Provider value={new Requester(props.axios)}>
      {props.children}
    </InternalContext.Provider>
}

export default function useRequester(): Requester {
  const requester = useContext(InternalContext)
  if(typeof requester === 'undefined')
    throw new Error('Requester not defined! Did you forget to nest this inside a Requester.Provider?')
  return requester
}
