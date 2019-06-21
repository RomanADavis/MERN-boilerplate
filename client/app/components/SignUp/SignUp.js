import React, { Component } from 'react'
import Form, { Group, Label, Control } from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
// TODO: Add more comprehensive validation and / or better feedback for validation on the front end.
// TODO: Send an email to validate them (?)

export default class SignUpPage extends Component {
  constructor (props) {
    super(props)
    this.state = { email: '', firstName: '', lastName: '', password: '' }
    
    this.emailChange = this.emailChange.bind(this)
    this.firstNameChange = this.firstNameChange.bind(this)
    this.lastNameChange = this.lastNameChange.bind(this)
    this.passwordChange = this.passwordChange.bind(this)
    this.signUp = this.signUp.bind(this)
  }

  emailChange(event){
    this.setState({ email: event.target.value })
  }

  firstNameChange(event){
    this.setState({ firstName: event.target.value })
  }

  lastNameChange(event){
    this.setState({ lastName: event.target.value })
  }

  passwordChange(event){
    this.setState({ password: event.target.value })
  }

  signUp(event){
    const {
      firstName,
      lastName,
      email,
      password
    } = this.state

    this.setState({ isLoading: true })

    fetch('api/account/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password
      })
    })
      .then(result => result.json())
      .then(json => {
        if(json.success){
          this.setState({
            Error: json.message,
            isLoading: false,
            firstName: '',
            lastName: '',
            email: '',
            password: ''
          })
        }else{
          this.setState({
            error: json.message,
            isLoading: false
          })
        }
      })
  }

  submit(event){
    const { email, firstName, lastName, password } = this.state
    this.props.submit(email, firstName, lastName, password)
  }

  render () {
    const { 
      email, 
      firstName, 
      lastName, 
      password, 
      error 
    } = this.state

    return (
      <div>
        { (error) ? <p>{error}</p> : '' }
        <h2>Sign Up</h2>
         <Form>
          <Group>
            <Label>Email</Label>
            <Control
              type='email'
              placeholder='name@example.com'
              onChange={this.emailChange}
              id='emailForm'
              value={email}
              required
            />
          </Group>

          <Group>
            <Label column sm='2'>First Name</Label>
            <Control
              type='text'
              placeholder='John'
              onChange={this.firstNameChange}
              id='firstNameForm'
              value={firstName}
              required
            />
          </Group>

          <Group>
            <Label column sm='2'>Last Name</Label>
            <Control
              type='text'
              placeholder='Smith'
              onChange={this.lastNameChange}
              id='lastNameForm'
              value={lastName}
              required
            />
          </Group>

          <Group>
            <Label>Password</Label>
            <Form.Control
              type='password'
              placeholder='Password'
              onChange={this.passwordChange}
              value={password}
              required
            />
          </Group>

          <Button variant='primary' type='submit' onClick={this.signUp}>
            Submit
          </Button>
        </Form>
      </div>
    )
  }
}
