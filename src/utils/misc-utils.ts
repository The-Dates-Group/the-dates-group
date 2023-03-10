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

/**
 * Maps a number of `T` using `mapFn` for every `i` between 0 (inclusive) and `n` (exclusive)
 *
 * @param n the number of elements to map
 * @param mapFn the function to map with
 */
export function mapConsecutively<T>(n: number, mapFn: (i: number) => T): T[] {
  const out = [] as T[]
  for(let i = 0; i < n; i++)
    out.push(mapFn(i))
  return out
}
