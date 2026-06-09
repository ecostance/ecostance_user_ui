import React, { useState, useEffect } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
// import { callRegistrationApi, callOrgListApi } from "../../Action/AuthAction";
// import { bindActionCreators } from "redux";
import { connect } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import IndividualRegistration from '../other/individualRegistration'
// import BusinessRegistration from '../other/businessRegistration'

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: '100%',
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}))
const Registration = (props) => {
  const classes = useStyles()
  const [regType, setRegType] = useState('individual')

  const handleRegType = (e) => {
    setRegType(e.target.value)
  }

  return (
    <div className="lezada-form login-form--register">
      <form>
        <Row className="registration-custom-form">
          <Col lg={12}>
            <div className="section-title--login text-center space-mb--50">
              <h2 className="space-mb--20">Register</h2>
              <p>If you don’t have an account, register now!</p>
            </div>
          </Col>
          <Col
            lg={12}
            className="space-mb--0 registration-custom-form d-flex justify-content-between"
          >
            {/* <div>
                            <label htmlFor="regEmail" style={{ textTransform: "capitalize" }}>
                                User Type <span className="required"></span>
                            </label>
                        </div> */}
            {/* <div className="radio-custom d-flex">
                            <label className="container">Individual
                                <input type="radio" name="individual"
                                    className="userType"
                                    value="individual"
                                    checked={regType === "individual"}
                                    onChange={(e) => handleRegType(e)} />
                                <span className="checkmark"></span>
                            </label>
                            <label className="container">Business
                                <input type="radio" name="business"
                                    value="business"
                                    checked={regType === "business"}
                                    className="userType"
                                    onChange={(e) => handleRegType(e)} />
                                <span className="checkmark"></span>
                            </label>
                            <input type="radio" name="individual"
                                    className="userType"
                                    value="individual"
                                    checked={regType === "individual"}
                                    onChange={(e) => handleRegType(e)} />Individual
                            <input type="radio" name="business"
                                    value="business"
                                    checked={regType === "business"}
                                    className="userType"
                                    onChange={(e) => handleRegType(e)} />Business
                        </div> */}
          </Col>
          {regType === 'individual' ? (
            <IndividualRegistration
              isModal={props.isModal}
              showSuccessModel={props.showSuccessModel}
              registrationContainerRef={props.registrationContainerRef}
            />
          ) : null}
          {/* {regType === "business" ?
                        <BusinessRegistration />
                        : null} */}
        </Row>
      </form>
    </div>
  )
}

export default Registration
