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
import { createContext, Dispatch, PropsWithChildren, SetStateAction, useContext, useState } from 'react'
import globalAxios, { AxiosError, AxiosInstance, Method } from 'axios'
import { APIError } from '@/lib/common/data-types'

// Internals

const InternalContext = createContext<Requester>(undefined as unknown as Requester)

function useRequester(): Requester {
  const requester = useContext(InternalContext)
  if(typeof requester === 'undefined')
    throw new Error('Requester not defined! Did you forget to nest this inside a Requester.Provider?')
  return requester
}

class ResponseHookImpl<T> implements ResponseHook<T> {
  static incomplete = new ResponseHookImpl(false)

  private readonly _status?: number
  private readonly _body?: T
  private readonly _error?: APIError

  readonly isComplete: boolean

  constructor(isComplete: boolean, status?: number, data?: T | APIError) {
    this.isComplete = isComplete
    if(status != undefined) {
      this._status = status
      if(status > 399)
        this._error = data as APIError
      else
        this._body = data as T
    }
  }

  get status(): number {
    if(this._status != undefined)
      return this._status
    throw new Error('Request was not completed!')
  }

  get body(): T {
    if(this._body)
      return this._body
    throw new Error('Request was not completed or received an APIError!')
  }

  get error(): APIError {
    if(this._error)
      return this._error
    throw new Error('Request was not completed or received a response body!')
  }

  get isSuccess(): boolean {
    return this.status < 400
  }
}

class RequestHookImpl<B, T> implements RequestHook<B, T> {
  private readonly requester: Requester
  private readonly setResponse: Dispatch<SetStateAction<ResponseHook<T>>>
  readonly method: Method
  readonly url: string

  constructor(
    requester: Requester,
    setResponse: Dispatch<SetStateAction<ResponseHook<T>>>,
    method: Method,
    url: string
  ) {
    this.requester = requester
    this.setResponse = setResponse
    this.method = method
    this.url = url
  }

  exec(body?: B): Promise<ResponseHook<T>> {
    return this.requester.axios(this.url, { method: this.method, data: body })
      .then(({ status, data }) => new ResponseHookImpl<T>(true, status, data))
      .catch(error => {
        if(error instanceof AxiosError) {
          if(error.response) {
            const { status, data } = error.response
            return new ResponseHookImpl<T>(true, status, data)
          }
          console.error(`Received AxiosError but no response was attached:`, error)
        }
        return ResponseHookImpl.incomplete as ResponseHookImpl<T>
      })
      .then(responseHook => {
        this.setResponse(responseHook)
        return responseHook
      })
  }
}

// Types

export type RequestProviderProps = PropsWithChildren<{ axios?: AxiosInstance }>

export type RequestHookValue<B, T> = [request: RequestHook<B, T>, response: ResponseHook<T>]

// Interfaces

export interface RequestHook<B, T> {
  readonly method: Method
  readonly url: string

  exec(body?: B): Promise<ResponseHook<T>>
}

export interface ResponseHook<T> {
  readonly isComplete: boolean
  readonly isSuccess: boolean
  readonly status: number
  readonly body: T
  readonly error: APIError
}

// Context

export class Requester {
  readonly axios: AxiosInstance

  private constructor(axios?: AxiosInstance) {
    this.axios = axios || globalAxios
  }

  public static Provider = (props: RequestProviderProps) =>
    <InternalContext.Provider value={new Requester(props.axios)}>
      {props.children}
    </InternalContext.Provider>
}

// Module Default

export default function useRequest<B, T>(method: Method, url: string): RequestHookValue<B, T> {
  const requester = useRequester()
  const [response, setResponse] = useState<ResponseHook<T>>(ResponseHookImpl.incomplete as ResponseHook<T>)
  const request = new RequestHookImpl<B, T>(requester, setResponse, method, url)
  return [request, response]
}

// Shortcuts

export const useGET =
  <T extends object>(url: string): RequestHookValue<T, undefined> => useRequest('GET', url)

export const usePOST =
  <B extends object, T extends any = any>(url: string): RequestHookValue<B, T> => useRequest('POST', url)

export const useDELETE =
  <B extends any = any, T extends any = any>(url: string): RequestHookValue<B, T> => useRequest('DELETE', url)
