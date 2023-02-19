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
import { ChangeEvent, ComponentType, PropsWithChildren, useState } from 'react'
import { Button, Card, Col, Collapse, ColProps, Form, Modal, Row, RowProps } from 'react-bootstrap'
import { useRouter } from 'next/router'
import { Formik, useFormikContext } from 'formik'
import classNames from 'classnames'

import useFormSubmission from '@/components/hooks/useFormSubmission'
import NetlifyForm from '@/components/NetlifyForm'
import YesNoController, { YesNoControllerWithCollapse } from '@/components/YesNoController'

import FieldControl, { FieldFileControl } from '@/components/forms/FieldControl'
import FieldSelectionWithOther from '@/components/forms/FieldSelectionWithOther'
import FieldYesNo from '@/components/forms/FieldYesNo'
import FieldInvalidFeedbackCollapse from '@/components/forms/FieldInvalidFeedbackCollapse'
import FieldExpandingList from '@/components/forms/FieldExpandingList'

import { fromPrevState } from '@/utils/component-utils'
import { emailRegex, phoneNumberRegex } from '@/utils/regexes'

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

interface BusinessPlanFormValues {
  firstName: string
  lastName: string
  title: string
  phoneNumber: string
  email: string
  businessName: string
  businessPhoneNumber: string
  businessStructure: BusinessStructure
  businessStage: BusinessStage
  dateBusinessStarted: string
  professionalLicenses: string[]
  interestedInFederalContractCertification: boolean
  appliedForCertificationsInThePast: boolean
  franchiseAgreement: File | null
  organizationBonded: boolean
  holdsBusinessLicense: boolean
  streetAddress: string
  city: string
  state: string
  zip: string
  mailingStreetAddress: string
  mailingCity: string
  mailingState: string
  mailingZip: string
}

type FormCategoryProps = PropsWithChildren & { title: string }

type FormAddressInfoProps = {
  title: string
  withValidation?: boolean
  streetField: keyof BusinessPlanFormValues
  cityField: keyof BusinessPlanFormValues
  stateField: keyof BusinessPlanFormValues
  zipField: keyof BusinessPlanFormValues
}

function formatPhoneNumber(value: string) {
  if(!value) return value
  const phoneNumber = value.replace(/\D/g, '')
  const phoneNumberLength = phoneNumber.length
  if(phoneNumberLength < 4) return phoneNumber
  if(phoneNumberLength < 7) return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`
  return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`
}

function validateForm(values: BusinessPlanFormValues) {
  const {
    email,
    firstName,
    lastName,
    phoneNumber,
    title,
    businessName,
    businessPhoneNumber,
    businessStructure,
    businessStage,
    dateBusinessStarted,
    professionalLicenses,
    streetAddress,
    city,
    state,
    zip
  } = values

  const errors: Partial<Record<keyof BusinessPlanFormValues, string>> = {}

  if(firstName.trim().length === 0)
    errors.firstName = 'Please provide your first name'
  if(lastName.trim().length === 0)
    errors.lastName = 'Please provide your last name'
  if(title.trim().length === 0)
    errors.title = 'Please provide your title'

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

  if(businessName.trim().length === 0)
    errors.businessName = 'Please provide your business name'

  if(businessPhoneNumber.trim().length === 0) {
    errors.businessPhoneNumber = 'Please provide your business phone number'
  } else if(!phoneNumberRegex.test(businessPhoneNumber)) {
    errors.businessPhoneNumber = 'Please provide a valid phone number'
  }

  if(businessStructure.trim().length === 0)
    errors.businessStructure = 'Please provide your business structure'

  if(businessStage.trim().length === 0)
    errors.businessStage = 'Please provide your business stage'

  if(!dateBusinessStarted) {
    errors.dateBusinessStarted =
      'Please specify when your business started! If you are unsure of the exact date, an estimate is fine.'
  } else if(isNaN(Date.parse(dateBusinessStarted))) {
    errors.dateBusinessStarted = 'Invalid date!'
  }

  if(professionalLicenses.length > 0) {
    if(typeof professionalLicenses.find(value => value.trim().length === 0) !== 'undefined') {
      errors.professionalLicenses = 'Please provide a name for each professional license!'
    }
  }

  if(streetAddress.trim().length === 0)
    errors.streetAddress = 'Please specify your business street address'
  if(city.trim().length === 0)
    errors.city = 'Please specify your business city'
  if(state.trim().length === 0)
    errors.state = 'Please specify your business state'
  if(zip.trim().length === 0)
    errors.zip = 'Please specify your business zip'
  return errors
}

