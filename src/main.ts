/*
 * Copyright 2025 Stefan Schätz
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
import './style.css'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h1>CS2 Map Annotator</h1>
    <p>A web application that allows you to annotate maps of <b>Counter-Strike2</b> or other games with utility lineups,
       critical spots and other tactically useful information.</p>
   <p>by Stefan Schätz, 2025</p>
  </div>
`

setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)
