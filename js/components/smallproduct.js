import React from 'react'
import { Link } from 'react-router'

const { number, string } = React.PropTypes

class SmallProduct extends React.Component {
  render () {
    return (
      <div className='small-product-container'>
        <Link to={`/productpage/${this.props.id}`}><img className='product-img' src={`.${this.props.burl}`} /></Link>
        <div className='product-summary'>
          <div className='product-sum-left'>
            <Link to={`/productpage/${this.props.id}`}><div className='product-name small'>{this.props.name}</div></Link>
            <span className='sale-price'>${this.props.sale} </span>
            <span className='retail-price'>${this.props.price}</span>
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

SmallProduct.propTypes = {
  id: number,
  burl: string,
  name: string,
  sale: string,
  price: string,
  favorites: number
}

export default SmallProduct