const FormCategory = ({ title, children }: FormCategoryProps) =>
  <>
    <Card.Subtitle as="h2" className="text-center mb-3">
      {title}
    </Card.Subtitle>
    {children}
  </>

const FormGroupRow = ({ className, ...props }: RowProps) =>
  <Row {...props} className={classNames('mb-3', props.className)}/>

const FormGroupCol = ({ children, component: Component, ...props }: ColProps & { component?: ComponentType<any> }) =>
  <Form.Group as={Col} {...props}>
    {children || (Component ? <Component/> : null)}
  </Form.Group>

const FormAddressInfo = (props: FormAddressInfoProps) => <FormCategory title={props.title}>
  <FormGroupRow>
    <FormGroupCol>
      <Form.FloatingLabel label="Street Address">
        <FieldControl field={props.streetField} type="street" placeholder="121 Street Road"/>
        {props.withValidation && <FieldInvalidFeedbackCollapse field={props.streetField}/>}
      </Form.FloatingLabel>
    </FormGroupCol>
  </FormGroupRow>
  <FormGroupRow>
    <FormGroupCol lg={6} className="mb-3 mb-lg-0">
      <Form.FloatingLabel label="City">
        <FieldControl field={props.cityField} type="city" placeholder="Chicago"/>
        {props.withValidation && <FieldInvalidFeedbackCollapse field={props.cityField}/>}
      </Form.FloatingLabel>
    </FormGroupCol>
    <FormGroupCol xs={6} sm={8} lg={3}>
      <Form.FloatingLabel label="State">
        <FieldControl field={props.stateField} type="state" placeholder="Illinois"/>
        {props.withValidation && <FieldInvalidFeedbackCollapse field={props.stateField}/>}
      </Form.FloatingLabel>
    </FormGroupCol>
    <FormGroupCol xs={6} sm={4} lg={3}>
      <Form.FloatingLabel label="Zip Code">
        <FieldControl field={props.zipField} type="zip" placeholder="60007"/>
        {props.withValidation && <FieldInvalidFeedbackCollapse field={props.zipField}/>}
      </Form.FloatingLabel>
    </FormGroupCol>
  </FormGroupRow>
</FormCategory>

const FirstNameField = () =>
  <Form.FloatingLabel label="First Name">
    <FieldControl<BusinessPlanFormValues> field="firstName" type="text" placeholder="John"/>
    <FieldInvalidFeedbackCollapse<BusinessPlanFormValues> field="firstName"/>
  </Form.FloatingLabel>

const LastNameField = () =>
  <Form.FloatingLabel label="Last Name">
    <FieldControl<BusinessPlanFormValues> field="lastName" type="text" placeholder="Smith"/>
    <FieldInvalidFeedbackCollapse<BusinessPlanFormValues> field="lastName"/>
  </Form.FloatingLabel>

const TitleField = () =>
  <Form.FloatingLabel label="Title">
    <FieldControl<BusinessPlanFormValues> field="title" type="text" placeholder="CEO"/>
    <FieldInvalidFeedbackCollapse<BusinessPlanFormValues> field="title"/>
  </Form.FloatingLabel>

const BusinessNameField = () =>
  <Form.FloatingLabel label="Business Name">
    <FieldControl<BusinessPlanFormValues> field="businessName" type="text" placeholder="Business Name"/>
    <FieldInvalidFeedbackCollapse<BusinessPlanFormValues> field="businessName"/>
  </Form.FloatingLabel>

const BusinessStructureField = () => <>
  <Form.Label className="px-1">What is the structure of your business?</Form.Label>
  <Form.FloatingLabel label="Business Structure">
    <FieldSelectionWithOther<BusinessPlanFormValues>
      type="text"
      default="Select a Business Structure"
      field="businessStructure"
      options={['C Corp', 'S Corp', 'LLC', 'LLP', 'General Partnership', 'Sole Proprietor', 'Nonprofit']}
    />
    <FieldInvalidFeedbackCollapse<BusinessPlanFormValues> field="businessStructure"/>
  </Form.FloatingLabel>
