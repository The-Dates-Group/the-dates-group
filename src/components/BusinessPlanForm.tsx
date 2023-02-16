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
import {
  ChangeEvent,
  ChangeEventHandler,
  FocusEventHandler,
  HTMLAttributes,
  PropsWithChildren,
  useRef,
  useState
} from 'react'
import { useRouter } from 'next/router'
import { Button, Card, Col, Collapse, Form, FormControlProps, InputGroup, Modal, Row } from 'react-bootstrap'
import { Formik, useFormikContext } from 'formik'
import useFormSubmission from '@/components/hooks/useFormSubmission'
import { fromPrevState } from '@/utils/component-utils'
import { emailRegex, phoneNumberRegex } from '@/utils/regexes'
import NetlifyForm from '@/components/NetlifyForm'

type BusinessStructure =
  'C Corp'
  | 'S Corp'
  | 'LLC'
  | 'LLP'
  | 'General Partnership'
  | 'Sole Proprietor'
  | 'Nonprofit'
  | string

type BusinessStage =
  'Seed and Development'
  | 'Startup'
  | 'Growth and Establishment'
  | 'Expansion'
  | 'Maturity/Possibly in Need of Revamping'
  | string

type BusinessPlanFormValues = {
  firstName: string
  lastName: string
  title: string
  phoneNumber: string
  email: string
  businessName: string
  businessPhoneNumber: string
  businessStructure: BusinessStructure
  businessStage: BusinessStage
  interestedInFederalContractCertification: boolean
  appliedForCertificationsInThePast: boolean
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

const validateForm = (values: BusinessPlanFormValues) => {
  const {
    email,
    firstName,
    lastName,
    phoneNumber,
    title,
    businessName,
    businessPhoneNumber,
    businessStructure,
    businessStage
  } = values

  const errors: Partial<BusinessPlanFormValues> = {}

  if(firstName.trim().length === 0) {
    errors.firstName = 'Please provide your first name'
  }

  if(lastName.trim().length === 0) {
    errors.lastName = 'Please provide your last name'
  }

  if(title.trim().length === 0) {
    errors.title = 'Please provide your title'
  }

  if(phoneNumber.trim().length === 0) {
    errors.phoneNumber = 'Please provide your phone number'
  } else if(!phoneNumberRegex.test(phoneNumber)) {
    errors.phoneNumber = 'Please provide a valid phone number'
  }

  if(email.trim().length === 0) {
    errors.email = 'Please provide your business email address'
  } else if(!emailRegex.test(email)) {
    errors.email = 'Please provide a valid email address'
  }

  if(businessName.trim().length === 0) {
    errors.businessName = 'Please provide your business name'
  }

  if(businessPhoneNumber.trim().length === 0) {
    errors.businessPhoneNumber = 'Please provide your business phone number'
  } else if(!phoneNumberRegex.test(businessPhoneNumber)) {
    errors.businessPhoneNumber = 'Please provide a valid phone number'
  }

  if(businessStructure.trim().length === 0) {
    errors.businessStructure = 'Please provide your business structure'
  }

  if(businessStage.trim().length === 0) {
    errors.businessStage = 'Please provide your business stage'
  }

  return errors
}

type FieldProp = {
  field: keyof BusinessPlanFormValues
}

type FieldControlProps = FieldProp & FormControlProps & HTMLAttributes<HTMLInputElement | HTMLTextAreaElement> & {
  overrideOnChange?: boolean
  overrideOnBlur?: boolean
}

function FieldControl(props: FieldControlProps) {
  const { field, overrideOnChange, overrideOnBlur, onChange, onBlur, isValid, isInvalid, ...controlProps } = props
  const { values, touched, errors, ...formik } = useFormikContext<BusinessPlanFormValues>()

  const handleChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> | undefined =
    overrideOnChange ? onChange : (e) => {
      if(onChange) onChange(e)
      formik.handleChange(e)
    }

  const handleBlur: FocusEventHandler<HTMLInputElement | HTMLTextAreaElement> | undefined =
    overrideOnBlur ? onBlur : (e) => {
      if(onBlur) onBlur(e)
      formik.handleBlur(e)
    }

  return <Form.Control
    {...controlProps}
    name={field}
    value={String(values[field])}
    onChange={handleChange}
    onBlur={handleBlur}
    isValid={isValid || (touched[field] && !errors[field])}
    isInvalid={isInvalid || (touched[field] && !!errors[field])}
  />
}

type FieldCheckboxProps = FieldProp & PropsWithChildren

function FieldCheckbox({ field, children }: FieldCheckboxProps) {
  const { values, touched, errors, ...formik } = useFormikContext<BusinessPlanFormValues>()

  return <InputGroup className="w-100">
    <InputGroup.Text className="text-wrap flex-shrink col-10">{children}</InputGroup.Text>
    <InputGroup.Text className="px-0 col-2">
      <Form.Check.Input
        className="m-auto"
        name={field}
        value={String(values[field])}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}/>
    </InputGroup.Text>
  </InputGroup>
}

