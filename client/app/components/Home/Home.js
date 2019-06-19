import React, { Component } from 'react';
import 'whatwg-fetch';
import { getFromStorage, setInStorage } from '../../utils/storage'

class Home extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isLoading: true,
      token: '',
      signUpError: '',
      signInError: '',
      masterError: '',
      signInEmail: '',
      signInPassword: '',
      signUpFirstName: '',
      signUpLastName: '',
      signUpEmail: '',
      signUpPassword: ''
    }

    this.signInEmailChange = this.signInEmailChange.bind(this)
    this.signInPasswordChange = this.signInPasswordChange.bind(this)
    this.signUpFirstNameChange = this.signUpFirstNameChange.bind(this)
    this.signUpLastNameChange = this.signUpLastNameChange.bind(this)
    this.signUpEmailChange = this.signUpEmailChange.bind(this)
    this.signUpPasswordChange = this.signUpPasswordChange.bind(this)
    this.signUp = this.signUp.bind(this)
    this.signIn = this.signIn.bind(this)
    this.logout = this.logout.bind(this)
  }

  componentDidMount(){
    // fetch token
    const storage = getFromStorage('the_main_app')

    if(storage && storage.token){
      const { token } = storage

      fetch('/api/account/verify?token=' + token)
        .then(result => result.json())
          .then(json => {
            if(json.success){
              this.setState({ token: token })
            }
          })
    }

    this.setState({isLoading: false})
  }

  signInEmailChange(event){
    this.setState({signInEmail: event.target.value})
  }

  signInPasswordChange(event){
    this.setState({signInPassword: event.target.value})
  }

  signUpFirstNameChange(event){
    this.setState({signUpFirstName: event.target.value})
  }

  signUpLastNameChange(event){
    this.setState({signUpLastName: event.target.value})
  }

  signUpEmailChange(event){
    this.setState({signUpEmail: event.target.value})
  }

  signUpPasswordChange(event){
    this.setState({signUpPassword: event.target.value})
  }

  signIn(event){
    const { signInEmail, signInPassword } = this.state
    
    this.setState({isLoading: true})

    fetch('/api/account/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: signInEmail,
        password: signInPassword
      })
    })
      .then(result => result.json())  
      .then(json => {
        if(json.success){
          setInStorage('the_main_app', { token: json.token })
          this.setState({
            token: json.token,
            signInError: json.message,
            isLoading: false,
            signInEmail: '',
            signInPassword: '',
            email: '',
            password: ''
          })
        }else{
          this.setState({
            signInError: json.message,
            isLoading: false
          })
        }
      })
  }

  signUp(event){
    const {
      signUpFirstName,
      signUpLastName,
      signUpEmail,
      signUpPassword
    } = this.state

    this.setState({ isLoading: true })

    fetch('api/account/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: signUpFirstName,
        lastName: signUpLastName,
        email: signUpEmail,
        password: signUpPassword
      })
    })
      .then(result => result.json())
      .then(json => {
        if(json.success){
          this.setState({
            signUpError: json.message,
            isLoading: false,
            signUpFirstName: '',
            signUpLastName: '',
            email: '',
            password: ''
          })
        }else{
          this.setState({
            signUpError: json.message,
            isLoading: false
          })
        }
      })
  }

  logout(){
    this.setState({isLoading: true})
    const storage = getFromStorage('the_main_app')
    if(storage && storage.token){
      const { token } = storage
      fetch('/api/account/logout?token=' + token)
        .then(result => result.json())
        .then(json => {
          if(json.success){
            this.setState({
              token: '',
              isLoading: false
            })
          }else{
            isLoading: false
          }
        })
    }else{
      this.setState({isLoading: false})
    }
  }

  render() {
    const { 
      isLoading, 
      token,
      signInError,
      signUpError,
      signInEmail,
      signInPassword, 
      signUpFirstName,
      signUpLastName,
      signUpEmail,
      signUpPassword
    } = this.state

    if(isLoading){
      return (
        <div>
          <p>Loading...</p>
        </div>
      )
    }

    if(!token){
      return(
        <div>
          <div>
          {
            (signInError) ? (<p>{signInError}</p>) : ''
          }
            <p>Sign In</p>
            <input 
              type='email' 
              placeholder='Email'
              value={signInEmail}
              onChange={this.signInEmailChange}
            />
            <br />
            <input 
              type='password' 
              placeholder='Password'
              value={signInPassword}
              onChange={this.signInPasswordChange} 
            />
            <br />
            <button onClick={this.signIn}>Sign In</button>
          </div>
          <br />
          <br />
          <div>
            {
              (signUpError) ? <p>{signUpError}</p> : ''
            }
            <p>Sign Up</p>
            <input 
              type='text' 
              placeholder='First Name' 
              value={signUpFirstName}
              onChange={this.signUpFirstNameChange} 
            /> 
            <br />
            <input 
              type='text' 
              placeholder='Last Name' 
              value={signUpLastName} 
              onChange={this.signUpLastNameChange}
            /> 
            <br />
            <input 
              type='email' 
              placeholder='a@b.com' 
              value={signUpEmail}
              onChange={this.signUpEmailChange} 
            /> 
            <br />
            <input 
              type='password' 
              placeholder='Password' 
              value={signUpPassword}
              onChange={this.signUpPasswordChange}
            /> 
            <br />
            <button onClick={this.signUp}>Sign Up</button>
          </div>
        </div>
      )
    }
    return (
      <div>
        <p>Account</p>
        <button onClick={this.logout}>Logout</button>
      </div>
    )
  }
}

export default Home;