</>

const BusinessStageField = () => <>
  <Form.Label className="px-1">What stage is business operating at?</Form.Label>
  <Form.FloatingLabel label="Business Stage">
    <FieldSelectionWithOther<BusinessPlanFormValues>
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
    <FieldInvalidFeedbackCollapse<BusinessPlanFormValues> field="businessStage"/>
  </Form.FloatingLabel>
</>

const DateBusinessStartedField = () => <>
  <Form.Label className="px-1">What date did your business start?</Form.Label>
  <Form.FloatingLabel label="Date Business Started" controlId="date-business-started">
    <FieldControl<BusinessPlanFormValues> field="dateBusinessStarted" type="date"/>
    <FieldInvalidFeedbackCollapse<BusinessPlanFormValues> field="dateBusinessStarted"/>
  </Form.FloatingLabel>
</>

const FranchiseAgreementField = () => {
  const { getFieldHelpers } = useFormikContext<BusinessPlanFormValues>()
  const { setValue, setTouched } = getFieldHelpers<File | null>('franchiseAgreement')

  const handleClearFranchiseAgreement = (value: boolean) => {
    if(!value) {
      setValue(null, false)
      setTouched(true, true)
    }
  }

  return <>
    <Form.Label as="p" className="mb-2">Is your business part of a franchise?</Form.Label>
    <YesNoControllerWithCollapse idPrefix="part-of-franchise" onChange={handleClearFranchiseAgreement}>
      <Form.Label className="mt-2">Please provide your franchise agreement documents</Form.Label>
      <Col md={9}>
        <FieldFileControl<BusinessPlanFormValues> field="franchiseAgreement"/>
      </Col>
    </YesNoControllerWithCollapse>
  </>
}

