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
import { Spinner } from 'react-bootstrap'
import classNames from 'classnames'

type LoadingSpinnerProps = {
  className?: string
}

const LoadingSpinner = (props: LoadingSpinnerProps) =>
  <div className={classNames('d-flex', 'justify-content-around', 'align-items-center', props.className)}>
    <Spinner animation="border"/>
  </div>

export default LoadingSpinner
