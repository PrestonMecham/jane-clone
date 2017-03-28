import React from 'react'
import { connect } from 'react-redux'

class NewAddress extends React.Component {
  constructor (props) {
    super(props)
    this.exitMenu = this.exitMenu.bind(this)
  }

  exitMenu () {
    this.props.exitMenu()
  }

  componentWillMount (){
    document.body.style.overflow = "hidden"
  }

  componentWillUnmount(){
    document.body.style.overflow = "scroll"
  }

  render () {
    return (
      <div className={'address-form ' + this.props.class}>
        <div
          onClick={this.exitMenu}
          className={'menu-background'} />
        <div className='address-details'>
          <div className='address-header'>
            <p>ADDRESS</p>
            <img
              onClick={this.exitMenu}
              src='../public/img/icons/close.svg'/>
          </div>
          <div className='address-input'>
            <h1>Recipient</h1>
            <input placeholder='First Name'/>
            <input placeholder='Last Name'/>
            <h1>Address</h1>
            <input placeholder='Address 1'/>
            <input placeholder='Address 2'/>
            <input placeholder='City'/>
            <input placeholder='State'/>
            <input placeholder='ZIP'/>
            <button>SAVE</button>
          </div>

        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    loggedIn: state.loggedIn,
    userName: state.userName
  }
}
export default connect(mapStateToProps)(NewAddress)
