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
import { ChangeEvent, ChangeEventHandler, FocusEventHandler, PropsWithChildren, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import {
  Button,
  Card,
  Col,
  Collapse,
  ColProps,
  Form,
  FormControlProps,
  InputGroup,
  Modal,
  Row,
  RowProps
} from 'react-bootstrap'
import { Formik, useFormikContext } from 'formik'
import useFormSubmission from '@/components/hooks/useFormSubmission'
import { fromPrevState } from '@/utils/component-utils'
import { emailRegex, phoneNumberRegex } from '@/utils/regexes'
import NetlifyForm from '@/components/NetlifyForm'
import classNames from 'classnames'

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
  partOfFranchise: boolean
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

interface FieldProp {
  field: keyof BusinessPlanFormValues
}

interface FieldControlProps extends FieldProp, FormControlProps {
  overrideOnChange?: boolean
  overrideOnBlur?: boolean
}

interface FieldYesNoProps extends FieldProp, PropsWithChildren {
}

interface FieldSelectionWithOtherProps extends PropsWithChildren, FieldProp, FieldControlProps {
  default: string
  options: string[]
}

interface FieldExpandingListProps extends FieldProp {
  addButtonLabel?: string
  removeButtonLabel?: string
  placeholder: string
}

type FieldInvalidFeedbackCollapseProps = FieldProp

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

function FieldYesNo({ field, children }: FieldYesNoProps) {
  const { values, touched, errors, ...formik } = useFormikContext<BusinessPlanFormValues>()

  const fieldValue = values[field]
  if(typeof fieldValue !== 'boolean')
    throw new Error('Field is not a boolean type!')

  const handleYesChanged = (event: ChangeEvent<HTMLInputElement>) => {
    if(event.target.checked) {
      formik.setFieldValue(field, true, false)
      formik.setFieldTouched(field, true, true)
    }
  }

  const handleNoChanged = (event: ChangeEvent<HTMLInputElement>) => {
    if(event.target.checked) {
      formik.setFieldValue(field, false, false)
      formik.setFieldTouched(field, true, true)
    }
  }

  return <>
    <Form.Label>{children}</Form.Label>
    <Form.Check className="mx-1">
      <Form.Check.Input id={`${field}-yes`} checked={fieldValue} onChange={handleYesChanged}/>
      <Form.Check.Label htmlFor={`${field}-yes`}>Yes</Form.Check.Label>
    </Form.Check>
    <Form.Check className="mx-1">
      <Form.Check.Input id={`${field}-no`} checked={!fieldValue} onChange={handleNoChanged}/>
      <Form.Check.Label htmlFor={`${field}-no`}>No</Form.Check.Label>
    </Form.Check>
  </>
}

function FieldSelectionWithOther(props: FieldSelectionWithOtherProps) {
  const { default: defaultOption, options, field, ...controlProps } = props
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
        <FieldControl field={field} className="rounded-0 rounded-bottom" {...controlProps}/>
      </div>
    </Collapse>
  </>
}

function FieldExpandingList(props: FieldExpandingListProps) {
  const { field, addButtonLabel, removeButtonLabel, placeholder } = props
  const { values, touched, errors, ...formik } = useFormikContext<BusinessPlanFormValues>()
  const currentField = values[field]
  if(!Array.isArray(currentField)) {
    throw new Error('Field was not an array!')
  }

  const handleIndexChange = (index: number) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const currentField = values[field] as Array<string>
    currentField[index] = event.target.value
    formik.setFieldValue(field, currentField, false)
    formik.setFieldTouched(field, true, true)
  }

  const handleAddButtonClick = () => {
    const currentField = values[field] as Array<string>
    currentField.push('')
    formik.setFieldValue(field, currentField, false)
    formik.setFieldTouched(field, true, true)
  }

  const handleRemoveButtonClick = (index: number) => () => {
    const currentField = values[field] as Array<string>
    const filtered = currentField.filter((_, i) => i !== index)
    formik.setFieldValue(field, filtered, false)
    formik.setFieldTouched(field, true, true)
  }

  return <>
    {currentField.map((value, index) => (
      <InputGroup hasValidation className="mb-1" key={`${field}-item-index-${index}`}>
        <Button variant="dates-primary" onClick={handleRemoveButtonClick(index)}>
          {removeButtonLabel || 'Remove'}
        </Button>
        <Form.Control
          name={field}
          value={value}
          placeholder={placeholder}
          onChange={handleIndexChange(index)}
          onBlur={formik.handleBlur}
          isValid={value.length > 0}
          isInvalid={value.length === 0} // this is a hack to actually provide input validation on empty
        />
        <FieldInvalidFeedbackCollapse field={field}/>
      </InputGroup>
    ))}
    <Button variant="dates-primary" className="mt-2" onClick={handleAddButtonClick}>
      {addButtonLabel || 'Add'}
    </Button>
  </>
}

