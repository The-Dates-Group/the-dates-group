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
import { Button, Card, Col, Collapse, Form, InputGroup, Modal, Row } from 'react-bootstrap'
import { useUnfocus } from '@/components/hooks/useFocus'
import { emailRegex } from '@/utils/regexes'
import { MessageUsPost } from '@/lib/common/data-types'
import useFormSubmission from '@/components/hooks/useFormSubmission'
import { useRouter } from 'next/router'
import { NetlifyForm, useNetlifyFormField } from '@/components/hooks/useNetlifyForm'
import { fromPrevState } from '@/utils/component-utils'

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
  readonly showResultModal: boolean
}

export type MessageUsFormField = {
  readonly name: string
  readonly type: string
  readonly placeholder: string
  readonly value: string
  readonly validation?: string
  readonly onChange: (value: string) => void
  readonly as?: 'input' | 'textarea'
}

export default function MessageUsForm(_: MessageUsFormProps) {
  const router = useRouter()
  const [submission, submissionState] = useFormSubmission<MessageUsPost>('message-us-form')
  const [{ email, message, name, showResultModal, subject }, setState] = useState<MessageUsFormState>({
    name: { value: '' },
    email: { value: '' },
    subject: { value: '' },
    message: { value: '' },
    showResultModal: false
  })

  const isValidForSubmission = () => {
    if(name.validation) return false
    else if(email.validation) return false
    else if(subject.validation) return false
    else if(message.validation) return false
    return !submissionState.isComplete
  }

  const handleSubmit = async (event: any) => {
    event.preventDefault()
    // check the form one last time
    if(!isValidForSubmission()) throw new Error('Form was submitted when invalid for submission!')
    // submit form
    await submission.submit({
      name: name.value,
      email: email.value,
      subject: subject.value,
      message: message.value
    })
    // regardless of whether it's successful, we will display the result modal
    setState(fromPrevState({ showResultModal: true }))
  }

  const handleResultModalDismissed = (event: any) => {
    event.preventDefault()
    // if the submission was a success
    if(submissionState.isSuccess) {
      // reload the page
      router.reload()
      // return
      return
    }
    // otherwise, hide the modal
    // this will prevent more submissions that error out
    setState(fromPrevState({ showResultModal: false }))
  }

  return (
    <NetlifyForm.Provider<MessageUsFormField> name="message-us-form" fields={[
      {
        name: 'Name',
        type: 'text',
        placeholder: 'John Smith',
        onChange: (value: string) =>
          setState(fromPrevState({ name: { value, validation: validateName(value) } })),
        ...name
      },
      {
        name: 'Email',
        type: 'email',
        placeholder: 'jsmith@mail.com',
        onChange: (value: string) =>
          setState(fromPrevState({ email: { value, validation: validateEmail(value) } })),
        ...email
      },
      {
        name: 'Subject',
        type: 'text',
        placeholder: 'Subject',
        onChange: (value: string) =>
          setState(fromPrevState({ subject: { value, validation: validateSubject(value) } })),
        ...subject
      },
      {
        name: 'Message',
        as: 'textarea',
        type: 'text',
        placeholder: 'Message',
        onChange: (value: string) =>
          setState(fromPrevState({ message: { value, validation: validateMessage(value) } })),
        ...message
      }
    ]}>
      <Modal show={showResultModal} enforceFocus={true} backdrop="static">
        <Modal.Header closeButton onClick={handleResultModalDismissed} className="h3 mb-0">
          {submissionState.isSuccess ? 'Thank you!' : 'Uh Oh!'}
        </Modal.Header>
        <Modal.Body as="p" className="text-center mb-0">
          {submissionState.isSuccess ? 'Your message was submitted!' : 'Something went wrong, try again later!'}
        </Modal.Body>
      </Modal>
      <Card.Body as={Form} className="d-flex flex-column gap-vertical-3">
        <MessageUsInputGroupRow>
          <MessageUsField index={0}/>
          <MessageUsField index={1}/>
        </MessageUsInputGroupRow>
        <MessageUsInputGroupRow>
          <MessageUsField index={2}/>
        </MessageUsInputGroupRow>
        <MessageUsInputGroupRow>
          <MessageUsField index={3}/>
        </MessageUsInputGroupRow>
        <Button variant="dates-primary" disabled={!isValidForSubmission()} onClick={handleSubmit}>
          Submit
        </Button>
      </Card.Body>
    </NetlifyForm.Provider>
  )
}

function MessageUsInputGroupRow(props: PropsWithChildren) {
  const children = Children.toArray(props.children)
  return (
    <Row xs={1} md={children.length} className="gap-vertical-3 gap-vertical-md-0">
      {children.map((value, i) =>
        <Col key={`column-${i}`}>
          <InputGroup hasValidation>
            {value}
          </InputGroup>
        </Col>
      )}
    </Row>
  )
}

function MessageUsField(props: { index: number }) {
  const field = useNetlifyFormField<MessageUsFormField>(props.index)
  const [{ value }, setState] = useState({ value: field.value })
  const [ref, wasUnfocused] = useUnfocus<any>()

  // side effect that will send call onChange function provided
  //by the parent each time the value of this field is updated
  // note that this will also re-render the validation, so it
  //needs to be done this way!
  useEffect(() => field.onChange(value), [value])

  const isValid = !field.validation
  const onChange = (event: any) => setState(fromPrevState(({ value: event.target.value })))

  return (
    <Form.FloatingLabel label={field.name}>
      <Form.Control
        ref={ref}
        name={field.name}
        as={field.as || 'input'}
        type={field.type}
        isValid={wasUnfocused && isValid}
        isInvalid={wasUnfocused && !isValid}
        placeholder={field.placeholder}
        onChange={onChange}
      />
      <Collapse in={wasUnfocused && !isValid}>
        <Form.Control.Feedback type="invalid">
          {field.validation}
        </Form.Control.Feedback>
      </Collapse>
    </Form.FloatingLabel>
  )
}
