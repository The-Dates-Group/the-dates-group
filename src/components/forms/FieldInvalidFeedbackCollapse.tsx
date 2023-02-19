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
import { Collapse, Form } from 'react-bootstrap'
import { useFormikContext } from 'formik'
import { FieldProp } from '@/components/forms/FieldProp'

export type FieldInvalidFeedbackCollapseProps<F> = FieldProp<F>

export default function FieldInvalidFeedbackCollapse<F>({ field }: FieldInvalidFeedbackCollapseProps<F>) {
  const { touched, errors } = useFormikContext<F>()
  return (
    <Collapse in={touched[field] && !!errors[field]}>
      <Form.Control.Feedback type="invalid">
        {errors[field] as any}
      </Form.Control.Feedback>
    </Collapse>
  )
}
