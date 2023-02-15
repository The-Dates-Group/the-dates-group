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
import Image, { StaticImageData } from 'next/image'
import { useMediaQueryMatches } from '@/components/hooks/useMediaQuery'

export type AssociationLogoProps = {
  name: string
  src: StaticImageData
  url: string
}

export default function AssociationLogo(props: AssociationLogoProps) {
  const isBelowMd = useMediaQueryMatches()
  return (
    <div className="position-relative h-100 d-flex justify-content-center">
      <Image src={props.src} alt={`${props.name} logo`} placeholder="blur" height={isBelowMd ? 200 : 300}/>
      <a href={props.url} className="stretched-link" target="_blank" rel="noreferrer"></a>
    </div>
  )
}
