import React from 'react'
import { Link } from 'react-router'

class LargeProduct extends React.Component {
  // constructor(props){
  //   super (props)
  // }
  render () {
    console.log(this.props.burl)
    return (
      <div className='large-product-container'>
        <Link to={`/productpage/${this.props.id}`}><img src={this.props.burl} /></Link>
        <div className='product-summary'>
          <div className='product-sum-left'>
            <Link to='/productpage'><div className='product-name'>{this.props.name}</div></Link>
            <span className='sale-price'>{this.props.sale} </span>
            <span className='retail-price'>{this.props.price}</span>
          </div>
          <div className='product-sum-right'>
            <button className='like'>
              <img src='../public/img/icons/heart.svg' />
              <span>{this.props.favorites}</span>
            </button>
          </div>
        </div>
      </div>
    )
  }
}

export default LargeProduct