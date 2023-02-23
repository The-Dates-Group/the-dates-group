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
import { ChangeEventHandler, FocusEventHandler, useEffect, useRef } from 'react'
import { Form, FormControlProps } from 'react-bootstrap'
import { useFormikContext } from 'formik'
import type { FieldProp } from '@/components/forms/FieldProp'

export interface FieldControlProps<F> extends FieldProp<F>, FormControlProps {
  overrideOnChange?: boolean
  overrideOnBlur?: boolean
}

export type FieldPhoneControlProps<F> =
  Omit<FieldControlProps<F>, keyof 'as' | 'type' | 'overrideOnChange' | 'overrideOnBlur'>

export type FieldFileControlProps<F> =
  Omit<FieldControlProps<F>, keyof 'as' | 'type' | 'overrideOnChange' | 'overrideOnBlur'>

export default function FieldControl<F>(props: FieldControlProps<F>) {
  const { field, overrideOnChange, overrideOnBlur, onChange, onBlur, isValid, isInvalid, ...controlProps } = props
  const { values, touched, errors, ...formik } = useFormikContext<F>()

  const handleChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> | undefined =
    overrideOnChange ? onChange : (e) => {
      if(onChange) onChange(e)
      formik.handleChange(e)
    }

  const handleBlur: FocusEventHandler<HTMLInputElement | HTMLTextAreaElement> | undefined =
    overrideOnBlur ? onBlur : (e) => {
      if(onBlur) onBlur(e)
      formik.handleBlur(e)
    }

  return <Form.Control
    {...controlProps}
    name={field}
    value={String(values[field])}
    onChange={handleChange}
    onBlur={handleBlur}
    isValid={isValid || (touched[field] && !errors[field])}
    isInvalid={isInvalid || (touched[field] && !!errors[field])}
  />
}

export function FieldFileControl<F>(props: FieldFileControlProps<F>) {
  const { field, onChange, onBlur, isValid, isInvalid, ...controlProps } = props
  const { values, touched, errors, ...formik } = useFormikContext<F>()
  const controlRef = useRef(undefined as unknown as HTMLInputElement)

  const fieldValue = values[field]

  useEffect(() => {
    if(fieldValue === null)
      controlRef.current.value = null as unknown as string
  }, [fieldValue, controlRef])

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    if(onChange) onChange(e)
    const file = e.target.files?.item(0) || null
    formik.setFieldValue(field, file, false)
    formik.setFieldTouched(field, true, true)
  }

  const handleBlur: FocusEventHandler<HTMLInputElement> = (e) => {
    if(onBlur) onBlur(e)
    formik.handleBlur(e)
  }

  return <Form.Control
    {...controlProps}
    ref={controlRef}
    name={field}
    type="file"
    onChange={handleChange}
    onBlur={handleBlur}
    isValid={isValid || (values[field] !== null && touched[field] && !errors[field])}
    isInvalid={isInvalid || values[field] === null || (touched[field] && !!errors[field])}
  />
}
