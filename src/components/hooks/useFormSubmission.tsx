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
import useRequester, { Requester } from '@/components/hooks/useRequester'
import { Dispatch, SetStateAction, useState } from 'react'
import { AxiosRequestConfig } from 'axios'

export type FormSubmissionState = {
  readonly isComplete: boolean
  readonly isSuccess: boolean
}

export class FormSubmission<F extends object> {
  private static config: AxiosRequestConfig = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }

  private readonly requester: Requester
  private readonly setState: Dispatch<SetStateAction<FormSubmissionState>>
  private readonly formatFieldNames?: (property: string) => string

  readonly name: string

  constructor(
    requester: Requester,
    setState: Dispatch<SetStateAction<FormSubmissionState>>,
    name: string,
    formatFieldNames?: (property: string) => string
  ) {
    this.requester = requester
    this.setState = setState
    this.name = name
    this.formatFieldNames = formatFieldNames
  }

  submit(form: F): Promise<boolean> {
    const body = { 'form-name': this.name } as any
    Object.keys(form).forEach(key => {
      const value = (form as any)[key]
      const bodyKey = this.formatFieldNames ? this.formatFieldNames(key) : key
      body[bodyKey] = value
    })
    console.debug('Sending form:', body)
    return this.requester.axios.post('/', body, FormSubmission.config)
      .then(response => {
        const isSuccess = response.status < 400
        if(!isSuccess) console.warn(`Form POST received non-success response: ${response.statusText}`)
        return isSuccess
      })
      .catch(e => {
        console.error('An error occurred while submitting form:', e)
        return false
      })
      .then(isSuccess => {
        this.setState({ isComplete: true, isSuccess })
        return isSuccess
      })
  }
}

export default function useFormSubmission<F extends object>(
  name: string,
  formatFieldNames?: (property: string) => string
): [form: FormSubmission<F>, state: FormSubmissionState] {
  const requester = useRequester()
  const [state, setState] = useState<FormSubmissionState>({ isComplete: false, isSuccess: false })
  const form = new FormSubmission(requester, setState, name, formatFieldNames)
  return [form, state]
}
