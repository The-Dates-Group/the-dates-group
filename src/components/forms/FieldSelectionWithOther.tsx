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
import { ChangeEvent, PropsWithChildren, useRef, useState } from 'react'
import { Collapse, Form } from 'react-bootstrap'
import { useFormikContext } from 'formik'
import { FieldProp } from '@/components/forms/FieldProp'
import FieldControl, { FieldControlProps } from '@/components/forms/FieldControl'

export interface FieldSelectionWithOtherProps<F> extends PropsWithChildren, FieldProp<F>, FieldControlProps<F> {
  default: string
  options: string[]
}

export default function FieldSelectionWithOther<F>(props: FieldSelectionWithOtherProps<F>) {
  const { default: defaultOption, options, field, ...controlProps } = props
  const { values, touched, errors, ...formik } = useFormikContext<F>()
  const [otherSelected, setOtherSelected] = useState(false)
  const otherRef = useRef<HTMLOptionElement>(undefined as unknown as HTMLOptionElement)

  const handleOtherCollapseEntering = () => {
    formik.setFieldTouched(field, true)
    formik.setFieldValue(field, '', false)
  }

  const handleOtherCollapseExiting = () => {
    if(otherSelected) setOtherSelected(false)
  }

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const { selectedIndex, options } = event.currentTarget
    setOtherSelected(otherRef.current === options.item(selectedIndex))
    formik.handleChange(event)
  }

  const value = String(values[field])

  return <>
    <Form.Select
      name={field}
      className={otherSelected ? 'rounded-0 rounded-top' : undefined}
      onChange={handleSelectChange}
      onBlur={formik.handleBlur}
      isValid={options.includes(value) || (touched[field] && !errors[field])}
      isInvalid={touched[field] && !!errors[field]}
      value={value.length === 0 ? undefined : !options.includes(value) ? 'Other' : value}
    >
      <option hidden>{defaultOption}</option>
      {options.map(value =>
        <option key={value} value={value}>{value}</option>
      )}
      <option ref={otherRef}>Other</option>
    </Form.Select>
    <Collapse
      // open "Other" collapse if other field selected
      in={otherSelected && !options.includes(value)}
      onEntering={handleOtherCollapseEntering}
      onExiting={handleOtherCollapseExiting}>
      <div>
        <FieldControl<F> field={field} className="rounded-0 rounded-bottom" {...controlProps}/>
      </div>
    </Collapse>
  </>
}
