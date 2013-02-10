CREATE TABLE `cart` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `image` varchar(100) NOT NULL,
  `name` varchar(100) NOT NULL,
  `itemTotal` decimal(20,2) NOT NULL,
  `qty` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=3 ;

INSERT INTO `cart` VALUES(1, 'img/100.jpg', 'Product 1', 12.99, 1);
INSERT INTO `cart` VALUES(2, 'img/100.jpg', 'Product 2', 14.99, 5);