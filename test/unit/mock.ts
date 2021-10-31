import { ExampleApi, CartApi } from '../../src/client/api';
import { initStore, ApplicationState } from '../../src/client/store';

export const basename = '/hw/store';

export const cartMock = {
    '0': { 'name': 'Potato', 'count': 1, 'price': 49 },
    '1': { 'name': 'Carrot', 'count': 2, 'price': 99 }
};

export function getStore(initState: ApplicationState = { cart: {}, details: {} }) {
    const api = new ExampleApi(basename);
    const cart = new CartApi();
    cart.setState(initState.cart);
    return initStore(api, cart);
}