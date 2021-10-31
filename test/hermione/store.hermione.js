const { assert } = require('chai');

describe('store', async function () {
    it('should load the page title', async function () {
        const browser = this.browser;
        await browser.url('/hw/store/catalog');

        const title = await browser.$('h1').getText();
        assert.equal(title, 'Catalog');
    });

    it('products grid should look the same', async function () {
        await this.browser.url('/hw/store/catalog');

        const ProductItem = await this.browser.$('.ProductItem');
        await ProductItem.waitForExist();

        await this.browser.assertView('catalog', '.Application', {
            ignoreElements: [
                '.nav-link',
                '.card-body'
            ],
            allowViewportOverflow: true
        });
    });


    it('should not have items on the cart ', async function () {
        await this.browser.url('/hw/store/catalog/0');
        const productTitle = await this.browser.$('h1.ProductDetails-Name').getText();

        const addToCartButton = await this.browser.$('.ProductDetails-AddToCart');
        addToCartButton.waitForExist();
        addToCartButton.click();
        addToCartButton.click();

        await this.browser.$('.nav-link[href="/hw/store/cart"]').click();
        const clearCartButton = await this.browser.$('.Cart-Clear');
        await clearCartButton.waitForExist();
        clearCartButton.click();

        await this.browser.assertView('cart clear', '.navbar', {
        });
    });

    it('should have item on cart after page refresh ', async function () {
        await this.browser.url('/hw/store/catalog/0');
        const productTitle = await this.browser.$('h1.ProductDetails-Name').getText();

        const addToCartButton = await this.browser.$('.ProductDetails-AddToCart');
        addToCartButton.waitForExist();
        addToCartButton.click();

        await this.browser.$('.nav-link[href="/hw/store/cart"]').click();
        await this.browser.refresh();

        const titleAfterRefresh = await this.browser.$('.Cart-Name').getText();
        assert.equal(productTitle, titleAfterRefresh);
    });
});

describe('general', async function () {
    it('product grid should be solid', async function() {
        const browser = this.browser;
        await browser.url('/hw/store/catalog');
        await browser.assertView('desktop','.ProductItem', {
            ignoreElements: ['.Image', '.ProductItem-Name', '.ProductItem-Price']
        });
    });

    it('navbar should be visible', async function() {
        const browser = this.browser;
        await browser.url('/hw/store/');
        await browser.setWindowSize(1240, 1024);
        await browser.assertView('menu','.navbar', {
            ignoreElements: ['.Application-Brand',]
        });
    });

    it('navbar should be collpased on mobile', async function() {
        const browser = this.browser;
        await browser.url('/hw/store/');
        await browser.setWindowSize(560, 1024);

        await browser.assertView('menu-mobile','.navbar', {
            ignoreElements: ['.Application-Brand',]
        });
    });
});