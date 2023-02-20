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
import { PropsWithChildren, useState } from 'react'
import { Button, Card, Col, Collapse, Form, Modal, Row } from 'react-bootstrap'
import { useRouter } from 'next/router'
import { Formik, useFormikContext } from 'formik'
import { array, boolean, object, string } from 'yup'

import useFormSubmission from '@/components/hooks/useFormSubmission'
import { NetlifySchemaForm } from '@/components/NetlifyForm'
import YesNoController, { YesNoControllerWithCollapse } from '@/components/YesNoController'

import FieldControl, { FieldFileControl } from '@/components/forms/FieldControl'
import FieldSelectionWithOther from '@/components/forms/FieldSelectionWithOther'
import FieldYesNo from '@/components/forms/FieldYesNo'
import FieldInvalidFeedbackCollapse from '@/components/forms/FieldInvalidFeedbackCollapse'
import FieldExpandingList from '@/components/forms/FieldExpandingList'

import { fromPrevState } from '@/utils/component-utils'
import { FormGroupCol, FormGroupRow } from '@/components/forms/helpers'
import { emailRegex, phoneNumberRegex } from '@/utils/regexes'
import { file } from '@/utils/schema-utils'

const formatPhoneNumber = (value: string) => {
  if(!value) return value
  const phoneNumber = value.replace(/\D/g, '')
  const phoneNumberLength = phoneNumber.length
  if(phoneNumberLength < 4) return phoneNumber
  if(phoneNumberLength < 7) return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`
  return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`
}

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

const formSchema = object({
  firstName: string()
    .default<string>('')
    .required('Please enter your first name'),

  lastName: string().default<string>('').required('Please enter your last name'),

  title: string().default<string>('').required('Please enter your title'),

  phoneNumber: string()
    .default<string>('')
    .transform(formatPhoneNumber)
    .required('Please enter your phone number')
    .test({
      name: 'matches',
      message: 'Please enter a valid phone number',
      test: (value: string) => value.length > 0 ? phoneNumberRegex.test(value) : true
    })
    .meta({ formType: 'tel' }),

  email: string()
    .email('Please enter a valid email')
    .default<string>('')
    .required('Please enter your email')
    .meta({ formType: 'email' }),

  businessName: string().default<string>('').required('Please enter your business name'),

  businessPhoneNumber: string()
    .default<string>('')
    .transform(formatPhoneNumber)
    .required('Please enter your business phone number')
    .test({
      name: 'matches',
      message: 'Please enter a valid phone number',
      test: (value: string) => value.length > 0 ? phoneNumberRegex.test(value) : true
    })
    .meta({ formType: 'tel' }),

  businessStructure: string<BusinessStructure | string>()
    .default<string>('')
    .required('Please specify your business structure'),

  businessStage: string<BusinessStage | string>()
    .default<string>('')
    .required('Please specify your business structure'),

  dateBusinessStarted: string()
    .default<string>('')
    .required('Please specify when your business started! If you are unsure of the exact date, an estimate is fine.')
    .meta({ formType: 'date' }),

  professionalLicenses: array(string().default<string>(''))
    .default<string[]>([])
    .test({
      name: 'check-items',
      message: 'Please provide a license for each field',
      test: (value: string[]) => typeof value.find(item => item.length === 0) === 'undefined'
    }),

  interestedInFederalContractCertification: boolean().default<boolean>(false).required(),
  appliedForCertificationsInThePast: boolean().default<boolean>(false).required(),

  hasFranchiseAgreement: boolean().default<boolean>(false).required(),
  franchiseAgreement: file()
    .meta({ formType: 'file' })
    .when(['hasFranchiseAgreement'], (values, schema, { parent }) =>
      parent && parent.hasFranchiseAgreement ?
        schema.nonNullable().required('Please upload your franchise agreement documentation') :
        schema.nullable().default<File | null>(null)
    ),

  organizationBonded: boolean().default<boolean>(false).required(),
  proofOfBondingCapacity: file()
    .meta({ formType: 'file' })
    .when(['organizationBonded'], (values, schema, { parent }) =>
      parent && parent.organizationBonded ?
        schema.nonNullable().required('Please upload your proof of bonding capacity') :
        schema.nullable().default<File | null>(null)
    ),

  hasBusinessLicense: boolean().default<boolean>(false).required(),
  businessLicense: file()
    .meta({ formType: 'file' })
    .when(['hasBusinessLicense'], (values, schema, { parent }) =>
      parent && parent.organizationBonded ?
        schema.nonNullable().required('Please upload your business license') :
        schema.nullable().default<File | null>(null)
    ),

  streetAddress: string().default<string>('').required('Please enter your street address'),
  city: string().default<string>('').required('Please enter your street city'),
  state: string().default<string>('').required('Please enter your street state'),
  zip: string().default<string>('').required('Please enter your street zip code'),

  mailingStreetAddress: string().default<string>(''),
  mailingCity: string().default<string>(''),
  mailingState: string().default<string>(''),
  mailingZip: string().default<string>('')
})

