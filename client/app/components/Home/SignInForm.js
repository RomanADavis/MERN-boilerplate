import React from 'react'
import Form, { Group, Label, Text, Control } from 'react-bootstrap/Form'
import { Link } from 'react-router-dom'
import Button from 'react-bootstrap/Button'

export default class SignInForm extends React.Component {
  constructor (props) {
    super()
    const { error } = props
    this.state = { email: '', password: '', error: error }
    this.emailChange = this.emailChange.bind(this)
    this.passwordChange = this.passwordChange.bind(this)
    this.submit = this.submit.bind(this)
  }

  emailChange(event){
    this.setState({ email: event.target.value })
  }

  passwordChange(event){
    this.setState({ password: event.target.value })
  }

  submit(){
    const { email, password } = this.state
    this.props.submit(email, password)
    this.setState({
      email: '',
      password: ''
    })
  }

  render(){
    const { email, password, error } = this.state

    return (
      <div>
        {
          (error) ? (<p>{error}</p>) : ''
        }
        <h2>Login</h2>
        Don't have an account? <Link to='/signUp'>Sign up!</Link>
        <Form>
          <Group controlId='loginEmail'>
            <Label>Email</Label>
            <Control type='email' placeholder='Enter email' onChange={this.emailChange} value={email} />
            <Text className='text-muted'>We'll never share your email with anyone else.</Text>
          </Group>

          <Group controlId='loginPassword'>
            <Label>Password</Label>
            <Control type='password' placeholder='Password' onChange={this.passwordChange} value={password} />
          </Group>
          <Button variant='primary' type='submit' onClick={this.submit}>Submit</Button>
        </Form>
      </div>
    )
  }
}
