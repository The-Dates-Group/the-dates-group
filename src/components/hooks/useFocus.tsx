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
import { RefObject, useEffect, useRef, useState } from 'react'

const compareRefToTarget = (ref: RefObject<any>, event: Event) =>
  ref.current && ref.current === event.target

const oneTimeDOMEvent = (target: EventTarget, event: keyof DocumentEventMap, fn: (event: Event) => void) => {
  target.addEventListener(event, fn)
  return () => target.removeEventListener(event, fn)
}

type FocusHookState = {
  readonly wasFocused: boolean
}

type UnfocusHookState = {
  readonly wasUnfocused: boolean
}

const focusHookDefaultState = { wasFocused: false }

const unfocusHookDefaultState = { wasUnfocused: false }

export function useFocus<E extends EventTarget>(onFocus?: () => void): [RefObject<E | undefined>, boolean] {
  const [state, setState] = useState<FocusHookState>(focusHookDefaultState)
  const ref = useRef<E>()

  useEffect(() => {
    // if the ref is not even initialized, do not bother
    if(!ref.current) return
    // we've already run this hook
    if(state.wasFocused) return
    // we will await when the current target becomes focused
    return oneTimeDOMEvent(ref.current, 'focusin', (event) => {
      if(compareRefToTarget(ref, event)) {
        setState(prevState => ({ ...prevState, wasFocused: true }))
        if(onFocus) onFocus()
      }
    })
  }, [state, onFocus])

  return [ref, state.wasFocused]
}

export function useUnfocus<E extends EventTarget>(onUnfocus?: () => void): [RefObject<E | undefined>, boolean] {
  const [state, setState] = useState<UnfocusHookState>(unfocusHookDefaultState)
  const [ref, wasFocused] = useFocus<E>()

  useEffect(() => {
    // if the ref is not even initialized, do not bother
    if(!ref.current) return
    // wait until we are focused to begin with
    if(!wasFocused) return
    // we've already run this hook
    if(state.wasUnfocused) return
    // we will await when the current target becomes unfocused
    return oneTimeDOMEvent(ref.current, 'focusout', (event) => {
      if(compareRefToTarget(ref, event)) {
        setState(prevState => ({ ...prevState, wasUnfocused: true }))
        if(onUnfocus) onUnfocus()
      }
    })
    // eslint-disable-next-line
  }, [state, wasFocused, onUnfocus]) // ref is not a dependency because it's origin is internal to useFocus

  return [ref, state.wasUnfocused]
}
