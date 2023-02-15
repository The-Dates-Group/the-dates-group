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
import { Button, Card, Col, Collapse, Form, Modal, Row } from 'react-bootstrap'
import { Formik } from 'formik'
import useFormSubmission from '@/components/hooks/useFormSubmission'
import { fromPrevState } from '@/utils/component-utils'
import { emailRegex, phoneNumberRegex } from '@/utils/regexes'

type BusinessPlanFormValues = {
  firstName: string
  lastName: string
  title: string
  phoneNumber: string
  email: string
  businessName: string
  businessPhoneNumber: string
}

const formatFieldName = (name: string) => {
  const charArray = []
  let lastWasUppercase = false
  for(let i = 0; i < name.length; i++) {
    const char = name[i]

    // first char is always uppercase
    if(i === 0) {
      charArray.push(char.toUpperCase())
      continue
    }

    // char is uppercase
    if(char === char.toUpperCase()) {
      if(!lastWasUppercase) {
        charArray.push(' ')
        lastWasUppercase = true
      }
      charArray.push(char)
      continue
    }
    lastWasUppercase = false
    charArray.push(char)
  }
  return charArray.join('')
}

function formatPhoneNumber(value: string) {
  // if input value is falsy eg if the user deletes the input, then just return
  if(!value) return value

  // clean the input for any non-digit values.
  const phoneNumber = value.replace(/\D/g, '')

  const phoneNumberLength = phoneNumber.length

  if(phoneNumberLength < 4) return phoneNumber

  if(phoneNumberLength < 7) {
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`
  }

  return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`
}

const initialValues: BusinessPlanFormValues = {
  firstName: '',
  lastName: '',
  title: '',
  phoneNumber: '',
  email: '',
  businessName: '',
  businessPhoneNumber: ''
}

export default function BusinessPlanForm() {
  const [state, setState] = useState({
    isValidForSubmit: false,
    showResultModal: false
  })
  const [form, submissionState] = useFormSubmission<BusinessPlanFormValues>('business-plan-form', formatFieldName)
  const router = useRouter()

  const validateForm = (values: BusinessPlanFormValues) => {
    const errors: Partial<BusinessPlanFormValues> = {}
    if(values.firstName.trim().length === 0) {
      errors.firstName = 'Please provide your first name'
    }
    if(values.lastName.trim().length === 0) {
      errors.lastName = 'Please provide your last name'
    }
    if(values.title.trim().length === 0) {
      errors.title = 'Please provide your title'
    }
    if(values.phoneNumber.trim().length === 0) {
      errors.phoneNumber = 'Please provide your phone number'
    } else if(!phoneNumberRegex.test(values.phoneNumber)) {
      errors.phoneNumber = 'Please provide a valid phone number'
    }
    if(values.email.trim().length === 0) {
      errors.email = 'Please provide your business email address'
    } else if(!emailRegex.test(values.email)) {
      errors.email = 'Please provide a valid email address'
    }
    setState(fromPrevState({ isValidForSubmit: Object.keys(errors).length === 0 }))
    return errors
  }

  const handleFormSubmit = async (values: BusinessPlanFormValues) => {
    if(!state.isValidForSubmit) throw new Error('Unexpected submission of invalid form!')
    await form.submit(values)
    setState(fromPrevState({ showResultModal: true }))
  }

  const handleResultModalDismissed = (event: any) => {
    event.preventDefault()
    if(submissionState.isSuccess) {
      router.reload()
      return
    }
    setState(fromPrevState({ showResultModal: false }))
  }

  return <Card.Body>
    {/* fake form to tell netlify to handle this form submission */}
    {/*<form hidden data-netlify="true">*/}
    {/*  <input type="hidden" name="form-name" value="business-plan-form"/>*/}
    {/*  {Object.keys(initialValues).map(key => <input key={key} type="text" name={key}/>)}*/}
    {/*</form>*/}
    <Modal show={state.showResultModal} enforceFocus={true} backdrop="static">
      <Modal.Header closeButton onClick={handleResultModalDismissed} className="h3 mb-0">
        {submissionState.isSuccess ? 'Thank you!' : 'Uh Oh!'}
      </Modal.Header>
      <Modal.Body as="p" className="text-center mb-0">
        {submissionState.isSuccess ? 'Your message was submitted!' : 'Something went wrong, try again later!'}
      </Modal.Body>
    </Modal>
    <Formik<BusinessPlanFormValues>
      initialValues={initialValues}
      validate={validateForm}
      onSubmit={handleFormSubmit}>
      {({ handleSubmit, handleChange, setFieldValue, handleBlur, isValid, values, touched, errors }) =>
        <Form
          name="business-plan-form"
          noValidate
          onSubmit={handleSubmit}
          // @ts-ignore
          netlify
          data-netlify="true">
          <input type="hidden" name="form-name" value="business-plan-form"/>
          <Card.Subtitle as="h2" className="text-center mb-3">
            Personal Information
          </Card.Subtitle>
          <Row className="mb-3">
            <Form.Group as={Col} xs={12} md={6} className="mb-3 mb-md-0">
              <Form.FloatingLabel label="First Name">
                <Form.Control
                  type="text"
                  name="firstName"
                  placeholder="John"
                  value={values.firstName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isValid={touched.firstName && !errors.firstName}
                  isInvalid={touched.firstName && !!errors.firstName}
                />
                <Collapse in={touched.firstName && !!errors.firstName}>
                  <Form.Control.Feedback type="invalid">
                    {errors.firstName}
                  </Form.Control.Feedback>
                </Collapse>
              </Form.FloatingLabel>
            </Form.Group>
            <Form.Group as={Col} xs={12} md={6}>
              <Form.FloatingLabel label="Last Name">
                <Form.Control
                  type="text"
                  name="lastName"
                  placeholder="Smith"
                  value={values.lastName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isValid={touched.lastName && !errors.lastName}
                  isInvalid={touched.lastName && !!errors.lastName}
                />
                <Collapse in={touched.lastName && !!errors.lastName}>
                  <Form.Control.Feedback type="invalid">
                    {errors.lastName}
                  </Form.Control.Feedback>
                </Collapse>
              </Form.FloatingLabel>
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} xs={12} md={6} lg={3} className="mb-3 mb-lg-0">
              <Form.FloatingLabel label="Title">
                <Form.Control
                  type="text"
                  name="title"
                  placeholder="CEO"
                  value={values.title}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isValid={touched.title && !errors.title}
                  isInvalid={touched.title && !!errors.title}
                />
                <Collapse in={touched.title && !!errors.title}>
                  <Form.Control.Feedback type="invalid">
                    {errors.title}
                  </Form.Control.Feedback>
                </Collapse>
              </Form.FloatingLabel>
            </Form.Group>
            <Form.Group as={Col} xs={12} md={6} lg={3} className="mb-3 mb-lg-0">
              <Form.FloatingLabel label="Phone Number">
                <Form.Control
                  type="tel"
                  name="phoneNumber"
                  autoComplete="phone"
                  placeholder="(XXX) XXX-XXXX"
                  value={values.phoneNumber}
                  onChange={(e) => {
                    e.preventDefault()
                    setFieldValue('phoneNumber', formatPhoneNumber(e.target.value))
                  }}
                  onBlur={handleBlur}
                  isValid={(touched.phoneNumber && !errors.phoneNumber) || phoneNumberRegex.test(values.phoneNumber)}
                  isInvalid={touched.phoneNumber && !!errors.phoneNumber}
                />
                <Collapse in={touched.phoneNumber && !!errors.phoneNumber}>
                  <Form.Control.Feedback type="invalid">
                    {errors.phoneNumber}
                  </Form.Control.Feedback>
                </Collapse>
              </Form.FloatingLabel>
            </Form.Group>
            <Form.Group as={Col} xs={12} lg={6}>
              <Form.FloatingLabel label="E-Mail">
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="johnsmith@mail.com"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isValid={(touched.email && !errors.email) || emailRegex.test(values.email)}
                  isInvalid={touched.email && !!errors.email}
                />
                <Collapse in={touched.email && !!errors.email}>
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </Collapse>
              </Form.FloatingLabel>
            </Form.Group>
          </Row>

          <Card.Subtitle as="h2" className="text-center mb-3">
            Business Information
          </Card.Subtitle>
          <Row className="mb-3">
            <Form.Group as={Col} xs={12} md={6} className="mb-3 mb-md-0">
              <Form.FloatingLabel label="Business Name">
                <Form.Control
                  type="text"
                  name="businessName"
                  placeholder="Business Name"
                  value={values.businessName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isValid={values.businessName.length > 0 && touched.businessName && !errors.businessName}
                  isInvalid={values.businessName.length > 0 && touched.businessName && !!errors.businessName}
                />
                <Collapse in={touched.businessName && !!errors.businessName}>
                  <Form.Control.Feedback type="invalid">
                    {errors.businessName}
                  </Form.Control.Feedback>
                </Collapse>
              </Form.FloatingLabel>
            </Form.Group>
            <Form.Group as={Col} xs={12} md={6}>
              <Form.FloatingLabel label="Business Phone Number">
                <Form.Control
                  type="text"
                  name="businessPhoneNumber"
                  placeholder="(XXX) XXX-XXXX"
                  value={values.businessPhoneNumber}
                  onChange={(e) => {
                    e.preventDefault()
                    setFieldValue('businessPhoneNumber', formatPhoneNumber(e.target.value))
                  }}
                  onBlur={handleBlur}
                  isValid={values.businessPhoneNumber.length > 0 && touched.businessPhoneNumber && !errors.businessPhoneNumber}
                  isInvalid={values.businessPhoneNumber.length > 0 && touched.businessPhoneNumber && !!errors.businessPhoneNumber}
                />
                <Collapse in={touched.businessPhoneNumber && !!errors.businessPhoneNumber}>
                  <Form.Control.Feedback type="invalid">
                    {errors.businessPhoneNumber}
                  </Form.Control.Feedback>
                </Collapse>
              </Form.FloatingLabel>
            </Form.Group>
          </Row>
          <Row>
            <Col xs={12} className="d-flex">
              <Button
                className="flex-fill"
                disabled={!state.isValidForSubmit || !isValid}
                variant="dates-primary"
                type="submit">
                Submit
              </Button>
            </Col>
          </Row>
        </Form>
      }
    </Formik>
  </Card.Body>
}
