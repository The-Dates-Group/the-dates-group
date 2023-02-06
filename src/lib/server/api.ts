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
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import { APIError } from '@/lib/common/data-types'

const wrapRequest = <B>(req: NextApiRequest): APIRequest<B> => ({
  ...req,
  body: req.body as B,
  fail: (code: number, message: string): never => {
    throw new APIErrorImpl(code, message)
  }
}) as APIRequest<B>

const wrapResponse = <T>(res: NextApiResponse<T>): APIResponse<T> => ({
  ...res,
  status(statusCode) {
    return wrapResponse(res.status(statusCode))
  },
  redirect(urlOrStatus: string | number, url?: string): NextApiResponse<T> {
    if(typeof urlOrStatus === 'number') {
      if(!url) throw new Error('No URL specified!')
      return wrapResponse(res.redirect(urlOrStatus, url))
    }
    return wrapResponse(res.redirect(urlOrStatus))
  },
  finish() {
    res.send(undefined as unknown as T)
  }
}) as APIResponse<T>

class APIErrorImpl extends Error implements APIError {
  readonly code: number
  readonly message: string

  constructor(code: number, message: string) {
    super(message)
    this.code = code
    this.message = message
  }
}

export interface APIRequest<B extends any = any> extends NextApiRequest {
  readonly body: B

  fail(code: number, message: string): never
}

export interface APIResponse<T extends any = any> extends NextApiResponse<T> {
  status(statusCode: number): APIResponse<T>

  redirect(url: string): APIResponse<T>

  redirect(status: number, url: string): APIResponse<T>

  send(body: T): void

  finish(): void
}

export type APIMethod = 'GET' | 'POST' | 'DELETE'
export type APIMethodHandler<B, T> = { method: APIMethod, handler: NextApiHandler<T> }
export type APICheck<B, T> = (req: APIRequest<B>, res: APIResponse<T>) => boolean | Promise<boolean>
export type APICall<B, T> = (req: APIRequest<B>, res: APIResponse<T>) => unknown | Promise<unknown>
export type APIHandler<B, T> = APICheck<B, T> | APICall<B, T>

export const GET = <T, B = undefined>(...handlers: APIHandler<B, T>[]): APIMethodHandler<B, T> =>
  withMethod('GET', ...handlers)
export const POST = <B, T = undefined>(...handlers: APIHandler<B, T>[]): APIMethodHandler<B, T> =>
  withMethod('POST', ...handlers)
export const DELETE = <B = undefined, T = undefined>(...handlers: APIHandler<B, T>[]): APIMethodHandler<B, T> =>
  withMethod('DELETE', ...handlers)

export function withMethod<B, T>(method: APIMethod, ...handlers: APIHandler<B, T>[]): APIMethodHandler<B, T> {
  const checks = handlers.map<APICheck<B, T>>(value => {
    return async (req, res) => {
      const returningValue = await value(req, res)
      return typeof returningValue === 'boolean' ? returningValue : true
    }
  })
  const handler: NextApiHandler<T> = async (req, res) => {
    try {
      const wrappedReq = wrapRequest<B>(req)
      const wrappedRes = wrapResponse<T>(res)
      for(const check of checks) {
        // if check returns true, proceed to next check
        if(await check(wrappedReq, wrappedRes)) continue
        // if no longer writable, end this request
        if(res.writableEnded) break
      }
    } catch(e) {
      let errorPayload: APIError
      if(e instanceof APIErrorImpl) {
        console.warn(`APIError thrown: ${e.code} - ${e.message}`)
        errorPayload = { code: e.code, message: e.message }
      } else {
        console.error(`Internal Server Error: ${e}`)
        errorPayload = { code: 500, message: 'Internal Server Error' }
      }
      res.status(errorPayload.code).send(errorPayload as T)
    } finally {
      // if not ended, automatically close
      if(!res.writableEnded) res.end()
    }
  }
  return { method, handler }
}

export function withMethods(...handlers: APIMethodHandler<any, any>[]): NextApiHandler {
  const map = {} as { [key: string]: APICall<any, any> | undefined }
  for(const handler of handlers)
    map[handler.method] = handler.handler
  return (req, res) => {
    if(req.method) {
      const handler = map[req.method]
      if(handler) {
        const wrappedReq = wrapRequest(req)
        const wrappedRes = wrapResponse(res)
        return handler(wrappedReq, wrappedRes)
      }
    }
    res.status(404).send({ code: 404, message: 'Not Found' })
  }
}
