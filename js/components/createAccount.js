/* eslint-disable no-useless-escape */
import React from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { login } from '../actions/actionCreators'
const { object, func } = React.PropTypes

class CreateAccount extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      name: '',
      email: '',
      password: '',
      verifyPassword: '',
      validator: {
        name: null,
        email: null,
        password: null,
        verifyPassword: null,
        login: null
      }
    }
    this.setValue = this.setValue.bind(this)
    this.submit = this.submit.bind(this)
    this.handleFieldChange = this.handleFieldChange.bind(this)
    this.isInvalid = this.isInvalid.bind(this)
    this.buttonSubmitOnly = this.buttonSubmitOnly.bind(this)
    this.fbSignup = this.fbSignup.bind(this)
  }

  handleFieldChange (e) {
    let obj = this.state

    if (e.target.name === 'name') {
      if (!e.target.value && this.state.validator.name) {
        obj.validator.name = false
        this.setState(obj)
      } else if (e.target.value && !this.state.validator.name) {
        obj.validator.name = true
        this.setState(obj)
      }
      // throw error if no name is entered (addclass to input box and display error message p tag)
    } else if (e.target.name === 'email') {
      // regex from http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
      const re = /^(([^<>()[\]\\.,:\s@\"]+(\.[^<>()[\]\\.,:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      if (!re.test(e.target.value) && e.target.value) {
        if (this.state.validator.email || this.state.validator.email === null) {
          obj.validator.email = false
          this.setState(obj)
        }
      } else if (!this.state.validator.email && e.target.value) {
        obj.validator.email = true
        this.setState(obj)
      }
    } else if (e.target.name === 'password') {
      // sets verifypassword to false if password field is changed
      if (e.target.value !== this.state.verifyPassword && this.state.validator.verifyPassword && this.state.validator.verifyPassword !== null) {
        obj.validator.verifyPassword = false
      }

      if (e.target.value && e.target.value.length < 8) {
        if (this.state.validator.password || this.state.validator.password === null) {
          obj.validator.password = false
          this.setState(obj)
        }
      } else if (e.target.value.length > 7 && !this.state.validator.password) {
        // automatically sets verify password to true if both fields match
        if (this.state.verifyPassword === e.target.value && !this.state.validator.verifyPassword) {
          obj.validator.verifyPassword = true
        }
        obj.validator.password = true
        this.setState(obj)
      } else {
        this.setState(obj)
      }
    } else if (e.target.name === 'verifyPassword') {
      if (e.target.value !== this.state.password) {
        if (this.state.validator.verifyPassword) {
          obj.validator.verifyPassword = false
          this.setState(obj)
        } else if (e.target.value && this.state.validator.verifyPassword === null) {
          obj.validator.verifyPassword = false
          this.setState(obj)
        }
      } else if (this.state.verifyPassword === this.state.password) {
        if (!this.state.validator.verifyPassword && this.state.validator.password) {
          obj.validator.verifyPassword = true
          this.setState(obj)
        } else if (e.target.value && this.state.validator.verifyPassword === null) {
          obj.validator.verifyPassword = false
          this.setState(obj)
        }
      }
    }
  }

  setValue (event) {
    let obj = {}
    obj[event.target.name] = event.target.value
    this.setState(obj)
  }

  buttonSubmitOnly (e) {
    if (e.charCode === 13) {
      e.preventDefault()
    }
  }

  submit (e) {
    e.preventDefault()

    let obj = this.state
    if (obj.validator.name && obj.validator.email &&
      obj.validator.password && obj.validator.verifyPassword) {
      axios.post('/signup', {
        data: {
          name: this.state.name,
          email: this.state.email,
          password: this.state.password
        }
      }
       ).then(res => {
         let user = res.data[0]
         if (user.email) {
           this.props.dispatch(login(true, user.fullname, user.id, +user.total))
           this.context.router.transitionTo('/')
         } else {
           obj.validator.login = true
           this.setState(obj)
         }
       })
    } else {
      for (let key in obj.validator) {
        if (!obj.validator[key]) {
          obj.validator[key] = false
        }
      }
      this.setState(obj)
    }
  }

  isInvalid (value) {
    return value === false ? 'invalid' : ''
  }

  fbSignup () {
      let that = this;
      FB.login(function(response) {
        const accessToken = response.authResponse.accessToken
        axios.get(`https://graph.facebook.com/v2.9/me?access_token=${accessToken}&fields=name,email`)
          .then(res => {
            axios.post('/signup', {
              data: {
                name: res.data.name,
                email: res.data.email,
                id: res.data.id
              }
            }).then(res => {
              let user = res.data[0]
              if (user.fullname) {
                that.props.dispatch(login(true, user.fullname, user.id, user.total))
                that.context.router.transitionTo('/')
              } else {
                obj.validator.login = true
                that.setState(obj)
              }
            })
          })
      },{scope: 'public_profile,email'})
  }

  componentDidMount() {
    window.fbAsyncInit = function() {
      FB.init({
        appId      : '432409103793644',
        cookie     : true,
        xfbml      : true,
        version    : 'v2.9'
      });
      FB.AppEvents.logPageView()
      FB.getLoginStatus(function(response) {
        // statusChangeCallback(response);

      });
    };

    (function(d, s, id){
       var js, fjs = d.getElementsByTagName(s)[0];
       if (d.getElementById(id)) {return;}
       js = d.createElement(s); js.id = id;
       js.src = "//connect.facebook.net/en_US/sdk.js";
       fjs.parentNode.insertBefore(js, fjs);
     }(document, 'script', 'facebook-jssdk'));
  }

  render () {
    return (
      <div>
        <div className='fb-wrapper'>
          <button onClick={this.fbSignup} className='fb-auth'>
            SIGN UP WITH FACEBOOK
          </button>
          <div>
            <p className='or'>or</p>
          </div>
        </div>
        <div>
          <form className='login-form' onSubmit={this.submit}>
            <p
              className={this.state.validator.login ? 'invalid-login' : 'hide'}
              >An Account with that email already exists.</p>
            <div className='input-wrapper sign-up'>
              <input
                className={this.isInvalid(this.state.validator.name)}
                onBlur={this.handleFieldChange}
                name='name'
                onChange={this.setValue}
                value={this.state.name}
                onKeyPress={this.buttonSubmitOnly}
                placeholder='Full Name' />
              <p
                className={this.state.validator.name === false ? 'error' : 'hide'}
                >Don't forget to enter your name.</p>
              <input
                className={this.isInvalid(this.state.validator.email)}
                onBlur={this.handleFieldChange}
                name='email'
                onChange={this.setValue}
                value={this.state.email}
                onKeyPress={this.buttonSubmitOnly}
                placeholder='Email Address' />
              <p
                className={this.state.validator.email === false ? 'error' : 'hide'}
                >Don't forget to enter your email.</p>
              <input
                type='password'
                className={this.isInvalid(this.state.validator.password)}
                onBlur={this.handleFieldChange}
                name='password'
                onChange={this.setValue}
                value={this.state.password}
                onKeyPress={this.buttonSubmitOnly}
                placeholder='Password' />
              <p
                className={this.state.validator.password === false ? 'error' : 'hide'}
                >Don't forget to come up with a great new password just for Jane! Make sure it's at least 8 characters.</p>
              <input
                type='password'
                className={this.isInvalid(this.state.validator.verifyPassword)}
                onBlur={this.handleFieldChange}
                name='verifyPassword'
                onChange={this.setValue}
                value={this.state.verifyPassword}
                onKeyPress={this.buttonSubmitOnly}
                placeholder='Confirm Password' />
              <p
                className={this.state.validator.verifyPassword === false ? 'error' : 'hide'}
                >Enter your password one more time to make sure we got it right.</p>
            </div>
            <button className='btn btn-sign-up'>SIGN ME UP!</button>
          </form>
        </div>
      </div>
    )
  }
}

CreateAccount.propTypes = {
  dispatch: func
}

CreateAccount.contextTypes = {
  router: object
}

const mapStateToProps = (state) => {
  return {
    loggedIn: state.loggedIn
  }
}

export default connect(mapStateToProps)(CreateAccount)
