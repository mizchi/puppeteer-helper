/* @flow */
import React from 'react'
import range from 'lodash.range'
export type Props = {}

export default function App(_props: Props) {
  return (
    <div>
      <header>
        <h1>SSR perf test</h1>
      </header>
      <main>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            width: '400px',
            flexWrap: 'wrap'
          }}
        >
          {range(100000).map(i => {
            return (
              <div style={{ flex: 1 }} key={`${i}`}>
                [{i}]
              </div>
            )
          })}
        </div>
      </main>
    </div>
  )
}
