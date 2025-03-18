import React, { useEffect, useRef, useState } from 'react';
import useIsOnline from './FetchAPi';
 
function usePrev(value)
{
  const ref = useRef()

  useEffect(()=>{
    ref.current = value;
  },[value])
  return ref.current
}
function App() {
 const [count,setCount] = useState(0)
 const prevCount = usePrev(count);
 const online = useIsOnline()

  return (
    <>
     <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Counter with usePrev Hook</h1>
      <p>Current Count: {count}</p>
      <p>Previous Count: {prevCount}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setCount(count - 1)} style={{ marginLeft: '10px' }}>Decrement</button>
      <button>{online}</button>
    </div>
      </>
  )
}




export default App;
