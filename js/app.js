(function ($) {

    Backbone.emulateHTTP = true;
    Backbone.emulateJSON = true;

    var Product = Backbone.Model.extend( {
        defaults: {
            image: "100.jpg",
            name: "",
            itemTotal: 0,
            qty: 0
        },
        url: function() {
            return "/cart-ops.php?id=" + this.get('id');
        }
    });

    var Cart = Backbone.Collection.extend({ 
        model: Product 
    });

    var ProductView = Backbone.View.extend( {
        tagName: "li",
        className: "cart-item",
        template: $("#itemTemplate").html(),
        events: {
            "click .remove" : "removeItem",
            "click .decrease" : "decreaseQty",
            "click .increase" : "increaseQty"
        },
        render: function() {
            var tmpl = _.template( this.template );
            this.$el.html( tmpl(this.model.toJSON()) );
            return this;
        },
        removeItem: function( e ) {
            e.preventDefault();
            this.model.destroy();
            this.remove();
        },
        decreaseQty: function( e ) {
            e.preventDefault();
            var qty = this.model.get('qty') - 1;
            if ( qty === 0 ) {
                this.model.destroy();
                this.remove();
            } else {
                this.model.set( { 'qty' : qty } ).save();
                this.render();
            }
            shoppingCart.updateTotals();
        },
        increaseQty: function( e ) {
            e.preventDefault();
            var qty = this.model.get('qty') + 1;
            this.model.set( { 'qty' : qty } ).save();
            this.render();
            shoppingCart.updateTotals();
        }
    });

    var CartView = Backbone.View.extend( {
        el: $('#miniCart'),
        emptyCartTemplate: _.template($("#emptyCartTemplate").html()),
        initialize: function() {
            this.collection = new Cart(cartContents);
            this.render();
            this.updateTotals();

            this.collection.on( 'add' , this.updateTotals , this );
            this.collection.on( 'change' , this.updateTotals , this );
            this.collection.on( 'remove' , this.updateTotals , this );
        },
        render: function() {
            var that = this;
            this.$el.find(".miniCartItems li").remove();
            _.each( this.collection.models , function(item) {
                that.renderProduct(item);
            } , this );
        },
        renderProduct: function( item ) {
            var productView = new ProductView({ model: item });
            this.$el.find(".miniCartItems").append( productView.render().el );
        },
        updateTotals: function() {
            var totalItems = 0;
            var subTotal = 0;

            if ( this.collection.length === 0 ) {
                this.$el.find('.miniCartItems').html( this.emptyCartTemplate() );
            } else {
                _.each( this.collection.models , function(item) {
                    totalItems += item.get('qty');
                    subTotal += ( item.get('qty') * item.get('itemTotal') );
                } , this );
            }

            // Update Display
            this.$el.find(".itemsTotal span").html( totalItems );
            this.$el.find(".totalAmt span").html( roundPrice(subTotal) );

        },
        addProduct: function( item ) {

            var doAddProduct = true;

            // Check if product is already in the cart, if so update the quantity, otherwise add as a new item.
            if ( this.collection.length > 0 ) {

                _.each( this.collection.models , function( i ) {
                    if ( item.id == i.get('id') ) {
                        doAddProduct = false;
                        var qty = i.get('qty') + item.qty;
                        i.set( { 'qty' : qty } ).save();
                    }
                } , this );

            }

            if ( doAddProduct ) {
                cartContents.push( item );
                this.collection.create( item );
            }

            this.render();
        }
    });

    var AddToBasketView = Backbone.View.extend({
        el: $('#shoppingBaskets'),
        events: {
            "submit .basketItem" : "addToCart"
        },
        addToCart: function( e ) {
            e.preventDefault();

            var $elem = $(e.currentTarget);

            var newModel = {};
            newModel['id'] = $elem.find('input[name="product_id"]').val();
            newModel['image'] = $elem.find('img').attr('src');
            newModel['name'] = $elem.find('.productName').html();
            newModel['itemTotal'] = parseFloat( $elem.find('.productPrice span').html() );
            newModel['qty'] = parseInt( $elem.find('input[name="qty"]').val() , 10 );
            
            shoppingCart.addProduct( newModel );

        }
    });

    var shoppingCart = new CartView();
    var addToBasket = new AddToBasketView();

} (jQuery));

function roundPrice( original ) {
    return Math.round(original*100)/100;
}