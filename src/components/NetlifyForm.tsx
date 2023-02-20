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

import { FormSubmission } from '@/components/hooks/useFormSubmission'
import { AnyObject, ObjectSchema, SchemaDescription } from 'yup'

export type NetlifyFormField = {
  name: HTMLInputElement['name']
  type: HTMLInputElement['type']
}

export type NetlifyFormProps = {
  name: string
  fields: NetlifyFormField[]
}

export interface NetlifySchemaForm<F extends AnyObject> {
  name: string
  schema: ObjectSchema<F>
}

export default function NetlifyForm(props: NetlifyFormProps) {
  return (
    <form hidden name={props.name} data-netlify="true">
      <input type="hidden" name="form-name" value={props.name}/>
      {props.fields.map(field =>
        <input key={field.name} type={field.type} name={FormSubmission.formatFieldName(field.name)}/>
      )}
    </form>
  )
}

export function NetlifySchemaForm<F extends AnyObject>({ name, schema }: NetlifySchemaForm<F>) {
  return (
    <form hidden name={name} data-netlify="true">
      <input type="hidden" name="form-name" value={name}/>
      {Object.keys(schema.fields).map(key => {
        const description = schema.fields[key].describe() as SchemaDescription
        const meta = description.meta as any
        return <input
          key={key}
          type={meta ? meta['formType'] || 'text' : 'text'}
          name={FormSubmission.formatFieldName(key)}
        />
      })}
    </form>
  )
}
