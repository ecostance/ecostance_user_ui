import { useState } from 'react';
import Link from 'next/link';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import { LayoutTwo } from '../../components/Layout';
import { BreadcrumbOne } from '../../components/Breadcrumb';
import { useToasts } from 'react-toast-notifications';
import { sendResetPasswordLink } from 'src/apiClient/auth';

const forgotPassword = (props) => {
	const { addToast } = useToasts();
	const [initialValues, setInitialValues] = useState({
		email: '',
	});
	const [isError, setIsError] = useState({});
	const [isFocus, setIsFocus] = useState({});
	const [isForgot, setIsForgot] = useState(false);
	const [isEmailLoading, setIsEmailLoading] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();

		const validation = validate(initialValues);

		setIsError(validation);
		setIsFocus(validation);

		if (Object.keys(validation).length) {
			return null;
		}
		setIsEmailLoading(true);
		await sendResetPasswordLink(initialValues)
			.then((response) => {
				addToast(response.data?.message, {
					appearance: response.status == 200 ? 'success' : 'error',
					autoDismiss: true,
				});
			})
			.catch((error) => {
				addToast('Failed to Send Email, Please Try Again!', {
					appearance: 'error',
					autoDismiss: true,
				});
			})
			.finally(() => setIsEmailLoading(false));
	};

	const handleChangeValue = (e) => {
		setInitialValues({
			...initialValues,
			[e.target.name]: e.target.value.trim(),
		});
		setIsError({ ...isError, [e.target.name]: '' });
	};

	const validate = (values) => {
		const emailRegex =
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		let errors = {};
		if (!values.email) {
			errors.email = 'Please enter email';
		}
		if (values.email && !values.email.match(emailRegex)) {
			errors.email = 'Please enter a valid Email';
		}
		return errors;
	};

	const handleFocus = (e) => {
		const validation = validate(initialValues);
		setIsError(validation);
		setIsFocus({ ...isFocus, [e.target.name]: true });
	};

	const handleOk = () => {
		setIsForgot(false);
	};
	return (
		<LayoutTwo>
			{/* breadcrumb */}
			<BreadcrumbOne
				pageTitle='Forgot password'
				backgroundImage='/assets/images/backgrounds/breadcrumb-bg-1.png'>
				<ul className='breadcrumb__list'>
					<li>
						<Link href='/' as={process.env.PUBLIC_URL + '/'}>
							<a>Home</a>
						</Link>
					</li>

					<li>Forgot password</li>
				</ul>
			</BreadcrumbOne>
			{/* about content */}
			<div className='login-area space-mt--r130 space-mb--r130'>
				<Container>
					{isForgot ? (
						<Row>
							<Col lg={6} className='space-mb-mobile-only--50'>
								<div className='lezada-form login-form'>
									<form>
										<Row>
											<Col lg={12}>
												<div className='section-title--login text-center space-mb--50'>
													<h2 className='space-mb--20'>Check Your Mail</h2>
													<p>We have sent a password recovery instruction to your email</p>
												</div>
											</Col>
											<Col lg={12} className='space-mb--30 text-center'>
												<button className='lezada-button lezada-button--medium' onClick={handleOk}>
													OK
												</button>
											</Col>
										</Row>
									</form>
								</div>
							</Col>
						</Row>
					) : (
						<Row>
							<Col lg={6} className='space-mb-mobile-only--50'>
								<div className='lezada-form login-form'>
									<form>
										<Row>
											<Col lg={12}>
												<div className='section-title--login text-center space-mb--50'>
													<h2 className='space-mb--20'>Forgot pasword</h2>
													<p>
														Enter your register email below to receive password reset instruction
													</p>
												</div>
											</Col>
											<Col lg={12} className='space-mb--60'>
												<input
													type='text'
													name='email'
													placeholder='Email address *'
													value={initialValues.email}
													onBlur={handleFocus}
													autoCompleteType='off'
													onChange={(e) => handleChangeValue(e)}
													// error
													// helperText={isError.email}
													required
												/>
												{isFocus.email && isError.email ? (
													<p className='error-msg'>{isError.email}</p>
												) : (
													''
												)}
											</Col>
											<Col lg={12} className='space-mb--30 text-center'>
												<button
													className='lezada-button lezada-button--medium'
													onClick={handleSubmit}>
													SEND {isEmailLoading && <Spinner size='sm' animation='border' />}
												</button>
											</Col>
										</Row>
									</form>
								</div>
							</Col>
						</Row>
					)}
				</Container>
			</div>
		</LayoutTwo>
	);
};

export default forgotPassword;
