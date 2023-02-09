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

export type PartialSetStateAction<S, P extends Partial<S>> = P | ((prevState: S) => P)

/**
 * Creates a state generation function that accepts a previous state and returns
 * a new state that merges the value provided by a given `newState` parameter.
 *
 * As a result of typing constraints, this may only be used on `object` type states.
 *
 * @param newState The newState provider, either a partial state or a function
 * that can accept the full previous state and returns a partial state
 */
export const fromPrevState = <S, P extends Partial<S>>(newState: PartialSetStateAction<S, P>): (prevState: S) => S => {
  if(typeof newState !== 'function')
    return prevState => ({ ...prevState, ...newState })
  return prevState => ({ ...prevState, ...newState(prevState) })
}