function FieldInvalidFeedbackCollapse({ field }: FieldInvalidFeedbackCollapseProps) {
  const { touched, errors } = useFormikContext<BusinessPlanFormValues>()
  return (
    <Collapse in={touched[field] && !!errors[field]}>
      <Form.Control.Feedback type="invalid">
        {errors[field]}
      </Form.Control.Feedback>
    </Collapse>
  )
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

const FormGroupCol = (props: ColProps) =>
  <Form.Group as={Col} {...props}/>

function FormPersonalInfo() {
  const { setFieldValue, values } = useFormikContext<BusinessPlanFormValues>()
  const handlePhoneNumberChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()
    setFieldValue(event.target.name, formatPhoneNumber(event.target.value))
  }

  return <FormCategory title="Personal Information">
    <FormGroupRow>
      <FormGroupCol md={6} className="mb-3 mb-md-0">
        <Form.FloatingLabel label="First Name">
          <FieldControl field="firstName" type="text" placeholder="John"/>
          <FieldInvalidFeedbackCollapse field="firstName"/>
        </Form.FloatingLabel>
      </FormGroupCol>
      <FormGroupCol md={6}>
        <Form.FloatingLabel label="Last Name">
          <FieldControl field="lastName" type="text" placeholder="Smith"/>
          <FieldInvalidFeedbackCollapse field="lastName"/>
        </Form.FloatingLabel>
      </FormGroupCol>
    </FormGroupRow>
    <FormGroupRow>
      <FormGroupCol sm={6} lg={3} className="mb-3 mb-lg-0">
        <Form.FloatingLabel label="Title">
          <FieldControl field="title" type="text" placeholder="CEO"/>
          <FieldInvalidFeedbackCollapse field="title"/>
        </Form.FloatingLabel>
      </FormGroupCol>
      <FormGroupCol sm={6} lg={3} className="mb-3 mb-lg-0">
        <Form.FloatingLabel label="Phone Number">
          <FieldControl
            field="phoneNumber"
            type="tel"
            placeholder="(XXX) XXX-XXXX"
            autoCorrect="phone"
            overrideOnChange onChange={handlePhoneNumberChange}
            isValid={phoneNumberRegex.test(values.phoneNumber)}
          />
          <FieldInvalidFeedbackCollapse field="phoneNumber"/>
        </Form.FloatingLabel>
      </FormGroupCol>
      <FormGroupCol lg={6}>
        <Form.FloatingLabel label="E-Mail">
          <FieldControl
            field="email"
            type="email"
            placeholder="johnsmith@mail.com"
            isValid={emailRegex.test(values.email)}
          />
          <FieldInvalidFeedbackCollapse field="email"/>
        </Form.FloatingLabel>
      </FormGroupCol>
    </FormGroupRow>
  </FormCategory>
}