type BusinessPlanFormValues = ReturnType<typeof formSchema.getDefault>

interface FormCategoryProps extends PropsWithChildren {
  title: string
}

interface FormAddressInfoProps {
  title: string
  withValidation?: boolean
  streetField: keyof BusinessPlanFormValues
  cityField: keyof BusinessPlanFormValues
  stateField: keyof BusinessPlanFormValues
  zipField: keyof BusinessPlanFormValues
}

const FormCategory = ({ title, children }: FormCategoryProps) =>
  <>
    <Card.Subtitle as="h2" className="text-center mb-3">
      {title}
    </Card.Subtitle>
    {children}
  </>

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

const FirstNameField = () => <Form.FloatingLabel label="First Name">
  <FieldControl<BusinessPlanFormValues> field="firstName" type="text" placeholder="John"/>
  <FieldInvalidFeedbackCollapse<BusinessPlanFormValues> field="firstName"/>
</Form.FloatingLabel>

const LastNameField = () => <Form.FloatingLabel label="Last Name">
  <FieldControl<BusinessPlanFormValues> field="lastName" type="text" placeholder="Smith"/>
  <FieldInvalidFeedbackCollapse<BusinessPlanFormValues> field="lastName"/>
</Form.FloatingLabel>

const TitleField = () => <Form.FloatingLabel label="Title">
  <FieldControl<BusinessPlanFormValues> field="title" type="text" placeholder="CEO"/>
  <FieldInvalidFeedbackCollapse<BusinessPlanFormValues> field="title"/>
</Form.FloatingLabel>

const PhoneNumberField = () => <Form.FloatingLabel label="Phone Number">
  <FieldControl<BusinessPlanFormValues>
    field="phoneNumber"
    placeholder="(XXX) XXX-XXXX"
    autoCorrect="phone"
    type="tel"
  />
  <FieldInvalidFeedbackCollapse<BusinessPlanFormValues> field="phoneNumber"/>
</Form.FloatingLabel>

const EmailField = () => {
  const { values } = useFormikContext<BusinessPlanFormValues>()
  return <Form.FloatingLabel label="E-Mail">
    <FieldControl<BusinessPlanFormValues>
      field="email"
      type="email"
      placeholder="johnsmith@mail.com"
      isValid={emailRegex.test(values.email)}
    />
    <FieldInvalidFeedbackCollapse<BusinessPlanFormValues> field="email"/>
  </Form.FloatingLabel>
}

const BusinessNameField = () => <Form.FloatingLabel label="Business Name">
  <FieldControl<BusinessPlanFormValues> field="businessName" type="text" placeholder="Business Name"/>
  <FieldInvalidFeedbackCollapse<BusinessPlanFormValues> field="businessName"/>
</Form.FloatingLabel>

