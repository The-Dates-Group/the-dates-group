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
import { Children, MouseEventHandler, PropsWithChildren, useEffect, useState } from 'react'
import { Button, Card, Col, Collapse, Form, InputGroup, Modal, Row } from 'react-bootstrap'
import { useUnfocus } from '@/components/hooks/useFocus'
import { emailRegex } from '@/utils/regexes'
import { MessageUsPost } from '@/lib/common/data-types'
import useFormSubmission from '@/components/hooks/useFormSubmission'
import { useRouter } from 'next/router'
import { NetlifyForm, useNetlifyFormField } from '@/components/hooks/useNetlifyForm'

type ResultModalProps = {
  show: boolean
  success: boolean
  onHide: MouseEventHandler<HTMLDivElement>
}

const ResultModal = (props: ResultModalProps) =>
  <Modal show={props.show} enforceFocus={true} backdrop="static">
    <Modal.Header closeButton onClick={props.onHide}>
      <span className="h3 mb-0">{props.success ? 'Thank you!' : 'Uh Oh!'}</span>
    </Modal.Header>
    <Modal.Body as="p" className="text-center mb-0">
      {props.success ? 'Your message was submitted!' : 'Something went wrong, try again later!'}
    </Modal.Body>
  </Modal>

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
  const [showResultModal, setShowResultModal] = useState(false)
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
    return !submissionState.isComplete
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
    const isSuccessful = await submission.submit({
      name: state.name.value,
      email: state.email.value,
      subject: state.subject.value,
      message: state.message.value
    })
    setShowResultModal(true)
    return isSuccessful
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
    setShowResultModal(false)
  }
  return (
    <NetlifyForm.Provider name="message-us-form" fields={[
      {
        name: 'Name',
        type: 'text',
        placeholder: 'John Smith',
        onChange: onNameValueChanged,
        ...state.name
      },
      {
        name: 'Email',
        type: 'email',
        placeholder: 'jsmith@mail.com',
        onChange: onEmailValueChanged,
        ...state.email
      },
      {
        name: 'Subject',
        type: 'text',
        placeholder: 'Subject',
        onChange: onSubjectValueChanged,
        ...state.subject
      },
      {
        name: 'Message',
        as: 'textarea',
        type: 'text',
        placeholder: 'Message',
        onChange: onMessageValueChanged,
        ...state.message
      }
    ] as MessageUsFormField[]}>
      <ResultModal show={showResultModal} success={!!submissionState.isSuccess} onHide={handleResultModalDismissed}/>
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
  // return isSSR ? <FauxForm/> : <>
  //   <ResultModal
  //     show={showResultModal}
  //     success={!!submissionState.isSuccess}
  //     onHide={handleResultModalDismissed}
  //   />
  //   <Card.Body as={Form} className="d-flex flex-column gap-vertical-3">
  //     <MessageUsInputGroupRow>
  //       <MessageUsField
  //         label="Name"
  //         type="text"
  //         placeholder="John Smith"
  //         onChange={onNameValueChanged}
  //         {...state.name}
  //       />
  //       <MessageUsField
  //         label="Email"
  //         type="email"
  //         placeholder="jsmith@mail.com"
  //         onChange={onEmailValueChanged}
  //         {...state.email}
  //       />
  //     </MessageUsInputGroupRow>
  //     <MessageUsInputGroupRow>
  //       <MessageUsField
  //         label="Subject"
  //         type="text"
  //         placeholder="Subject"
  //         onChange={onSubjectValueChanged}
  //         {...state.subject}
  //       />
  //     </MessageUsInputGroupRow>
  //     <MessageUsInputGroupRow>
  //       <MessageUsField
  //         as="textarea"
  //         label="Message"
  //         type="text"
  //         placeholder="Message"
  //         onChange={onMessageValueChanged}
  //         {...state.message}
  //       />
  //     </MessageUsInputGroupRow>
  //     <Button variant="dates-primary" disabled={!isValidForSubmission()} onClick={handleSubmit}>
  //       Submit
  //     </Button>
  //   </Card.Body>
  // </>
}

type MessageUsInputGroupRowProps = PropsWithChildren

function MessageUsInputGroupRow(props: MessageUsInputGroupRowProps) {
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

type MessageUsFieldProps = {
  readonly index: number
  // readonly name: string
  // readonly label: string
  // readonly type: string
  // readonly placeholder: string
  // readonly value: string
  // readonly validation?: string
  // readonly onChange: (value: string) => void
  // readonly as?: 'input' | 'textarea'
}

type MessageUsFieldState = {
  readonly value: string
}

function MessageUsField(props: MessageUsFieldProps) {
  const field = useNetlifyFormField<MessageUsFormField>(props.index)
  const [{ value }, setState] = useState<MessageUsFieldState>({ value: field.value })
  const [ref, wasUnfocused] = useUnfocus<any>()

  // side effect that will send call onChange function provided
  //by the parent each time the value of this field is updated
  useEffect(() => field.onChange(value), [value])

  const isValid = !field.validation
  const onChange = (event: any) => setState(prevState => ({
    ...prevState,
    value: event.target.value
  }))

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

// const FauxForm = () =>
//   <Card.Body as={Form} data-netlify="true">
//     <input type="hidden" name="form-name" value="message-us-form"/>
//     <div className="d-flex flex-column gap-vertical-3 align-items-center">
//       <Row xs={1} md={2} className="gap-vertical-3 gap-vertical-md-0 w-100">
//         <Col as={Form.FloatingLabel}>
//           <Placeholder as="input" name="name" type="text" className="form-control"/>
//         </Col>
//         <Col as={Form.FloatingLabel}>
//           <Placeholder as="input" name="email" type="email" className="form-control"/>
//         </Col>
//       </Row>
//       <Row xs={1} className="w-100">
//         <Col as={Form.FloatingLabel} className="d-flex">
//           <Placeholder as="input" name="subject" type="text" className="form-control"/>
//         </Col>
//       </Row>
//       <Row xs={1} className="w-100">
//         <Col as={Form.FloatingLabel} className="d-flex">
//           <Placeholder as="textarea" name="message" type="text" className="form-control"/>
//         </Col>
//       </Row>
//       <Button variant="dates-primary" disabled>
//         Submit
//       </Button>
//     </div>
//   </Card.Body>
