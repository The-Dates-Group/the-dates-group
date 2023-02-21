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
import type { FieldProp } from '@/components/forms/FieldProp'
import { useFormikContext } from 'formik'
import { Form } from 'react-bootstrap'
import YesNoController from '@/components/YesNoController'

export interface FieldYesNoProps<F> extends FieldProp<F> {
  label: string
  labelClassName?: string
}

export default function FieldYesNo<F>({ field, label, labelClassName }: FieldYesNoProps<F>) {
  const { values, touched, errors, ...formik } = useFormikContext<F>()

  const fieldValue = values[field]
  if(typeof fieldValue !== 'boolean')
    throw new Error('Field is not a boolean type!')

  const handleOnChange = (value: boolean) => {
    formik.setFieldValue(field, value, false)
    formik.setFieldTouched(field, true, true)
  }

  return <>
    <Form.Label className={labelClassName}>{label}</Form.Label>
    <YesNoController idPrefix={field} defaultValue={fieldValue} onExpand={handleOnChange}/>
  </>
}
