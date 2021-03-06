/* eslint-disable no-useless-escape */
import React from 'react'
import axios from 'axios'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { login } from '../actions/actionCreators'

const { object, func, string } = React.PropTypes

class SignIn extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      validator: {
        email: null,
        login: null
      },
      cartLogin: false
    }

    this.login = this.login.bind(this)
    this.setValue = this.setValue.bind(this)
    this.submit = this.submit.bind(this)
    this.handleFieldChange = this.handleFieldChange.bind(this)
    this.isInvalid = this.isInvalid.bind(this)
    this.fbLogin = this.fbLogin.bind(this)
  }

  login () {
    this.props.login()
    if (!this.state.cartLogin) {
      this.setState({cartLogin: true})
    }
  }

  setValue (event) {
    let obj = {}
    obj[event.target.name] = event.target.value
    this.setState(obj)
  }

  submit (e) {
    e.preventDefault()
    let obj = this.state
    if (obj.validator.email && obj.password) {
      axios.get('/login/' + this.state.email + '/' + this.state.password
      ).then(res => {
        let user = res.data[0]
        if (user.fullname) {
          this.props.dispatch(login(true, user.fullname, user.id, user.total))
          this.context.router.transitionTo('/')
        } else {
          obj.validator.login = true
          this.setState(obj)
        }
      })
    }
  }

  handleFieldChange (e) {
    let obj = this.state

    // regex from http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
    const re = /^(([^<>()[\]\\.,:\s@\"]+(\.[^<>()[\]\\.,:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if (!re.test(e.target.value)) {
      if (this.state.validator.email !== false) {
        obj.validator.email = false
        this.setState(obj)
      }
    } else {
      if (this.state.validator.email !== true) {
        obj.validator.email = true
        this.setState(obj)
      }
    }
  }

  isInvalid (value) {
    return value === false ? 'invalid' : ''
  }

  fbLogin () {
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
        {this.props.pathname === '/logon'
        ? <div>
          <div className='fb-wrapper'>
            <button onClick={this.fbLogin} className='fb-auth'>
              LOG IN WITH FACEBOOK
            </button>
            <div>
              <p className='or'>or</p>
            </div>
          </div>
          <div>
            <form className='login-form' onSubmit={this.submit}>
              <p
                className={this.state.validator.login ? 'invalid-login' : 'hide'}
                >Invalid email address or password. Please try again.</p>
              <div className='input-wrapper login'>
                <input
                  className={this.isInvalid(this.state.validator.email)}
                  onBlur={this.handleFieldChange}
                  name='email'
                  onChange={this.setValue}
                  value={this.state.email}
                  placeholder='Email Address' />
                <p
                  className={this.state.validator.email === false ? 'error' : 'hide'}
                  >Please enter a valid email address.</p>
                <input
                  type='password'
                  name='password'
                  onChange={this.setValue}
                  value={this.state.password}
                  placeholder='Password' />
              </div>
              <button className='btn'>LOG IN</button>
              <p>Forgot your password?</p>
              <Link to='/signup'><p>New? Sign up.</p></Link>
            </form>
          </div>
        </div>
                : <div>
                  <div>
                    <form className='login-form' onSubmit={this.submit}>
                      {!this.state.cartLogin
                      ? ''
                      : <div>
                        <h2
                          className={this.state.validator.login ? 'invalid-login' : 'hide'}
                          >Invalid email address or password. Please try again.</h2>
                        <div className='input-wrapper login'>
                          <input
                            className={this.isInvalid(this.state.validator.email)}
                            onBlur={this.handleFieldChange}
                            name='email'
                            onChange={this.setValue}
                            value={this.state.email}
                            placeholder='Email Address' />
                          <p
                            className={this.state.validator.email === false ? 'error' : 'hide'}
                            >Please enter a valid email address.</p>
                          <input
                            type='password'
                            name='password'
                            onChange={this.setValue}
                            value={this.state.password}
                            placeholder='Password' />
                        </div>
                        <div className='line' />
                      </div>
                      }
                      <button className='btn' onClick={this.login}>LOG IN</button>
                    </form>
                  </div>

                  {!this.state.cartLogin
                ? ''
                : <div className='fb-wrapper'>
                  <div>
                    <p className='or'>or</p>
                  </div>
                  <button onClick={this.fbLogin} className='fb-auth'>
                    LOG IN WITH FACEBOOK
                  </button>
                </div>
                }
                </div>
            }
      </div>
    )
  }
}

SignIn.contextTypes = {
  router: object
}

SignIn.propTypes = {
  location: object,
  login: func,
  dispatch: func,
  pathname: string
}

const mapStateToProps = (state) => {
  return {
    loggedIn: state.loggedIn
  }
}

export default connect(mapStateToProps)(SignIn)