function BusinessPlanFormBody() {
  const { submitForm, values, setFieldValue } = useFormikContext<BusinessPlanFormValues>()
  const [hasSeparateMailingAddress, setHasSeparateMailingAddress] = useState(false)

  const handleSeparateMailingAddressChanged = (value: boolean) => setHasSeparateMailingAddress(value)

  const handlePhoneNumberChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()
    setFieldValue(event.target.name, formatPhoneNumber(event.target.value))
  }

  return <Form noValidate>
    <FormCategory title="Personal Information">
      <FormGroupRow>
        <FormGroupCol md={6} className="mb-3 mb-md-0" component={FirstNameField}/>
        <FormGroupCol md={6} component={LastNameField}/>
      </FormGroupRow>
      <FormGroupRow>
        <FormGroupCol sm={6} lg={3} className="mb-3 mb-lg-0" component={TitleField}/>
        <FormGroupCol sm={6} lg={3} className="mb-3 mb-lg-0">
          <Form.FloatingLabel label="Phone Number">
            <FieldControl<BusinessPlanFormValues>
              field="phoneNumber"
              type="tel"
              placeholder="(XXX) XXX-XXXX"
              autoCorrect="phone"
              overrideOnChange onChange={handlePhoneNumberChange}
              isValid={phoneNumberRegex.test(values.phoneNumber)}
            />
            <FieldInvalidFeedbackCollapse<BusinessPlanFormValues> field="phoneNumber"/>
          </Form.FloatingLabel>
        </FormGroupCol>
        <FormGroupCol lg={6}>
          <Form.FloatingLabel label="E-Mail">
            <FieldControl<BusinessPlanFormValues>
              field="email"
              type="email"
              placeholder="johnsmith@mail.com"
              isValid={emailRegex.test(values.email)}
            />
            <FieldInvalidFeedbackCollapse<BusinessPlanFormValues> field="email"/>
          </Form.FloatingLabel>
        </FormGroupCol>
      </FormGroupRow>
    </FormCategory>
    <FormCategory title="Business Information">
      <FormGroupRow>
        <FormGroupCol md={6} className="mb-3 mb-md-0" component={BusinessNameField}/>
        <FormGroupCol md={6}>
          <Form.FloatingLabel label="Business Phone Number">
            <FieldControl<BusinessPlanFormValues>
              field="businessPhoneNumber"
              type="tel"
              placeholder="(XXX) XXX-XXXX"
              overrideOnChange onChange={handlePhoneNumberChange}
              isValid={phoneNumberRegex.test(values.businessPhoneNumber)}
            />
            <FieldInvalidFeedbackCollapse<BusinessPlanFormValues> field="businessPhoneNumber"/>
          </Form.FloatingLabel>
        </FormGroupCol>
      </FormGroupRow>
      <FormGroupRow>
        <FormGroupCol md={6} lg={4} className="mb-3 mb-lg-0" component={BusinessStructureField}/>
        <FormGroupCol md={6} lg={4} className="mb-3 mb-lg-0" component={BusinessStageField}/>
        <FormGroupCol lg={4} component={DateBusinessStartedField}/>
      </FormGroupRow>
      <FormGroupRow>
        <FormGroupCol lg={10}>
          <Form.Label className="px-1">What professional licenses does your business have?</Form.Label>
          <FieldExpandingList<BusinessPlanFormValues>
            withInvalidFeedback
            placeholder="Professional License"
            field="professionalLicenses"
            addButtonLabel="Add License"
          />
        </FormGroupCol>
      </FormGroupRow>
      <FormGroupRow>
        <FormGroupCol>
          <FieldYesNo<BusinessPlanFormValues>
            field="interestedInFederalContractCertification"
            label="If your organization is for profit, are you interested in being certified for federal contracts or government grants?"
          />
        </FormGroupCol>
      </FormGroupRow>
      <FormGroupRow>
        <FormGroupCol>
          <FieldYesNo<BusinessPlanFormValues>
            field="appliedForCertificationsInThePast"
            label="Have you applied for a certification in the past?"
          />
        </FormGroupCol>
      </FormGroupRow>
      <FormGroupRow>
        <FormGroupCol>
          <FranchiseAgreementField/>
        </FormGroupCol>
      </FormGroupRow>
      <FormGroupRow>
        <FormGroupCol>
          <FieldYesNo<BusinessPlanFormValues>
            field="holdsBusinessLicense"
            label="Does your business hold a business license?"
          />
        </FormGroupCol>
      </FormGroupRow>
      <FormGroupRow>
        <FormGroupCol>
          <FieldYesNo<BusinessPlanFormValues>
            field="organizationBonded"
            label="Is your organization bonded?"
          />
        </FormGroupCol>
      </FormGroupRow>
    </FormCategory>
    <FormAddressInfo
      title="Address Information"
      withValidation
      streetField="streetAddress"
      cityField="city"
      stateField="state"
      zipField="zip"
    />
    <FormGroupRow>
      <FormGroupCol>
        <Form.Label>Do you have a separate mailing address?</Form.Label>
        <YesNoController idPrefix="separate-mailing-address" onChange={handleSeparateMailingAddressChanged}/>
      </FormGroupCol>
    </FormGroupRow>
    <Collapse in={hasSeparateMailingAddress}>
      <div>
        <FormAddressInfo
          title="Mailing Address Information"
          streetField="mailingStreetAddress"
          cityField="mailingCity"
          stateField="mailingState"
          zipField="mailingZip"
        />
      </div>
    </Collapse>
    <Row>
      <Col className="d-flex">
        <Button className="flex-fill" variant="dates-primary" type="button" onClick={submitForm}>
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
  dateBusinessStarted: '',
  professionalLicenses: [],
  interestedInFederalContractCertification: false,
  appliedForCertificationsInThePast: false,
  franchiseAgreement: null,
  organizationBonded: false,
  holdsBusinessLicense: false,
  streetAddress: '',
  city: '',
  state: '',
  zip: '',
  mailingStreetAddress: '',
  mailingCity: '',
  mailingState: '',
  mailingZip: ''
}

export default function BusinessPlanForm() {
  const [state, setState] = useState({ showResultModal: false })
  const [form, submissionState] = useFormSubmission<BusinessPlanFormValues>('Business Plan Form', 'multipart/form-data')
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
      type: key === 'franchiseAgreement' ? 'file' : 'text', // TODO
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
