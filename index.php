<!DOCTYPE html>
<html>
	<head>
		<title>Shopping Cart with Backbone</title>
		<link rel="stylesheet" type="text/css" href="css/style.css">
	</head>
	<body>

		<div id="miniCart" class="miniCart">
			<h1 class="cartTitle">Items in Cart</h1>
			<ul class="miniCartItems">
				<li class="cartEmpty">Cart Empty</li>
			</ul>
			<div class="miniCartTotal">
				<h3>Subtotal</h3>
				<h3 class="totalAmt">&pound;<span>0</span></h3>
			</div>
			<div class="miniCartSummary">
				<h4 class="itemsTotal"><span>0</span> Items</h4>
				<a href="#">Proceed to Checkout</a>
			</div>
		</div>

		<div id="shoppingBaskets" class="shoppingBaskets">

			<form method="post" action="/" class="basketItem">
				<img src="/img/100.jpg" alt="Product Title" />
				<h2 class="productName">Product Title</h2>
				<h2 class="productPrice">&pound;<span>24.95</span></h2>
				<input type="hidden" name="product_id" value="243" />
				<input type="text" name="qty" value="1" />
				<input type="submit" name="addToBasket" value="Add to Cart" />
			</form>

			<form method="post" action="/" class="basketItem">
				<img src="/img/100.jpg" alt="Product Title 2" />
				<h2 class="productName">Product Title 2</h2>
				<h2 class="productPrice">&pound;<span>99.95</span></h2>
				<input type="hidden" name="product_id" value="3456" />
				<input type="text" name="qty" value="1" />
				<input type="submit" name="addToBasket" value="Add to Cart" />
			</form>

			<form method="post" action="/" class="basketItem">
				<img src="/img/100.jpg" alt="Product Title 3" />
				<h2 class="productName">Product Title 3</h2>
				<h2 class="productPrice">&pound;<span>6.95</span></h2>
				<input type="hidden" name="product_id" value="465" />
				<input type="text" name="qty" value="1" />
				<input type="submit" name="addToBasket" value="Add to Cart" />
			</form>

			<form method="post" action="/" class="basketItem">
				<img src="/img/100.jpg" alt="Product Title 4" />
				<h2 class="productName">Product Title 4</h2>
				<h2 class="productPrice">&pound;<span>49.95</span></h2>
				<input type="hidden" name="product_id" value="132" />
				<input type="text" name="qty" value="1" />
				<input type="submit" name="addToBasket" value="Add to Cart" />
			</form>

		</div>



		<script id="itemTemplate" type="text/template">
			<img src="<%= image %>" alt="<%= name %>" title="<%= name %>" />
			<div class="itemOverview">
				<h2><%= name %></h2>
				<h5 class="itemTotal">&pound;<%= roundPrice( itemTotal * qty ) %></h5>
			</div>
			<div class="itemOps">
				<p>
					Quantity: <span><%= qty %></span>
					<a href="#" class="qty decrease">-</a>
					<a href="#" class="qty increase">+</a>
				</p>
				<p class="removeItem">
					<a href="#" class="remove">remove</a>
				</p>
			</div>
		</script>
		<script id="emptyCartTemplate" type="text/template">
			<li class="cartEmpty">Cart Empty</li>
		</script>

		<script src="js/jquery-1.8.3.min.js"></script>
		<script src="js/underscore-min.js"></script>
		<script src="js/backbone-min.js"></script>

		<script>
		<?php
            $LinkId = mysql_connect( 'localhost' , '' , '' );
            mysql_select_db( 'backbone' , $LinkId); 

            // Load the cart contents from the database
            $items = mysql_query( "SELECT * FROM cart ORDER BY id ASC" );
        ?>
			var cartContents = [
				<?php while( $row = mysql_fetch_object($items) ) { ?>
				{
					id: <?= $row->id ?>,
					image: '<?= $row->image ?>',
					name: '<?= $row->name ?>',
					itemTotal: <?= $row->itemTotal ?>,
					qty: <?= $row->qty ?>
				},
				<?php } ?>
			];
		</script>

		<script src="js/app.js"></script>

	</body>
</html>