const BusinessPhoneNumberField = () => <Form.FloatingLabel label="Business Phone Number">
  <FieldControl<BusinessPlanFormValues>
    field="businessPhoneNumber"
    placeholder="(XXX) XXX-XXXX"
    autoCorrect="phone"
    type="tel"
  />
  <FieldInvalidFeedbackCollapse<BusinessPlanFormValues> field="businessPhoneNumber"/>
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

const ProfessionalLicensesField = () => <>
  <Form.Label className="px-1">What professional licenses does your business have?</Form.Label>
  <FieldExpandingList<BusinessPlanFormValues>
    withInvalidFeedback
    placeholder="Professional License"
    field="professionalLicenses"
    addButtonLabel="Add License"
  />
</>

const InterestedInFederalContractCertificationField = () => <FieldYesNo<BusinessPlanFormValues>
  field="interestedInFederalContractCertification"
  label="If your organization is for profit, are you interested in being certified for federal contracts or government grants?"
/>

const AppliedForCertificationsInThePastField = () => <FieldYesNo<BusinessPlanFormValues>
  field="appliedForCertificationsInThePast"
  label="Have you applied for a certification in the past?"
/>

const FranchiseAgreementField = () => {
  const { setFieldValue, setFieldTouched } = useFormikContext<BusinessPlanFormValues>()

  const handleExpand = (value: boolean) => {
    setFieldValue('hasFranchiseAgreement', value, false)
    setFieldTouched('hasFranchiseAgreement', true, value)
    if(!value) {
      setFieldValue('franchiseAgreement', null, false)
      setFieldTouched('franchiseAgreement', false, true)
    }
  }

  return <>
    <Form.Label as="p" className="mb-2">Is your business part of a franchise?</Form.Label>
    <YesNoControllerWithCollapse idPrefix="part-of-franchise" onExpand={handleExpand}>
      <Form.Label className="mt-2">Upload your franchise agreement documents</Form.Label>
      <Col md={9}>
        <FieldFileControl<BusinessPlanFormValues> field="franchiseAgreement"/>
        <FieldInvalidFeedbackCollapse<BusinessPlanFormValues> field="franchiseAgreement"/>
      </Col>
    </YesNoControllerWithCollapse>
  </>
}

const ProofOfBondingCapacityField = () => {
  const { setFieldValue, setFieldTouched } = useFormikContext<BusinessPlanFormValues>()

  const handleExpand = (value: boolean) => {
    setFieldValue('organizationBonded', value, false)
    setFieldTouched('organizationBonded', true, value)
    if(!value) {
      setFieldValue('proofOfBondingCapacity', null, false)
      setFieldTouched('proofOfBondingCapacity', false, true)
    }
  }

  return <>
    <Form.Label as="p" className="mb-2">Is your organization bonded?</Form.Label>
    <YesNoControllerWithCollapse idPrefix="organization-bonded" onExpand={handleExpand}>
      <Form.Label className="mt-2">Upload your proof of bonding capacity</Form.Label>
      <Col md={9}>
        <FieldFileControl<BusinessPlanFormValues> field="proofOfBondingCapacity"/>
        <FieldInvalidFeedbackCollapse<BusinessPlanFormValues> field="proofOfBondingCapacity"/>
      </Col>
    </YesNoControllerWithCollapse>
  </>
}

const BusinessLicenseField = () => {
  const { setFieldValue, setFieldTouched } = useFormikContext<BusinessPlanFormValues>()

  const handleExpand = (value: boolean) => {
    setFieldValue('hasBusinessLicense', value, false)
    setFieldTouched('hasBusinessLicense', true, value)
    if(!value) {
      setFieldValue('businessLicense', null, false)
      setFieldTouched('businessLicense', false, true)
    }
  }

  return <>
    <Form.Label as="p" className="mb-2">Does your business have a business license?</Form.Label>
    <YesNoControllerWithCollapse idPrefix="has-business-license" onExpand={handleExpand}>
      <Form.Label className="mt-2">Upload your business license</Form.Label>
      <Col md={9}>
        <FieldFileControl<BusinessPlanFormValues> field="businessLicense"/>
        <FieldInvalidFeedbackCollapse<BusinessPlanFormValues> field="businessLicense"/>
      </Col>
    </YesNoControllerWithCollapse>
  </>
}

