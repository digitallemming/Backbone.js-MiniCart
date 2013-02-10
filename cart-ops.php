<?php

	/**
	 * Clearly this would need sanitizing and error checking before going anywhere near a production database
	 */

	error_reporting(0);

    $LinkId = mysql_connect( 'localhost' , '' , '' );
    mysql_select_db( 'backbone' , $LinkId); 

    /**
     *	Delete an element from cart
     */
	if ( $_POST['_method'] == 'DELETE' ) {
		mysql_query( "DELETE FROM `cart` WHERE `id` = '".$_GET['id']."'" );

    /**
     *	Update an item in the cart - typically quantity
     */
	} else if ( $_POST['_method'] == 'PUT' ) {
		
		$model = json_decode( stripslashes($_POST['model']) );

		mysql_query( "UPDATE `cart` SET 
			`name` = '".$model->name."',
			`image` = '".$model->image."',
			`itemTotal` = '".$model->itemTotal."',
			`qty` = '".$model->qty."'
		WHERE `id` = '".$model->id."'" ) or die( mysql_error() );

    /**
     *	Add a item to the cart, maybe some sort of quick add
     */
	} else {

		$model = json_decode( stripslashes($_POST['model']) );

		mysql_query( "
			INSERT INTO `cart` VALUES (
			NULL,
			'".$model->name."',
			'".$model->image."',
			'".$model->itemTotal."',
			'".$model->qty."'
			);
		" );

		$model->id = mysql_insert_id();
		echo json_encode( $model );

	}

?>