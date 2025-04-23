describe('Login Functionality', () => {
  beforeEach(() => {
    cy.visit('https://www.saucedemo.com');
  });

  it('should login successfully with valid credentials', () => {
    cy.get('#user-name').type('standard_user');
    cy.get('#password').type('secret_sauce');
    cy.get('#login-button').click();
    
    // Assertions
    cy.url().should('include', 'inventory.html');
    cy.get('.title').should('have.text', 'Products');
    cy.get('.shopping_cart_link').should('be.visible');
  });

  it('should show error for locked out user', () => {
    cy.get('#user-name').type('locked_out_user');
    cy.get('#password').type('secret_sauce');
    cy.get('#login-button').click();
    
    // Assertions
    cy.get('[data-test="error"]').should('be.visible');
    cy.get('[data-test="error"]').should('contain.text', 'Sorry, this user has been locked out');
  });

  it('should show error for empty username', () => {
    cy.get('#password').type('secret_sauce');
    cy.get('#login-button').click();
    
    // Assertions
    cy.get('[data-test="error"]').should('be.visible');
    cy.get('[data-test="error"]').should('contain.text', 'Username is required');
  });

  it('should show error for empty password', () => {
    cy.get('#user-name').type('standard_user');
    cy.get('#login-button').click();
    
    // Assertions
    cy.get('[data-test="error"]').should('be.visible');
    cy.get('[data-test="error"]').should('contain.text', 'Password is required');
  });
});

describe('Product Inventory', () => {
  beforeEach(() => {
    cy.visit('https://www.saucedemo.com');
    cy.get('#user-name').type('standard_user');
    cy.get('#password').type('secret_sauce');
    cy.get('#login-button').click();
  });

  it('should display the correct number of products', () => {
    cy.get('.inventory_item').should('have.length', 6);
  });

  it('should sort products by price low to high', () => {
    cy.get('.product_sort_container').select('lohi');
    
    cy.get('.inventory_item_price').then($prices => {
      const prices = $prices.map((i, el) => 
        parseFloat(el.innerText.replace('$', ''))
      ).get();
      
      // Assert prices are in ascending order
      const sortedPrices = [...prices].sort((a, b) => a - b);
      expect(prices).to.deep.equal(sortedPrices);
    });
  });

  it('should sort products by price high to low', () => {
    cy.get('.product_sort_container').select('hilo');
    
    cy.get('.inventory_item_price').then($prices => {
      const prices = $prices.map((i, el) => 
        parseFloat(el.innerText.replace('$', ''))
      ).get();
      
      // Assert prices are in descending order
      const sortedPrices = [...prices].sort((a, b) => b - a);
      expect(prices).to.deep.equal(sortedPrices);
    });
  });

  it('should sort products alphabetically A-Z', () => {
    cy.get('.product_sort_container').select('az');
    
    cy.get('.inventory_item_name').then($names => {
      const names = $names.map((i, el) => el.innerText).get();
      
      // Assert names are in alphabetical order
      const sortedNames = [...names].sort();
      expect(names).to.deep.equal(sortedNames);
    });
  });
});

describe('Product Details', () => {
  beforeEach(() => {
    cy.visit('https://www.saucedemo.com');
    cy.get('#user-name').type('standard_user');
    cy.get('#password').type('secret_sauce');
    cy.get('#login-button').click();
  });

  it('should navigate to product details page', () => {
    cy.get('.inventory_item_name').first().click();
    
    // Assertions
    cy.url().should('include', 'inventory-item.html');
    cy.get('.inventory_details_name').should('be.visible');
    cy.get('.inventory_details_desc').should('be.visible');
    cy.get('.inventory_details_price').should('be.visible');
  });

  it('should add product to cart from details page', () => {
    cy.get('.inventory_item_name').first().click();
    cy.get('button.btn_primary.btn_inventory').click();
    
    // Assertions
    cy.get('.shopping_cart_badge').should('have.text', '1');
    cy.get('button').contains('Remove').should('be.visible');
  });

  it('should remove product from cart on details page', () => {
    cy.get('.inventory_item_name').first().click();
    cy.get('button.btn_primary.btn_inventory').click();
    cy.get('button').contains('Remove').click();
    
    // Assertions
    cy.get('.shopping_cart_badge').should('not.exist');
    cy.get('button.btn_primary.btn_inventory').should('be.visible');
  });
});

