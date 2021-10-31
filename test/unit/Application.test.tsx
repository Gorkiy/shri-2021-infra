import { it, expect } from '@jest/globals';
import { render, screen, within, waitFor, fireEvent } from '@testing-library/react';
import { getStore, cartMock } from './mock';
import userEvent from '@testing-library/user-event';
import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Application } from '../../src/client/Application';
import React from 'react';
import { createMemoryHistory } from 'history';

describe('Application', () => {
    it('cart items should appear on localStorage', () => {
        const store = getStore({ cart: cartMock, details: {} });

        const history = createMemoryHistory({
            initialEntries: ['/cart'],
            initialIndex: 0
        }
        );

        const cartStorage = localStorage && JSON.parse(localStorage.getItem('example-store-cart'));

        expect(cartStorage).toBeTruthy();

        expect(cartStorage).toEqual({
            '0': { 'name': 'Potato', 'count': 1, 'price': 49 },
            '1': { 'name': 'Carrot', 'count': 2, 'price': 99 }
        })
    })

    it('should render menu items', () => {
        const store = getStore({ cart: cartMock, details: {} });
        const history = createMemoryHistory({
            initialEntries: ['/catalog'],
            initialIndex: 0
        }
        );

        const application = (
            <Router history={history}>
                <Provider store={store}>
                    <Application />
                </Provider>
            </Router>
        );

        const { container } = render(application);

        const linkCatalog = container.querySelector('a[href="/catalog"]');
        const linkDelivery = container.querySelector('a[href="/delivery"]');
        const linkContact = container.querySelector('a[href="/contacts"]');
        const linkCart = container.querySelector('a[href="/cart"]');

        const linksExist = linkCatalog && linkDelivery && linkContact && linkCart ? true : false;
        expect(linksExist).toBe(true);
    })
})

describe('Catalog', () => {
    it('/catalog contains proper title', () => {
        const store = getStore({ cart: cartMock, details: {} });
        const history = createMemoryHistory({
            initialEntries: ['/catalog'],
            initialIndex: 0
        }
        );

        const application = (
            <Router history={history}>
                <Provider store={store}>
                    <Application />
                </Provider>
            </Router>
        );

        const { getByRole } = render(application);

        expect(getByRole('heading', {
            name: /catalog/i
        })).toBeTruthy();
    })
})

describe('Cart', () => {
    it('should empty product cart', () => {
        const store = getStore({ cart: cartMock, details: {} });
        const history = createMemoryHistory({
            initialEntries: ['/cart'],
            initialIndex: 0
        });

        const application = (
            <Router history={history}>
                <Provider store={store}>
                    <Application />
                </Provider>
            </Router>
        );

        const { container, getByRole } = render(application);
        const clearCartButton = getByRole('button', { name: /clear shopping cart/i });
        userEvent.click(clearCartButton);
        const cartLink = container.querySelector('.nav-link[href="/cart"]');

        // Must be cart without (n);
        expect(cartLink.textContent).toContain('Cart');
    })

    it('should render all cart items', () => {
        const store = getStore({ cart: cartMock, details: {} });
        const history = createMemoryHistory({
            initialEntries: ['/cart'],
            initialIndex: 0
        });

        const application = (
            <Router history={history}>
                <Provider store={store}>
                    <Application />
                </Provider>
            </Router>
        );

        const { container } = render(application);
        const items = container.querySelectorAll('.Cart-Name');

        [...items].forEach((el, i) => {
            expect(el.textContent).toContain(cartMock[i]?.name);
        });
    })
})