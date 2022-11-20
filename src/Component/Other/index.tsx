import React from 'react'
import { Route, useRoutes } from 'react-router-dom'
import SecOther from './SecOther'


const OtherRouter = () => { 
  return useRoutes([
    {
          path: "second",
          element: <SecOther />,
    }
    ]);
}

export default function Other() {
  
  return (
    <div>
      {OtherRouter()}
      <div>Other</div>
    </div>
    
  )
}
