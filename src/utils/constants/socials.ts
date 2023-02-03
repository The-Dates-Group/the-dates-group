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
import { Facebook, Icon, Instagram, Twitter, Youtube } from 'react-bootstrap-icons'

export type SocialType = 'Instagram' | 'YouTube' | 'Facebook' | 'Twitter'
export type Social = {
  link: string
  type: SocialType
  BsIcon?: Icon
}

const socials: Social[] = [
  {
    link: 'https://www.instagram.com/the_dates_group/',
    type: 'Instagram',
    BsIcon: Instagram
  },
  {
    link: 'https://www.youtube.com/channel/UCywHVYXCg_G8xyv7MLoR7xQ',
    type: 'YouTube',
    BsIcon: Youtube
  },
  {
    link: 'https://www.facebook.com/DatesGroup',
    type: 'Facebook',
    BsIcon: Facebook
  },
  {
    link: 'https://twitter.com/datesgroup',
    type: 'Twitter',
    BsIcon: Twitter
  }
]

export default socials
