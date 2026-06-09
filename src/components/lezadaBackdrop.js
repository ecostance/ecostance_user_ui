import React from 'react'

const LezadaBackdrop = ({ children, bgType }) => {
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: `${
          bgType === 'light' ? 'rgba(11, 11, 11, 0.5)' : 'rgba(11, 11, 11, 0.7)'
        }`,
        position: 'fixed',
        zIndex: '9999',
      }}
    >
      {children}
    </div>
  )
}

export default LezadaBackdrop
