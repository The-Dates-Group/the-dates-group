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
import type { AsProp } from 'react-bootstrap/helpers'
import { ElementType, forwardRef, PropsWithChildren } from 'react'
import classNames from 'classnames'

export type VerticallyRuledProps = AsProp & PropsWithChildren & {
  vrClassName?: string
  innerClassName?: string
  className?: string
  innerAs?: ElementType<{ className?: string }>
  placement?: 'left' | 'right'
}

const VerticallyRuled = forwardRef<HTMLElement, VerticallyRuledProps>((props, ref) => {
  const {
    as: As = 'div',
    innerAs: InnerAs = 'p',
    vrClassName,
    innerClassName,
    children,
    className,
    placement,
    ...asProps
  } = props
  return (
    <As {...asProps} ref={ref} className={classNames('d-flex', className)}>
      {placement === 'right' ? null : <div className={classNames('vr', vrClassName)}/>}
      <InnerAs className={classNames('mb-0', 'py-2', 'px-2', 'rounded-end', 'flex-fill', innerClassName)}>
        {children}
      </InnerAs>
      {placement === 'right' ? <div className={classNames('vr', vrClassName)}/> : null}
    </As>
  )
})

VerticallyRuled.displayName = 'VerticallyRuled'

export default VerticallyRuled
