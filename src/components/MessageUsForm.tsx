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
import { Children, PropsWithChildren, useEffect, useState } from 'react'
import { Button, Card, Col, Collapse, Form, InputGroup, Row } from 'react-bootstrap'
import { useUnfocus } from '@/components/hooks/useFocus'
import { emailRegex } from '@/utils/regexes'
import { MessageUsPost } from '@/lib/common/data-types'
import useFormSubmission from '@/components/hooks/useFormSubmission'

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

export type FieldData = {
  readonly value: string
  readonly validation?: string
}

export type MessageUsFormProps = {}

export type MessageUsFormState = {
  readonly name: FieldData
  readonly email: FieldData
  readonly subject: FieldData
  readonly message: FieldData
}

export default function MessageUsForm(_: MessageUsFormProps) {
  const [form, formState] = useFormSubmission<MessageUsPost>('message-us-form')
  const [state, setState] = useState<MessageUsFormState>({
    name: { value: '' },
    email: { value: '' },
    subject: { value: '' },
    message: { value: '' }
  })

  const isValidForSubmission = () => {
    if(state.name.validation)
      return false
    else if(state.email.validation)
      return false
    else if(state.subject.validation)
      return false
    else if(state.message.validation)
      return false
    return !formState.isComplete || formState.isSuccess
  }

  const onFieldChanged = (
    field: keyof MessageUsFormState,
    value: string,
    validation?: string
  ) => setState(prevState => ({
    ...prevState,
    [field]: { value, validation }
  }))

  const onNameValueChanged = (value: string) => onFieldChanged('name', value, validateName(value))
  const onEmailValueChanged = (value: string) => onFieldChanged('email', value, validateEmail(value))
  const onSubjectValueChanged = (value: string) => onFieldChanged('subject', value, validateSubject(value))
  const onMessageValueChanged = (value: string) => onFieldChanged('message', value, validateMessage(value))

  const handleSubmit = async () => {
    return form.submit({
      name: state.name.value,
      email: state.email.value,
      subject: state.subject.value,
      message: state.message.value
    })
  }

  return (
    <Card.Body as={Form} name={form.name} data-netlify="true" className="d-flex flex-column gap-vertical-3">
      <MessageUsInputGroupRow>
        <MessageUsField
          label="Name"
          type="text"
          placeholder="John Smith"
          onChange={onNameValueChanged}
          {...state.name}
        />
        <MessageUsField
          label="Email"
          type="email"
          placeholder="jsmith@mail.com"
          onChange={onEmailValueChanged}
          {...state.email}
        />
      </MessageUsInputGroupRow>
      <MessageUsInputGroupRow>
        <MessageUsField
          label="Subject"
          type="text"
          placeholder="Subject"
          onChange={onSubjectValueChanged}
          {...state.subject}
        />
      </MessageUsInputGroupRow>
      <MessageUsInputGroupRow>
        <MessageUsField
          as="textarea"
          label="Message"
          type="text"
          placeholder="Message"
          onChange={onMessageValueChanged}
          {...state.message}
        />
      </MessageUsInputGroupRow>
      <Button variant="dates-primary" disabled={!isValidForSubmission()} onClick={handleSubmit}>
        Submit
      </Button>
    </Card.Body>
  )
}

type MessageUsInputGroupRowProps = PropsWithChildren

function MessageUsInputGroupRow(props: MessageUsInputGroupRowProps) {
  const children = Children.toArray(props.children)
  return (
    <Form.Group as={Row} xs={1} md={children.length} className="gap-vertical-3 gap-vertical-md-0">
      {children.map((value, i) =>
        <Col key={`column-${i}`}>
          <InputGroup hasValidation>
            {value}
          </InputGroup>
        </Col>
      )}
    </Form.Group>
  )
}

type MessageUsFieldProps = {
  readonly label: string
  readonly name?: string | Lowercase<MessageUsFieldProps['label']>
  readonly type: string
  readonly placeholder: string
  readonly value: string
  readonly validation?: string
  readonly onChange: (value: string) => void
  readonly as?: 'input' | 'textarea'
}

type MessageUsFieldState = {
  readonly value: string
}

function MessageUsField(props: MessageUsFieldProps) {
  const [{ value }, setState] = useState<MessageUsFieldState>({ value: props.value })
  const [ref, wasUnfocused] = useUnfocus<any>()

  // side effect that will send call onChange function provided
  //by the parent each time the value of this field is updated
  useEffect(() => props.onChange(value), [value])

  const isValid = !props.validation
  const onChange = (event: any) => setState(prevState => ({
    ...prevState,
    value: event.target.value
  }))

  return (
    <Form.FloatingLabel label={props.label}>
      <Form.Control
        ref={ref}
        name={props.label.toLowerCase()}
        as={props.as || 'input'}
        type={props.type}
        isValid={wasUnfocused && isValid}
        isInvalid={wasUnfocused && !isValid}
        placeholder={props.placeholder}
        onChange={onChange}
        style={props.as === 'textarea' ? { resize: 'none', height: '370px' } : undefined}
      />
      <Collapse in={wasUnfocused && !isValid}>
        <Form.Control.Feedback type="invalid">
          {props.validation}
        </Form.Control.Feedback>
      </Collapse>
    </Form.FloatingLabel>
  )
}
