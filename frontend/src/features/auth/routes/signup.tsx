import React, { useState, ReactNode } from 'react'
import Avatar from '@mui/material/Avatar'
import Badge from '@mui/material/Badge'
import DoctorRegister from './RequestDoctor' // Import your first component
import { Register } from './Register' // Import your second component
import CheckSharpIcon from '@mui/icons-material/CheckSharp'

const Signup: React.FC = () => {
  const [isBadgeVisible1, setIsBadgeVisible1] = useState(true) // Set initial state for Patient
  const [isBadgeVisible2, setIsBadgeVisible2] = useState(false)
  const [selectedComponent, setSelectedComponent] = useState<ReactNode | null>(
    <DoctorRegister />
  )
  const colorprimary = 'rgb(25,118,210)'
  const colorSecondry = 'rgb(160,160,160)'

  const handleAvatarClick1 = () => {
    if (isBadgeVisible1 == true) return
    setIsBadgeVisible1(true)
    setIsBadgeVisible2(false)
    setSelectedComponent(isBadgeVisible1 ? null : <DoctorRegister />)
  }

  const handleAvatarClick2 = () => {
    if (isBadgeVisible2 == true) return
    setIsBadgeVisible2(true)
    setIsBadgeVisible1(false)
    setSelectedComponent(isBadgeVisible2 ? null : <Register />)
  }

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <h2 style={{ textAlign: 'center', color: colorprimary }}>
        Choose Account Type
      </h2>
      <br />
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          marginBottom: '10px',
        }}
      >
        <div style={{ textAlign: 'center', marginRight: '20px' }}>
          <h4 style={{ color: colorprimary }}>Doctor</h4>
          <Badge
            overlap="circular"
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            badgeContent={
              <div
                style={{
                  backgroundColor: colorprimary,
                  color: 'white',
                  borderRadius: '50%',
                }}
              >
                <CheckSharpIcon />
              </div>
            }
            invisible={!isBadgeVisible1}
          >
            <Avatar
              onClick={handleAvatarClick1}
              style={{
                width: '140px',
                height: '140px',
                border: isBadgeVisible1
                  ? '2px solid ' + colorprimary
                  : '2px solid transparent',
              }}
            >
              <img
                src="../../../../public/Doctor.jpg"
                alt="yay"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </Avatar>
          </Badge>
        </div>

        <div style={{ textAlign: 'center', marginLeft: '20px' }}>
          <h4 style={{ color: colorprimary }}>Patient</h4>
          <Badge
            overlap="circular"
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            badgeContent={
              <div
                style={{
                  backgroundColor: colorprimary,
                  color: 'white',
                  borderRadius: '50%',
                }}
              >
                <CheckSharpIcon />
              </div>
            }
            invisible={!isBadgeVisible2}
          >
            <Avatar
              onClick={handleAvatarClick2}
              style={{
                width: '140px',
                height: '140px',
                border: isBadgeVisible2
                  ? '2px solid ' + colorprimary
                  : '2px solid transparent',
              }}
            >
              <img
                src="../../../../public/patient.jpg"
                alt="yay"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </Avatar>
          </Badge>
        </div>
      </div>
      {isBadgeVisible1 && (
        <div
          style={{
            textAlign: 'center',
            marginBottom: '20px',
            color: colorSecondry,
          }}
        >
          <p>
            Hi Doctor! <br />
            Fill out this form to apply to be part of our team.
          </p>
        </div>
      )}
      {!isBadgeVisible1 && (
        <div
          style={{
            textAlign: 'center',
            marginBottom: '20px',
            color: colorSecondry,
          }}
        >
          <p>
            Welcome to our healthcare platform!
            <br /> Register as a patient to access personalized services and
            medical information.
          </p>
        </div>
      )}
      <div
        style={{
          padding: '20px',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
          textAlign: 'center',
          borderRadius: '10px',
          width: '150%',
        }}
      >
        {selectedComponent}
      </div>
      <h6>Fields marked with * are required.</h6>
    </div>
  )
}

export default Signup
