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

type FormSubmissionBody<F> = F & { 'form-name': string }

export type FormSubmissionState = {
  readonly isComplete: boolean
  readonly isSuccess?: boolean
}

export class FormSubmission<F> {
  private static config: AxiosRequestConfig = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }

  private readonly requester: Requester
  private readonly setState: Dispatch<SetStateAction<FormSubmissionState>>
  readonly name: string

  constructor(requester: Requester, setState: Dispatch<SetStateAction<FormSubmissionState>>, name: string) {
    this.requester = requester
    this.setState = setState
    this.name = name
  }

  submit(form: F): Promise<boolean> {
    const formSubmissionBody = { ...form, 'form-name': this.name } as FormSubmissionBody<F>
    return this.requester.axios.post('/', formSubmissionBody, FormSubmission.config)
      .then(response => {
        const isSuccess = response.status < 400
        if(!isSuccess)
          console.warn(`Form POST received non-success response: ${response.statusText}`)
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

export default function useFormSubmission<F>(name: string): [form: FormSubmission<F>, state: FormSubmissionState] {
  const requester = useRequester()
  const [state, setState] = useState<FormSubmissionState>({ isComplete: false })
  const form = new FormSubmission(requester, setState, name)
  return [form, state]
}
