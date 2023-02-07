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
import { ChangeEvent, Children, PropsWithChildren, useEffect, useState } from 'react'
import { Button, Card, Col, Collapse, Form, InputGroup, Row } from 'react-bootstrap'
import type { MessageUsPost } from '@/lib/common/data-types'
import { emailRegex } from '@/utils/regexes'
import { useUnfocus } from '@/components/hooks/useFocus'
import { usePOST } from '@/components/hooks/useRequest'

type FieldData = {
  readonly value: string
  readonly validationError?: string
}

type MessageUsFormState = {
  readonly name: FieldData
  readonly email: FieldData
  readonly subject: FieldData
  readonly message: FieldData
  readonly forceValidate: boolean
  readonly submitted: boolean
}

type FormRowProps = PropsWithChildren

type FormFieldProps = {
  label: string
  as?: 'input' | 'textarea'
  type?: string
  placeholder?: string
  data: FieldData
  setData: (data: FieldData) => void
  validate: (value: string) => string | undefined
  forceValidate?: boolean
}

const validateName = (name: string): string | undefined => {
  if(name.length < 1) return 'Please enter your name'
}

const validateEmail = (email: string): string | undefined => {
  if(email.length < 1) return 'Please provide an email address'
  if(!emailRegex.test(email)) return 'Email address is not valid'
}

const validateSubject = (subject: string): string | undefined => {
  if(subject.length < 1) return 'Please provide a subject'
}

const validateMessage = (message: string): string | undefined => {
  if(message.length < 1) return 'Please provide a message'
}

const defaultState = {
  name: { value: '' },
  email: { value: '' },
  subject: { value: '' },
  message: { value: '' },
  forceValidate: false,
  submitted: false
}

export default function MessageUsForm() {
  const [state, setState] = useState<MessageUsFormState>(defaultState)
  const [request, response] = usePOST<MessageUsPost>('/api/message-us')

  // this is a weird effect used as a hack to force validationErrors of the child fields to render on submit
  const onSubmit = () => setState(prevState => ({ ...prevState, forceValidate: true }))
  useEffect(() => {
    if(state.forceValidate) {
      if(!state.submitted) {
        // by changing submitted here we can force an intermediate re-render and validates the child fields...
        setState(prevState => ({ ...prevState, submitted: true }))
      } else {
        // ... and then, the validations are passed to here
        request.exec({
          name: state.name.value,
          email: state.email.value,
          subject: state.subject.value,
          message: state.message.value
        }).then(() => {
          // reset forceValidate and submitted to avoid this effect triggering again when fields are changed
          setState(() => ({ ...defaultState }))
        }).catch(() => {
          setState(() => ({ ...defaultState }))
        })
      }
    }
    // eslint-disable-next-line
  }, [state.forceValidate, state.submitted])

  const setName = (name: FieldData) => setState(prevState => ({ ...prevState, name }))
  const setEmail = (email: FieldData) => setState(prevState => ({ ...prevState, email }))
  const setSubject = (subject: FieldData) => setState(prevState => ({ ...prevState, subject }))
  const setMessage = (message: FieldData) => setState(prevState => ({ ...prevState, message }))

  return (
    <Form as={Card.Body} className="d-flex flex-column gap-vertical-4">
      <FormRow>
        <FormField
          label="Name"
          type="text"
          placeholder="John Smith"
          data={state.name}
          setData={setName}
          validate={validateName}
          forceValidate={state.forceValidate}
        />
        <FormField
          label="Email"
          type="email"
          placeholder="john@mail.com"
          data={state.email}
          setData={setEmail}
          validate={validateEmail}
          forceValidate={state.forceValidate}
        />
      </FormRow>
      <FormRow>
        <FormField
          label="Subject"
          type="text"
          placeholder="Subject"
          data={state.subject}
          setData={setSubject}
          validate={validateSubject}
          forceValidate={state.forceValidate}
        />
      </FormRow>
      <FormRow>
        <FormField
          label="Message"
          as="textarea"
          type="text"
          placeholder="Message"
          data={state.message}
          setData={setMessage}
          validate={validateMessage}
          forceValidate={state.forceValidate}
        />
      </FormRow>
      <FormRow>
        <Button variant="dates-primary" onClick={onSubmit}>Submit</Button>
        <Collapse in={response.isComplete && !response.isSuccess}>
          <div>
            {response.isComplete && !response.isSuccess ? response.error.message : 'test'}
          </div>
        </Collapse>
      </FormRow>
    </Form>
  )
}

function FormRow(props: FormRowProps) {
  const children = Children.toArray(props.children)
  return (
    <Form.Group as={Row} xs={1} md={children.length} className="gap-vertical-4 gap-vertical-md-0">
      {children.map((value, i) =>
        <Col key={`column-${i}`}>
          {value}
        </Col>
      )}
    </Form.Group>
  )
}

function FormField({ data, setData, label, as, type, placeholder, validate, forceValidate }: FormFieldProps) {
  const [wasValidated, setWasValidated] = useState(false)
  const [ref, wasUnfocused] = useUnfocus<any>(() => {
    const validationError = validate(data.value)
    setData({ ...data, validationError })
    setWasValidated(true)
  })

  useEffect(() => {
    if(!wasValidated && forceValidate) {
      const validationError = validate(data.value)
      setData({ ...data, validationError })
      setWasValidated(true)
    }
  }, [data, setData, wasValidated, forceValidate, validate])

  const onChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = event.target.value
    setData({
      value,
      // do not generate a validation error when still initially focused
      validationError: wasUnfocused ? validate(value) : undefined
    })
  }

  return (
    <InputGroup hasValidation>
      <Form.FloatingLabel label={label}>
        <Form.Control
          ref={ref}
          as={as}
          isValid={wasValidated && data.value.length > 0 && !data.validationError}
          isInvalid={wasValidated && !!data.validationError}
          type={type}
          placeholder={placeholder}
          value={data.value}
          onChange={onChange}
          style={as === 'textarea' ? { resize: 'none', height: '370px' } : undefined}
        />
        <Collapse in={data.validationError ? data.validationError.length > 0 : false}>
          <Form.Control.Feedback type="invalid">
            {data.validationError}
          </Form.Control.Feedback>
        </Collapse>
      </Form.FloatingLabel>
    </InputGroup>
  )
}
