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
import { useState } from 'react'
import { useRouter } from 'next/router'
import { Button, Card, Form, Modal } from 'react-bootstrap'
import { Formik, FormikProps } from 'formik'
import { object, string } from 'yup'
import useFormSubmission from '@/components/hooks/useFormSubmission'
import { fromPrevState } from '@/utils/component-utils'
import { NetlifySchemaForm } from '@/components/NetlifyForm'
import { FormGroupCol, FormGroupRow } from '@/components/forms/helpers'
import FieldControl from '@/components/forms/FieldControl'
import FieldInvalidFeedbackCollapse from '@/components/forms/FieldInvalidFeedbackCollapse'

const formSchema = object({
  name: string()
    .default<string>('')
    .required('Please enter your name')
    .trim()
    .meta({ formType: 'text' }),
  email: string()
    .default<string>('')
    .email('Please provide a valid email address')
    .required('Please enter your email address')
    .trim()
    .meta({ formType: 'email' }),
  subject: string()
    .default<string>('')
    .required('Please provide a subject')
    .trim()
    .meta({ formType: 'text' }),
  message: string()
    .default<string>('')
    .required('Please provide a message')
    .trim()
    .meta({ formType: 'text' })
})

const initialValues = formSchema.getDefault()

type MessageUsFormValues = typeof initialValues

export default function MessageUsForm() {
  const router = useRouter()
  const [form, submissionState] = useFormSubmission<MessageUsFormValues>('Message Us Form')
  const [state, setState] = useState({ showResultModal: false })

  const handleFormSubmit = async (values: MessageUsFormValues) => {
    values = await formSchema.validate(values)
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
    <NetlifySchemaForm name={form.name} schema={formSchema}/>
    <Modal centered show={state.showResultModal} enforceFocus backdrop="static">
      <Modal.Header closeButton onClick={handleResultModalDismissed} className="h3 mb-0">
        {submissionState.isSuccess ? 'Thank you!' : 'Uh Oh!'}
      </Modal.Header>
      <Modal.Body as="p" className="text-center mb-0">
        {submissionState.isSuccess ? 'Your message was submitted!' : 'Something went wrong, try again later!'}
      </Modal.Body>
    </Modal>
    <Formik<MessageUsFormValues>
      validateOnMount
      validationSchema={formSchema}
      initialValues={initialValues}
      onSubmit={handleFormSubmit}
      component={MessageUsFormBody}/>
  </Card.Body>
}

const MessageUsFormBody = ({ submitForm }: FormikProps<MessageUsFormValues>) =>
  <Form noValidate className="d-flex flex-column">
    <FormGroupRow>
      <FormGroupCol md={6} className="mb-3 mb-md-0" component={NameField}/>
      <FormGroupCol md={6} component={EmailField}/>
    </FormGroupRow>
    <FormGroupRow>
      <FormGroupCol component={SubjectField}/>
    </FormGroupRow>
    <FormGroupRow>
      <FormGroupCol component={MessageField}/>
    </FormGroupRow>
    <Button className="flex-fill" type="button" variant="dates-primary" onClick={submitForm}>
      Submit
    </Button>
  </Form>

const NameField = () =>
  <Form.FloatingLabel label="Name">
    <FieldControl<MessageUsFormValues> field="name" type="text" placeholder="John Smith"/>
    <FieldInvalidFeedbackCollapse<MessageUsFormValues> field="name"/>
  </Form.FloatingLabel>

const EmailField = () =>
  <Form.FloatingLabel label="Email">
    <FieldControl<MessageUsFormValues> field="email" type="email" placeholder="Email"/>
    <FieldInvalidFeedbackCollapse<MessageUsFormValues> field="email"/>
  </Form.FloatingLabel>

const SubjectField = () =>
  <Form.FloatingLabel label="Subject">
    <FieldControl<MessageUsFormValues> field="subject" type="text" placeholder="A Message"/>
    <FieldInvalidFeedbackCollapse<MessageUsFormValues> field="subject"/>
  </Form.FloatingLabel>

const MessageField = () =>
  <Form.FloatingLabel label="Message">
    <FieldControl<MessageUsFormValues> as="textarea" field="message" type="text" placeholder="Hello!"/>
    <FieldInvalidFeedbackCollapse<MessageUsFormValues> field="message"/>
  </Form.FloatingLabel>
