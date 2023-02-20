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
import { ChangeEvent, PropsWithChildren, useState } from 'react'
import { Collapse, Form } from 'react-bootstrap'

export interface YesNoControllerProps {
  idPrefix: string
  defaultValue?: boolean
  onExpand?: (value: boolean) => void
}

export type YesNoControllerWithCollapseProps = PropsWithChildren<YesNoControllerProps>

export default function YesNoController({ idPrefix, defaultValue, onExpand }: YesNoControllerProps) {
  const [value, setValue] = useState(defaultValue || false)

  const yesID = `${idPrefix}-yes`
  const noID = `${idPrefix}-no`

  const handleYesChanged = (event: ChangeEvent<HTMLInputElement>) => {
    if(event.target.checked) {
      setValue(true)
      if(onExpand) onExpand(true)
    }
  }

  const handleNoChanged = (event: ChangeEvent<HTMLInputElement>) => {
    if(event.target.checked) {
      setValue(false)
      if(onExpand) onExpand(false)
    }
  }

  return <>
    <Form.Check>
      <Form.Check.Input id={yesID} checked={value} onChange={handleYesChanged}/>
      <Form.Check.Label htmlFor={yesID}>Yes</Form.Check.Label>
    </Form.Check>
    <Form.Check>
      <Form.Check.Input id={noID} checked={!value} onChange={handleNoChanged}/>
      <Form.Check.Label htmlFor={noID}>No</Form.Check.Label>
    </Form.Check>
  </>
}

export function YesNoControllerWithCollapse(props: YesNoControllerWithCollapseProps) {
  const { idPrefix, defaultValue, children, onExpand } = props
  const [expand, setExpand] = useState(defaultValue)

  const handleOnChange = (value: boolean) => {
    setExpand(value)
    if(onExpand) onExpand(value)
  }

  return <>
    <YesNoController idPrefix={idPrefix} defaultValue={defaultValue} onExpand={handleOnChange}/>
    <Collapse in={expand}>
      <div>{children}</div>
    </Collapse>
  </>
}
