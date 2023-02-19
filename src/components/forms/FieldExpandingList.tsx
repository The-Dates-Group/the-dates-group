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
import { ChangeEvent } from 'react'
import { Button, Form, InputGroup } from 'react-bootstrap'
import { useFormikContext } from 'formik'
import { FieldProp } from '@/components/forms/FieldProp'
import FieldInvalidFeedbackCollapse from '@/components/forms/FieldInvalidFeedbackCollapse'

export interface FieldExpandingListProps<F> extends FieldProp<F> {
  addButtonLabel?: string
  removeButtonLabel?: string
  withInvalidFeedback?: boolean
  placeholder: string
}

export default function FieldExpandingList<F>(props: FieldExpandingListProps<F>) {
  const { field, addButtonLabel, removeButtonLabel, withInvalidFeedback, placeholder } = props
  const { values, touched, errors, ...formik } = useFormikContext<F>()

  const currentField = values[field]

  if(!Array.isArray(currentField)) throw new Error('Field was not an array!')

  const createChangeHandler = (index: number) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const currentField = values[field] as Array<string>
    currentField[index] = event.target.value
    formik.setFieldValue(field, currentField, false)
    formik.setFieldTouched(field, true, true)
  }

  const createRemoveButtonClickHandler = (index: number) => () => {
    const currentField = values[field] as Array<string>
    const filtered = currentField.filter((_, i) => i !== index)
    formik.setFieldValue(field, filtered, false)
    formik.setFieldTouched(field, true, true)
  }

  const handleAddButtonClick = () => {
    const currentField = values[field] as Array<string>
    currentField.push('')
    formik.setFieldValue(field, currentField, false)
    formik.setFieldTouched(field, true, true)
  }

  return <>
    {currentField.map((value, index) => (
      <InputGroup hasValidation className="mb-1" key={`${field}-item-index-${index}`}>
        <Button variant="dates-primary" onClick={createRemoveButtonClickHandler(index)}>
          {removeButtonLabel || 'Remove'}
        </Button>
        <Form.Control
          name={field}
          value={value}
          placeholder={placeholder}
          onChange={createChangeHandler(index)}
          onBlur={formik.handleBlur}
          isValid={value.length > 0}
          isInvalid={value.length === 0} // this is a hack to actually provide input validation on empty
        />
        {withInvalidFeedback && <FieldInvalidFeedbackCollapse<F> field={field}/>}
      </InputGroup>
    ))}
    <Button variant="dates-primary" className="mt-2" onClick={handleAddButtonClick}>
      {addButtonLabel || 'Add'}
    </Button>
  </>
}