const BusinessPlanFormBody = (props: { preventSubmit: boolean }) => {
  const { submitForm } = useFormikContext<BusinessPlanFormValues>()
  const [hasSeparateMailingAddress, setHasSeparateMailingAddress] = useState(false)

  const handleSeparateMailingAddressChanged = (value: boolean) => setHasSeparateMailingAddress(value)

  return <Form noValidate>
    <FormCategory title="Personal Information">
      <FormGroupRow>
        <FormGroupCol md={6} className="mb-3 mb-md-0" component={FirstNameField}/>
        <FormGroupCol md={6} component={LastNameField}/>
      </FormGroupRow>
      <FormGroupRow>
        <FormGroupCol sm={6} lg={3} className="mb-3 mb-lg-0" component={TitleField}/>
        <FormGroupCol sm={6} lg={3} className="mb-3 mb-lg-0" component={PhoneNumberField}/>
        <FormGroupCol lg={6} component={EmailField}/>
      </FormGroupRow>
    </FormCategory>
    <FormCategory title="Business Information">
      <FormGroupRow>
        <FormGroupCol md={6} className="mb-3 mb-md-0" component={BusinessNameField}/>
        <FormGroupCol md={6} component={BusinessPhoneNumberField}/>
      </FormGroupRow>
      <FormGroupRow>
        <FormGroupCol md={6} lg={4} className="mb-3 mb-lg-0" component={BusinessStructureField}/>
        <FormGroupCol md={6} lg={4} className="mb-3 mb-lg-0" component={BusinessStageField}/>
        <FormGroupCol lg={4} component={DateBusinessStartedField}/>
      </FormGroupRow>
      <FormGroupRow>
        <FormGroupCol lg={10} component={ProfessionalLicensesField}/>
      </FormGroupRow>
      <FormGroupRow>
        <FormGroupCol component={InterestedInFederalContractCertificationField}/>
      </FormGroupRow>
      <FormGroupRow>
        <FormGroupCol component={AppliedForCertificationsInThePastField}/>
      </FormGroupRow>
      <FormGroupRow>
        <FormGroupCol component={FranchiseAgreementField}/>
      </FormGroupRow>
      <FormGroupRow>
        <FormGroupCol component={ProofOfBondingCapacityField}/>
      </FormGroupRow>
      <FormGroupRow>
        <FormGroupCol component={BusinessLicenseField}/>
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
        <YesNoController idPrefix="separate-mailing-address" onExpand={handleSeparateMailingAddressChanged}/>
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
        <Button
          disabled={props.preventSubmit}
          className="flex-fill"
          variant="dates-primary"
          type="button"
          onClick={submitForm}>
          Submit
        </Button>
      </Col>
    </Row>
  </Form>
}

export default function BusinessPlanForm() {
  const [state, setState] = useState({ showResultModal: false })
  const [form, submissionState] = useFormSubmission<BusinessPlanFormValues>('Business Plan Form', 'multipart/form-data')
  const router = useRouter()

  const handleFormSubmit = async (values: BusinessPlanFormValues) => {
    await form.submit(formSchema.cast(values))
    setState(fromPrevState({ showResultModal: true }))
  }

  const handleResultModalDismissed = (event: any) => {
    event.preventDefault()
    if(submissionState.isSuccess) return router.reload()
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
    <Formik<BusinessPlanFormValues>
      validateOnMount
      validationSchema={formSchema}
      initialValues={formSchema.getDefault()}
      onSubmit={handleFormSubmit}>
      <BusinessPlanFormBody preventSubmit={submissionState.isSubmitting || submissionState.isComplete}/>
    </Formik>
  </Card.Body>
}