describe('Shopping Cart', () => {
  beforeEach(() => {
    cy.visit('https://www.saucedemo.com');
    cy.get('#user-name').type('standard_user');
    cy.get('#password').type('secret_sauce');
    cy.get('#login-button').click();
  });

  it('should add item to cart from inventory page', () => {
    cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    
    // Assertions
    cy.get('.shopping_cart_badge').should('have.text', '1');
    cy.get('[data-test="remove-sauce-labs-backpack"]').should('be.visible');
  });

  it('should add multiple items to cart', () => {
    cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    cy.get('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    
    // Assertions
    cy.get('.shopping_cart_badge').should('have.text', '2');
  });

  it('should view cart contents', () => {
    cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    cy.get('.shopping_cart_link').click();
    
    // Assertions
    cy.url().should('include', 'cart.html');
    cy.get('.cart_item').should('have.length', 1);
    cy.get('.inventory_item_name').should('contain', 'Sauce Labs Backpack');
  });

  it('should remove item from cart page', () => {
    cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    cy.get('.shopping_cart_link').click();
    cy.get('[data-test="remove-sauce-labs-backpack"]').click();
    
    // Assertions
    cy.get('.cart_item').should('not.exist');
    cy.get('.shopping_cart_badge').should('not.exist');
  });
});

describe('Checkout Process', () => {
  beforeEach(() => {
    cy.visit('https://www.saucedemo.com');
    cy.get('#user-name').type('standard_user');
    cy.get('#password').type('secret_sauce');
    cy.get('#login-button').click();
    cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    cy.get('.shopping_cart_link').click();
  });

  it('should navigate to checkout page', () => {
    cy.get('[data-test="checkout"]').click();
    
    // Assertions
    cy.url().should('include', 'checkout-step-one.html');
    cy.get('.title').should('have.text', 'Checkout: Your Information');
  });

  it('should require all personal information fields', () => {
    cy.get('[data-test="checkout"]').click();
    cy.get('[data-test="continue"]').click();
    
    // Assertions
    cy.get('[data-test="error"]').should('be.visible');
    cy.get('[data-test="error"]').should('contain', 'First Name is required');
  });

  it('should complete checkout information page', () => {
    cy.get('[data-test="checkout"]').click();
    cy.get('[data-test="firstName"]').type('John');
    cy.get('[data-test="lastName"]').type('Doe');
    cy.get('[data-test="postalCode"]').type('12345');
    cy.get('[data-test="continue"]').click();
    
    // Assertions
    cy.url().should('include', 'checkout-step-two.html');
    cy.get('.title').should('have.text', 'Checkout: Overview');
  });

  it('should display correct item details on checkout overview', () => {
    cy.get('[data-test="checkout"]').click();
    cy.get('[data-test="firstName"]').type('John');
    cy.get('[data-test="lastName"]').type('Doe');
    cy.get('[data-test="postalCode"]').type('12345');
    cy.get('[data-test="continue"]').click();
    
    // Assertions
    cy.get('.cart_item').should('have.length', 1);
    cy.get('.inventory_item_name').should('contain', 'Sauce Labs Backpack');
    cy.get('.summary_subtotal_label').should('be.visible');
    cy.get('.summary_tax_label').should('be.visible');
    cy.get('.summary_total_label').should('be.visible');
  });

  it('should complete the purchase', () => {
    cy.get('[data-test="checkout"]').click();
    cy.get('[data-test="firstName"]').type('John');
    cy.get('[data-test="lastName"]').type('Doe');
    cy.get('[data-test="postalCode"]').type('12345');
    cy.get('[data-test="continue"]').click();
    cy.get('[data-test="finish"]').click();
    
    // Assertions
    cy.url().should('include', 'checkout-complete.html');
    cy.get('.title').should('have.text', 'Checkout: Complete!');
    cy.get('.complete-header').should('have.text', 'Thank you for your order!');
    cy.get('[data-test="back-to-products"]').should('be.visible');
  });
});

describe('Navigation Elements', () => {
  beforeEach(() => {
    cy.visit('https://www.saucedemo.com');
    cy.get('#user-name').type('standard_user');
    cy.get('#password').type('secret_sauce');
    cy.get('#login-button').click();
  });

  it('should open and close the burger menu', () => {
    cy.get('#react-burger-menu-btn').click();
    
    // Assertions
    cy.get('.bm-menu').should('be.visible');
    cy.get('#inventory_sidebar_link').should('be.visible');
    cy.get('#about_sidebar_link').should('be.visible');
    cy.get('#logout_sidebar_link').should('be.visible');
    cy.get('#reset_sidebar_link').should('be.visible');
    
    cy.get('#react-burger-cross-btn').click();
    cy.get('.bm-menu').should('not.be.visible');
  });

  it('should navigate back to products from product details', () => {
    cy.get('.inventory_item_name').first().click();
    cy.get('[data-test="back-to-products"]').click();
    
    // Assertions
    cy.url().should('include', 'inventory.html');
    cy.get('.title').should('have.text', 'Products');
  });

  it('should allow logout via the burger menu', () => {
    cy.get('#react-burger-menu-btn').click();
    cy.get('#logout_sidebar_link').click();
    
    // Assertions
    cy.url().should('eq', 'https://www.saucedemo.com/');
    cy.get('#login-button').should('be.visible');
  });
});