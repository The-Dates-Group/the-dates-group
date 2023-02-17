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

const convertValueForFormSubmission = (value: any, allowFiles: boolean): any => {
  if(Array.isArray(value)) return value.map(item => convertValueForFormSubmission(item, allowFiles)).join(', ')
  switch(typeof value) {
    case 'undefined':
      return 'None'
    case 'object':
      if(value === null) return 'None'
      if(value instanceof File) {
        if(!allowFiles) throw new Error('Attempted to convert file value where files are not allowed!')
        return value
      }
      return JSON.stringify(value)
    case 'string':
      return value
    case 'boolean':
      return value ? 'Yes' : 'No'
    default:
      return String(value)
  }
}

export type FormContentType = 'application/x-www-form-urlencoded' | 'multipart/form-data'

export type FormSubmissionState = {
  readonly isComplete: boolean
  readonly isSuccess: boolean
}

export class FormSubmission<F extends object> {
  private readonly requester: Requester
  private readonly setState: Dispatch<SetStateAction<FormSubmissionState>>
  private readonly contentType: FormContentType

  readonly name: string

  constructor(
    requester: Requester,
    setState: Dispatch<SetStateAction<FormSubmissionState>>,
    name: string,
    contentType: FormContentType
  ) {
    this.requester = requester
    this.setState = setState
    this.name = name
    this.contentType = contentType
  }

  submit(form: F): Promise<boolean> {
    const body = this.contentType === 'application/x-www-form-urlencoded' ?
      this.createFormUrlEncoded(form) :
      this.createFormData(form)
    console.debug('Sending form:', body)
    return this.requester.axios.post('/', body, { headers: { 'Content-Type': this.contentType } })
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

  private createFormUrlEncoded(form: F): any {
    const body = { 'form-data': this.name } as any
    for(const key of Object.keys(form)) {
      const value = convertValueForFormSubmission((form as any)[key], false)
      const formattedKey = FormSubmission.formatFieldName(key)
      body[formattedKey] = value
    }
    return body
  }

  private createFormData(form: F): FormData {
    const formData = new FormData()
    // append form name
    formData.append('form-name', this.name)
    // for each key of form object
    for(const key of Object.keys(form)) {
      const formValue = convertValueForFormSubmission((form as any)[key], true)
      const formKey = FormSubmission.formatFieldName(key)
      if(formValue instanceof File) {
        formData.append(formKey, formValue, formValue.name)
      } else {
        formData.append(formKey, formValue)
      }
    }
    return formData
  }

  static formatFieldName(name: string) {
    const charArray = []
    let lastWasUppercase = false
    for(let i = 0; i < name.length; i++) {
      const char = name[i]

      // first char is always uppercase
      if(i === 0) {
        charArray.push(char.toUpperCase())
        continue
      }

      // char is uppercase
      if(char === char.toUpperCase()) {
        if(!lastWasUppercase) {
          charArray.push(' ')
          lastWasUppercase = true
        }
        charArray.push(char)
        continue
      }
      lastWasUppercase = false
      charArray.push(char)
    }
    return charArray.join('')
  }
}

export default function useFormSubmission<F extends object>(
  name: string,
  contentType: FormContentType = 'application/x-www-form-urlencoded'
): [form: FormSubmission<F>, state: FormSubmissionState] {
  const requester = useRequester()
  const [state, setState] = useState<FormSubmissionState>({ isComplete: false, isSuccess: false })
  const form = new FormSubmission(requester, setState, name, contentType)
  return [form, state]
}
