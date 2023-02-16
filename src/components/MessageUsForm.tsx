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
import { FunctionComponent, useState } from 'react'
import { useRouter } from 'next/router'
import { Button, Card, Col, Collapse, FloatingLabel, Form, Modal, Row } from 'react-bootstrap'
import { Formik, FormikProps } from 'formik'
import { emailRegex } from '@/utils/regexes'
import useFormSubmission from '@/components/hooks/useFormSubmission'
import { fromPrevState } from '@/utils/component-utils'
import NetlifyForm from '@/components/NetlifyForm'

type MessageUsFormValues = {
  name: string
  email: string
  subject: string
  message: string
}

const validateForm = ({ email, message, name, subject }: MessageUsFormValues) => {
  const errors: Partial<MessageUsFormValues> = {}

  if(name.length < 1) errors.name = 'Please enter your name'

  if(email.length < 1) errors.email = 'Please provide an email address'
  else if(!emailRegex.test(email)) errors.email = 'Email address is not valid'

  if(subject.length < 1) errors.subject = 'Please provide a subject'

  if(message.length < 1) errors.message = 'Please provide a message'

  return errors
}

const initialValues: MessageUsFormValues = {
  name: '',
  email: '',
  subject: '',
  message: ''
}

export default function MessageUsForm() {
  const router = useRouter()
  const [form, submissionState] = useFormSubmission<MessageUsFormValues>('Message Us Form')
  const [state, setState] = useState({ showResultModal: false })

  const handleFormSubmit = async (values: MessageUsFormValues) => {
    const errors = validateForm(values)
    if(Object.keys(errors).length > 0) throw new Error('Unexpected validation error while submitting form!')
    await form.submit(values)
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

  return <Card.Body>
    <NetlifyForm name={form.name} fields={Object.keys(initialValues).map(key => ({
      type: 'text',
      name: key
    }))}/>
    <Modal centered show={state.showResultModal} enforceFocus backdrop="static">
      <Modal.Header closeButton onClick={handleResultModalDismissed} className="h3 mb-0">
        {submissionState.isSuccess ? 'Thank you!' : 'Uh Oh!'}
      </Modal.Header>
      <Modal.Body as="p" className="text-center mb-0">
        {submissionState.isSuccess ? 'Your message was submitted!' : 'Something went wrong, try again later!'}
      </Modal.Body>
    </Modal>
    <Formik validateOnMount initialValues={initialValues} validate={validateForm} onSubmit={handleFormSubmit}>
      {MessageUsFormBody}
    </Formik>
  </Card.Body>
}

const MessageUsFormBody: FunctionComponent<FormikProps<MessageUsFormValues>> = (
  {
    handleSubmit,
    handleChange,
    handleBlur,
    isValid,
    values,
    touched,
    errors
  }
) => <Form noValidate onSubmit={handleSubmit}>
  <Row className="mb-3">
    <Form.Group as={Col} md={6} className="mb-3 mb-md-0">
      <MessageUsFormField
        label="Name"
        type="text"
        name="name"
        placeholder="John Smith"
        value={values.name}
        handleChange={handleChange}
        handleBlur={handleBlur}
        touched={touched.name}
        error={errors.name}
      />
    </Form.Group>
    <Form.Group as={Col} md={6}>
      <MessageUsFormField
        label="E-Mail"
        type="email"
        name="email"
        placeholder="johnsmith@mail.com"
        value={values.email}
        handleChange={handleChange}
        handleBlur={handleBlur}
        touched={touched.email}
        error={errors.email}
      />
    </Form.Group>
  </Row>
  <Row className="mb-3">
    <Form.Group as={Col}>
      <MessageUsFormField
        label="Subject"
        type="text"
        name="subject"
        placeholder="A Message"
        value={values.subject}
        handleChange={handleChange}
        handleBlur={handleBlur}
        touched={touched.subject}
        error={errors.subject}
      />
    </Form.Group>
  </Row>
  <Row className="mb-3">
    <Form.Group as={Col}>
      <MessageUsFormField
        textarea
        label="Message"
        type="text"
        name="message"
        placeholder="Hello!"
        value={values.message}
        handleChange={handleChange}
        handleBlur={handleBlur}
        touched={touched.message}
        error={errors.message}
      />
    </Form.Group>
  </Row>
  <Row>
    <Col className="d-flex">
      <Button className="flex-fill" type="submit" variant="dates-primary" disabled={!isValid}>
        Submit
      </Button>
    </Col>
  </Row>
</Form>

type MessageUsFormFieldProps = {
  label: string
  name: string
  textarea?: boolean
  type: string
  placeholder: string
  value: string
  handleChange: FormikProps<MessageUsFormValues>['handleChange']
  handleBlur: FormikProps<MessageUsFormValues>['handleBlur']
  touched?: boolean
  error?: string
}

const MessageUsFormField = (props: MessageUsFormFieldProps) =>
  <FloatingLabel label={props.label}>
    <Form.Control
      as={props.textarea ? 'textarea' : 'input'}
      type={props.type}
      name={props.name}
      placeholder={props.placeholder}
      value={props.value}
      onChange={props.handleChange}
      onBlur={props.handleBlur}
      isValid={props.touched && !props.error}
      isInvalid={props.touched && !!props.error}
    />
    <Collapse in={props.touched && !!props.error}>
      <Form.Control.Feedback type="invalid">
        {props.error}
      </Form.Control.Feedback>
    </Collapse>
  </FloatingLabel>