function FormBusinessInfo() {
  const { setFieldValue, values } = useFormikContext<BusinessPlanFormValues>()
  const handlePhoneNumberChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()
    setFieldValue(event.target.name, formatPhoneNumber(event.target.value))
  }

  return <FormCategory title="Business Information">
    <FormGroupRow>
      <FormGroupCol md={6} className="mb-3 mb-md-0">
        <Form.FloatingLabel label="Business Name">
          <FieldControl field="businessName" type="text" placeholder="Business Name"/>
          <FieldInvalidFeedbackCollapse field="businessName"/>
        </Form.FloatingLabel>
      </FormGroupCol>
      <FormGroupCol md={6}>
        <Form.FloatingLabel label="Business Phone Number">
          <FieldControl
            field="businessPhoneNumber"
            type="tel"
            placeholder="(XXX) XXX-XXXX"
            overrideOnChange onChange={handlePhoneNumberChange}
            isValid={phoneNumberRegex.test(values.businessPhoneNumber)}
          />
          <FieldInvalidFeedbackCollapse field="businessPhoneNumber"/>
        </Form.FloatingLabel>
      </FormGroupCol>
    </FormGroupRow>
    <FormGroupRow>
      <FormGroupCol md={6} lg={4} className="mb-3 mb-lg-0">
        <Form.Label className="px-1">What is the structure of your business?</Form.Label>
        <Form.FloatingLabel label="Business Structure">
          <FieldSelectionWithOther
            type="text"
            default="Select a Business Structure"
            field="businessStructure"
            options={['C Corp', 'S Corp', 'LLC', 'LLP', 'General Partnership', 'Sole Proprietor', 'Nonprofit']}
          />
          <FieldInvalidFeedbackCollapse field="businessStructure"/>
        </Form.FloatingLabel>
      </FormGroupCol>
      <FormGroupCol md={6} lg={4} className="mb-3 mb-lg-0">
        <Form.Label className="px-1">What stage is business operating at?</Form.Label>
        <Form.FloatingLabel label="Business Stage">
          <FieldSelectionWithOther
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
          <FieldInvalidFeedbackCollapse field="businessStage"/>
        </Form.FloatingLabel>
      </FormGroupCol>
      <FormGroupCol lg={4}>
        <Form.Label className="px-1">What date did your business start?</Form.Label>
        <Form.FloatingLabel label="Date Business Started" controlId="date-business-started">
          <FieldControl field="dateBusinessStarted" type="date"/>
          <FieldInvalidFeedbackCollapse field="dateBusinessStarted"/>
        </Form.FloatingLabel>
      </FormGroupCol>
    </FormGroupRow>
    <FormGroupRow>
      <FormGroupCol lg={10}>
        <Form.Label className="px-1">What professional licenses does your business have?</Form.Label>
        <FieldExpandingList
          placeholder="Professional License"
          field="professionalLicenses"
          addButtonLabel="Add License"
        />
      </FormGroupCol>
    </FormGroupRow>
    <FormGroupRow>
      <FormGroupCol>
        <FieldYesNo field="interestedInFederalContractCertification">
          If your organization is for profit, are you interested in
          being certified for federal contracts or government grants?
        </FieldYesNo>
      </FormGroupCol>
    </FormGroupRow>
    <FormGroupRow>
      <FormGroupCol>
        <FieldYesNo field="appliedForCertificationsInThePast">
          Have you applied for a certification in the past?
        </FieldYesNo>
      </FormGroupCol>
    </FormGroupRow>
    <FormGroupRow>
      <FormGroupCol>
        <FieldYesNo field="partOfFranchise">
          Is your business part of a franchise?
        </FieldYesNo>
      </FormGroupCol>
    </FormGroupRow>
    <FormGroupRow>
      <FormGroupCol>
        <FieldYesNo field="holdsBusinessLicense">
          Does your business hold a business license?
        </FieldYesNo>
      </FormGroupCol>
    </FormGroupRow>
    <FormGroupRow>
      <FormGroupCol>
        <FieldYesNo field="organizationBonded">
          Is your organization bonded?
        </FieldYesNo>
      </FormGroupCol>
    </FormGroupRow>
  </FormCategory>
}

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

function BusinessPlanFormBody() {
  const { submitForm } = useFormikContext<BusinessPlanFormValues>()
  const [hasSeparateMailingAddress, setHasSeparateMailingAddress] = useState(false)
  const handleYesChanged = () => setHasSeparateMailingAddress(true)
  const handleNoChanged = () => setHasSeparateMailingAddress(false)
  return <Form noValidate>
    <FormPersonalInfo/>
    <FormBusinessInfo/>
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
        <Form.Check className="mx-1">
          <Form.Check.Input
            id="separate-mailing-address-yes"
            checked={hasSeparateMailingAddress}
            onChange={handleYesChanged}/>
          <Form.Check.Label htmlFor="separate-mailing-address-yes">Yes</Form.Check.Label>
        </Form.Check>
        <Form.Check className="mx-1">
          <Form.Check.Input
            id="separate-mailing-address-no"
            checked={!hasSeparateMailingAddress}
            onChange={handleNoChanged}/>
          <Form.Check.Label htmlFor="separate-mailing-address-no">No</Form.Check.Label>
        </Form.Check>
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
  partOfFranchise: false,
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

// interface FieldCheckboxProps extends FieldProp, PropsWithChildren {
// }

// function FieldCheckbox({ field, children }: FieldCheckboxProps) {
//   const { values, touched, errors, ...formik } = useFormikContext<BusinessPlanFormValues>()
//
//   const fieldValue = values[field]
//   if(typeof fieldValue !== 'boolean')
//     throw new Error('Field is not a boolean type!')
//
//   return <InputGroup className="w-100 flex-nowrap">
//     <InputGroup.Checkbox
//       type="checkbox"
//       className="my-auto"
//       name={field}
//       checked={Boolean(values[field])}
//       isValid={fieldValue}
//       onChange={formik.handleChange}
//       onBlur={formik.handleBlur}/>
//     <InputGroup.Text className="text-wrap">
//       {children}
//     </InputGroup.Text>
//   </InputGroup>
// }

// type FieldValidFeedbackCollapseProps = FieldProp & { message: string }

// function FieldValidFeedbackCollapse({ field, message }: FieldValidFeedbackCollapseProps) {
//   const { touched, values } = useFormikContext<BusinessPlanFormValues>()
//   const value = values[field]
//   const shouldShow = touched[field] && typeof value === 'string' ? value.length > 0 :
//     typeof value === 'boolean' ? value : Array.isArray(value)
//   return (
//     <Collapse in={shouldShow}>
//       <Form.Control.Feedback type="valid">
//         {message}
//       </Form.Control.Feedback>
//     </Collapse>
//   )
// }
