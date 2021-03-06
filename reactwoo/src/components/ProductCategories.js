import React, { Component } from "react";
import { WooCommerce } from "../service/WoocommerceConnection.js";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import ReactPlaceholder from 'react-placeholder';
import "react-placeholder/lib/reactPlaceholder.css";
import Header from "./Header.js";
import Footer from "./Footer.js";
import { addToCart } from "../service/WoocommerceFunctions";

class ProductCategories extends Component {
  constructor({ match :{ params :{id} } }) {
    super();
    this.state = {
      error: null,
	  isLoaded: false,
	  category_id : id,
	  categories: [],
	  products: [],
	  totalCount: 0
    };
  }

  componentWillReceiveProps(newProps){
	var categoryId = newProps.match.params.id;
	this.setState({category_id:categoryId}, () => {
		this.getData();
	});
	
  }

  getData(page) {
	  console.log(page)
	if(page){
		var page = page;
	}
	else{
		var page = 1;
	}
	var category_id = this.state.category_id;
	const that = this;
    WooCommerce.getAsync('products/?page='+page+'&category='+category_id).then(function(result) {
	var totalCount = result.headers['x-wp-total'];
      that.setState({
        isLoaded: true,
		products: JSON.parse(result.toJSON().body),
		totalCount: totalCount
      });
    });
  }

  getProductCategories() {
    const that = this;
    WooCommerce.getAsync("products/categories").then(function(result) {
      that.setState({
        isLoaded: true,
        categories: JSON.parse(result.toJSON().body)
      });
    });
  }

  componentDidMount() {
	this.getData();
	this.getProductCategories();
  }

  render() {
	let table = []
	let numberOfPages = this.state.totalCount/10;
	for (let i = 0; i < numberOfPages; i++) {
		table.push(
				i
		)
	}
    return (
      <div>
		<Header />
        <section>
		<div className="container">
			<div className="row">
				<div className="col-sm-3">
					<div className="left-sidebar">
						<h2>Category</h2>
						<div className="panel-group category-products" id="accordian">
						{this.state.categories.map((val, index) => (
							<div className="panel panel-default">
								<div className="panel-heading">
									<h4 className="panel-title"><Link to={"/category/"+val.id}>{val.name}</Link></h4>
								</div>
							</div>
						))}
						</div>
					
						<div className="brands_products">
							<h2>Brands</h2>
							<div className="brands-name">
								<ul className="nav nav-pills nav-stacked">
									<li><a href=""> <span className="pull-right">(50)</span>Acne</a></li>
									<li><a href=""> <span className="pull-right">(56)</span>Grüne Erde</a></li>
									<li><a href=""> <span className="pull-right">(27)</span>Albiro</a></li>
									<li><a href=""> <span className="pull-right">(32)</span>Ronhill</a></li>
									<li><a href=""> <span className="pull-right">(5)</span>Oddmolly</a></li>
									<li><a href=""> <span className="pull-right">(9)</span>Boudestijn</a></li>
									<li><a href=""> <span className="pull-right">(4)</span>Rösch creative culture</a></li>
								</ul>
							</div>
						</div>
						
						<div className="price-range">
							<h2>Price Range</h2>
							<div className="well">
								 <input type="text" className="span2" value="" data-slider-min="0" data-slider-max="600" data-slider-step="5" data-slider-value="[250,450]" id="sl2" /><br />
								 <b>$ 0</b> <b className="pull-right">$ 600</b>
							</div>
						</div>
						
						<div className="shipping text-center">
							<img src="images/home/shipping.jpg" alt="" />
						</div>
						
					</div>
				</div>
				
				<div className="col-sm-9 padding-right">
					<div className="features_items">
						<h2 className="title text-center">Features Items</h2>
						{this.state.products.map((val, index) => (
						<div className="col-sm-4">
							<div className="product-image-wrapper">
								<div className="single-products">
									<div className="productinfo text-center">
									    <Link to={`/product/${val.id}`}>
										<img src={val.images[0].src} alt="" />
										<h2>${val.price}</h2>
										<p>{val.name}</p>
										</Link>
										<a href="#" className="btn btn-default add-to-cart" onClick={() => addToCart(val.id)}><i className="fa fa-shopping-cart"></i>Add to cart</a>
									</div>
								</div>
								<div className="choose">
									<ul className="nav nav-pills nav-justified">
										<li><a href=""><i className="fa fa-plus-square"></i>Add to wishlist</a></li>
										<li><a href=""><i className="fa fa-plus-square"></i>Add to compare</a></li>
									</ul>
								</div>
							</div>
						</div>
						))}
                        <ul class="pagination">
						{table.map((val, index) => (
								<li class="active"><a href="javascript:void(0);" onClick={() => {
										return this.getData(index+1);
									}}>{index+1}</a></li>
							))}
						</ul>
					</div>
				</div>
			</div>
		</div>
	</section>
		<Footer />

      </div>
    );
  }
}
export default ProductCategories;