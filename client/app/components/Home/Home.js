import React, { Component } from 'react';
import 'whatwg-fetch';
import { getFromStorage, setInStorage } from '../../utils/storage'
import SignInForm from './SignInForm'

class Home extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isLoading: true,
      token: '',
      signUpError: '',
      signInError: '',
      masterError: '',
      signUpFirstName: '',
      signUpLastName: '',
      signUpEmail: '',
      signUpPassword: ''
    }

    this.signOut = this.signOut.bind(this)
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


  signIn(email, password){
    this.setState({isLoading: true})

    fetch('/api/account/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email,
        password: password
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
          })
        }else{
          this.setState({
            signInError: json.message,
            isLoading: false
          })
        }
      })
  }
 
  signOut(){
    this.setState({isLoading: true})
    const storage = getFromStorage('the_main_app')
    if(storage && storage.token){
      const { token } = storage
      fetch('/api/account/signout?token=' + token)
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
          <SignInForm submit={this.signIn} error={signInError} />
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
        <button onClick={this.signOut}>Logout</button>
      </div>
    )
  }
}

export default Home;
