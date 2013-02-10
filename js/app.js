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

        }
    });

    var shoppingCart = new CartView();

} (jQuery));

function roundPrice( original ) {
    return Math.round(original*100)/100;
}