type FeedbackCollapseProps = FieldProp

function FeedbackCollapse({ field }: FeedbackCollapseProps) {
  const { touched, errors } = useFormikContext<BusinessPlanFormValues>()
  return (
    <Collapse in={touched[field] && !!errors[field]}>
      <Form.Control.Feedback type="invalid">
        {errors[field]}
      </Form.Control.Feedback>
    </Collapse>
  )
}

type SelectionWithOtherFieldProps =
  PropsWithChildren &
  FieldProp &
  FieldControlProps &
  {
    default: string
    options: string[]
  }

function SelectionWithOtherField({ default: defaultOption, options, field, ...props }: SelectionWithOtherFieldProps) {
  const { values, touched, errors, ...formik } = useFormikContext<BusinessPlanFormValues>()
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
        <FieldControl field={field} className="rounded-0 rounded-bottom" {...props}/>
      </div>
    </Collapse>
  </>
}

const BusinessPlanFormBody = () => {
  const { handleSubmit, setFieldValue, values } = useFormikContext<BusinessPlanFormValues>()
  const handlePhoneNumberChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()
    setFieldValue(event.target.name, formatPhoneNumber(event.target.value))
  }

  return <Form noValidate onSubmit={handleSubmit}>
    <Card.Subtitle as="h2" className="text-center mb-3">
      Personal Information
    </Card.Subtitle>
    <Row className="mb-3">
      <Form.Group as={Col} xs={12} md={6} className="mb-3 mb-md-0">
        <Form.FloatingLabel label="First Name">
          <FieldControl field="firstName" type="text" placeholder="John"/>
          <FeedbackCollapse field="firstName"/>
        </Form.FloatingLabel>
      </Form.Group>
      <Form.Group as={Col} xs={12} md={6}>
        <Form.FloatingLabel label="Last Name">
          <FieldControl field="lastName" type="text" placeholder="Smith"/>
          <FeedbackCollapse field="lastName"/>
        </Form.FloatingLabel>
      </Form.Group>
    </Row>
    <Row className="mb-3">
      <Form.Group as={Col} xs={12} md={6} lg={3} className="mb-3 mb-lg-0">
        <Form.FloatingLabel label="Title">
          <FieldControl field="title" type="text" placeholder="CEO"/>
          <FeedbackCollapse field="title"/>
        </Form.FloatingLabel>
      </Form.Group>
      <Form.Group as={Col} xs={12} md={6} lg={3} className="mb-3 mb-lg-0">
        <Form.FloatingLabel label="Phone Number">
          <FieldControl
            field="phoneNumber"
            type="tel"
            placeholder="(XXX) XXX-XXXX"
            autoCorrect="phone"
            overrideOnChange onChange={handlePhoneNumberChange}
            isValid={phoneNumberRegex.test(values.phoneNumber)}
          />
          <FeedbackCollapse field="phoneNumber"/>
        </Form.FloatingLabel>
      </Form.Group>
      <Form.Group as={Col} xs={12} lg={6}>
        <Form.FloatingLabel label="E-Mail">
          <FieldControl
            field="email"
            type="email"
            placeholder="johnsmith@mail.com"
            isValid={emailRegex.test(values.email)}
          />
          <FeedbackCollapse field="email"/>
        </Form.FloatingLabel>
      </Form.Group>
    </Row>

    <Card.Subtitle as="h2" className="text-center mb-3">
      Business Information
    </Card.Subtitle>
    <Row className="mb-3">
      <Form.Group as={Col} xs={12} md={6} className="mb-3 mb-md-0">
        <Form.FloatingLabel label="Business Name">
          <FieldControl field="businessName" type="text" placeholder="Business Name"/>
          <FeedbackCollapse field="businessName"/>
        </Form.FloatingLabel>
      </Form.Group>
      <Form.Group as={Col} xs={12} md={6}>
        <Form.FloatingLabel label="Business Phone Number">
          <FieldControl
            field="businessPhoneNumber"
            type="tel"
            placeholder="(XXX) XXX-XXXX"
            overrideOnChange onChange={handlePhoneNumberChange}
            isValid={phoneNumberRegex.test(values.businessPhoneNumber)}
          />
          <FeedbackCollapse field="businessPhoneNumber"/>
        </Form.FloatingLabel>
      </Form.Group>
    </Row>
    <Row className="mb-3">
      <Form.Group as={Col} xs={12} md={6} className="mb-3 mb-md-0">
        <Form.Label className="px-1">What is the structure of your business?</Form.Label>
        <Form.FloatingLabel label="Business Structure">
          <SelectionWithOtherField
            type="text"
            default="Select a Business Structure"
            field="businessStructure"
            options={['C Corp', 'S Corp', 'LLC', 'LLP', 'General Partnership', 'Sole Proprietor', 'Nonprofit']}
          />
          <FeedbackCollapse field="businessStructure"/>
        </Form.FloatingLabel>
      </Form.Group>
      <Form.Group as={Col} xs={12} md={6}>
        <Form.Label className="px-1">What stage is business operating at?</Form.Label>
        <Form.FloatingLabel label="Business Stage">
          <SelectionWithOtherField
            type="text"
            default="Select a Business Stage"
            field="businessStage"
            options={[
              'Seed and Development',
              'Startup',
              'Growth and Establishment',
              'Expansion',
              'Maturity/Possibly in Need of Revamping'
            ]}
          />
          <FeedbackCollapse field="businessStage"/>
        </Form.FloatingLabel>
      </Form.Group>
    </Row>
    <Row className="mb-3 ">
      <Form.Group as={Col} xs={12} md={6} className="mb-3 mb-md-0 d-flex">
        <FieldCheckbox field="interestedInFederalContractCertification">
          If your organization is for profit, are you interested in
          being certified for federal contracts or government grants?
        </FieldCheckbox>
      </Form.Group>
      <Form.Group as={Col} xs={12} md={6} className="mb-3 mb-md-0 d-flex">
        <FieldCheckbox field="appliedForCertificationsInThePast">
          Have you applied for a certification in the past?
        </FieldCheckbox>
      </Form.Group>
    </Row>
    <Row>
      <Col xs={12} className="d-flex">
        <Button
          className="flex-fill"
          variant="dates-primary"
          type="submit">
          Submit
        </Button>
      </Col>
    </Row>
  </Form>
}

const initialValues: BusinessPlanFormValues = {
  firstName: '',
  lastName: '',
  title: '',
  phoneNumber: '',
  email: '',
  businessName: '',
  businessPhoneNumber: '',
  businessStructure: '',
  businessStage: '',
  interestedInFederalContractCertification: false,
  appliedForCertificationsInThePast: false
}

export default function BusinessPlanForm() {
  const [state, setState] = useState({ showResultModal: false })
  const [form, submissionState] = useFormSubmission<BusinessPlanFormValues>('Business Plan Form')
  const router = useRouter()

  const handleFormSubmit = async (values: BusinessPlanFormValues) => {
    const errors = validateForm(values)
    if(Object.keys(errors).length > 0) throw new Error('Unexpected validation error while submitting form!')
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
    <NetlifyForm name={form.name} fields={Object.keys(initialValues).map(key => ({
      type: 'text', // TODO
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
    <Formik<BusinessPlanFormValues>
      validateOnMount
      initialValues={initialValues}
      validate={validateForm}
      onSubmit={handleFormSubmit}
      component={BusinessPlanFormBody}
    />
  </Card.Body>
}
