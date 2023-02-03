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

export type BreakpointName = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'
export type BreakpointValue<S extends 0 | 576 | 768 | 992 | 1200 | 1400> = S
export type ExtraSmallBreakpoint = BreakpointValue<0>
export type SmallBreakpoint = BreakpointValue<576>
export type MediumBreakpoint = BreakpointValue<768>
export type LargeBreakpoint = BreakpointValue<992>
export type ExtraLargeBreakpoint = BreakpointValue<1200>
export type ExtraExtraLargeBreakpoint = BreakpointValue<1400>
export type Breakpoint =
  ExtraSmallBreakpoint
  | SmallBreakpoint
  | MediumBreakpoint
  | LargeBreakpoint
  | ExtraLargeBreakpoint
  | ExtraExtraLargeBreakpoint

export const xs: ExtraSmallBreakpoint = 0 // px
export const sm: SmallBreakpoint = 576 // px
export const md: MediumBreakpoint = 768 // px
export const lg: LargeBreakpoint = 992 // px
export const xl: ExtraLargeBreakpoint = 1200 // px
export const xxl: ExtraExtraLargeBreakpoint = 1400 // px

export type BreakpointMap = {
  [name in BreakpointName]: Breakpoint
}

const breakpoints: BreakpointMap = { xs, sm, md, lg, xl, xxl }

export default breakpoints
