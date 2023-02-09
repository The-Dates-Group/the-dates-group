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
import { useIsSSR } from '@react-aria/ssr'

const InternalContext = createContext<NetlifyForm<any>>(undefined as unknown as NetlifyForm<any>)

function FauxForm() {
  const form = useNetlifyForm()
  return (
    <form data-netlify="true" hidden>
      <input type="hidden" name="form-name" value={form.name}/>
      {form.fields.map((value, index) => <input key={`field-${index}`} name={value.name} type={value.type}/>)}
    </form>
  )
}

export type NetlifyFormField = {
  readonly type: string
  readonly name: string
}

export type NetlifyFormInfo<F extends NetlifyFormField> = {
  readonly name: string
  readonly fields: F[]
}

export type NetlifyFormProviderProps<F extends NetlifyFormField> = PropsWithChildren<NetlifyFormInfo<F>>

export class NetlifyForm<F extends NetlifyFormField> implements NetlifyFormInfo<F> {
  readonly name: string
  readonly fields: F[]

  private constructor({ fields, name }: NetlifyFormInfo<F>) {
    this.name = name
    this.fields = fields
  }

  static Provider = <F extends NetlifyFormField>(props: NetlifyFormProviderProps<F>) => {
    const isSSR = useIsSSR()
    return (
      <InternalContext.Provider value={new NetlifyForm(props)}>
        <FauxForm/>
        {isSSR ? null : props.children}
      </InternalContext.Provider>
    )
  }
}

export function useNetlifyFormField<F extends NetlifyFormField>(index: number): F {
  const form = useNetlifyForm<F>()
  return form.fields[index]
}

export default function useNetlifyForm<F extends NetlifyFormField>(): NetlifyForm<F> {
  return useContext(InternalContext) as NetlifyForm<F>
}
