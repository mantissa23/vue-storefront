import Vue from 'vue'
import Vuex from 'vuex'
import * as types from './mutation-types'
import localForage from 'localforage'
import UniversalStorage from 'core/lib/storage'
import order from './modules/order'
import product from './modules/product'
import category from './modules/category'
import attribute from './modules/attribute'
import cart from './modules/cart'
import wishlist from './modules/wishlist'
import compare from './modules/compare'
import user from './modules/user'
import payment from './modules/payment'
import shipping from './modules/shipping'
import ui from './modules/ui-store'
import checkout from './modules/checkout'
import homepage from './modules/homepage'
import stock from './modules/stock'
import tax from './modules/tax'
import social from './modules/social-tiles'
import claims from './modules/claims'
import sync from './modules/sync'
import promoted from './modules/promoted-offers'
import themeModules from 'theme/store'

Vue.prototype.$db = {
  ordersCollection: new UniversalStorage(localForage.createInstance({
    name: 'shop',
    storeName: 'orders'
  })),

  categoriesCollection: new UniversalStorage(localForage.createInstance({
    name: 'shop',
    storeName: 'categories'
  })),

  attributesCollection: new UniversalStorage(localForage.createInstance({
    name: 'shop',
    storeName: 'attributes'
  })),

  cartsCollection: new UniversalStorage(localForage.createInstance({
    name: 'shop',
    storeName: 'carts'
  })),

  elasticCacheCollection: new UniversalStorage(localForage.createInstance({
    name: 'shop',
    storeName: 'elasticCache'
  })),

  productsCollection: new UniversalStorage(localForage.createInstance({
    name: 'shop',
    storeName: 'products'
  })),

  claimsCollection: new UniversalStorage(localForage.createInstance({
    name: 'shop',
    storeName: 'claims'
  })),

  wishlistCollection: new UniversalStorage(localForage.createInstance({
    name: 'shop',
    storeName: 'wishlist'
  })),

  compareCollection: new UniversalStorage(localForage.createInstance({
    name: 'shop',
    storeName: 'compare'
  })),

  usersCollection: new UniversalStorage(localForage.createInstance({
    name: 'shop',
    storeName: 'user'
  })),

  syncTaskCollection: new UniversalStorage(localForage.createInstance({
    name: 'shop',
    storeName: 'syncTasks'
  })),

  checkoutFieldsCollection: new UniversalStorage(localForage.createInstance({
    name: 'shop',
    storeName: 'checkoutFieldValues'
  })),

  newsletterPreferencesCollection: new UniversalStorage(localForage.createInstance({
    name: 'shop',
    storeName: 'newsletterPreferences'
  })),

  ordersHistoryCollection: new UniversalStorage(localForage.createInstance({
    name: 'shop',
    storeName: 'ordersHistory'
  }))
}

global.db = Vue.prototype.$db // localForage instance

Vue.use(Vuex)

const state = {
}

const mutations = {
  TOPICS_LIST: (state, topics) => {
    state.topics = topics
  },

  INCREMENT: (state) => {
    state.count++
  },

  DECREMENT: (state) => {
    state.count--
  }
}

const plugins = [
  store => {
    store.subscribe((mutation, state) => {
      let nameArray = mutation.type.split('/')
      let nameBegin, nameEnd
      if (nameArray.length) {
        nameBegin = nameArray[0]
        nameEnd = nameArray[nameArray.length - 1]
      } else {
        console.error('Store mutation name is incorrectly formed')
      }

      if (nameBegin === types.SN_CART) { // check if this mutation is cart related
        global.db.cartsCollection.setItem('current-cart', state.cart.cartItems).catch((reason) => {
          console.error(reason) // it doesn't work on SSR
        }) // populate cache
        global.db.cartsCollection.setItem('current-cart-token', state.cart.cartServerToken).catch((reason) => {
          console.error(reason)
        })
      }
      if (nameBegin === types.SN_WISHLIST) { // check if this mutation is wishlist related
        global.db.wishlistCollection.setItem('current-wishlist', state.wishlist.itemsWishlist).catch((reason) => {
          console.error(reason) // it doesn't work on SSR
        })
      }
      if (nameBegin === types.SN_COMPARE) { // check if this mutation is compare related
        global.db.compareCollection.setItem('current-compare', state.compare.itemsCompare).catch((reason) => {
          console.error(reason) // it doesn't work on SSR
        })
      }
      if (nameEnd === types.USER_INFO_LOADED) { // check if this mutation is user related
        global.db.usersCollection.setItem('current-user', state.user.current).catch((reason) => {
          console.error(reason) // it doesn't work on SSR
        }) // populate cache
      }
      if (nameEnd === types.USER_ORDERS_HISTORY_LOADED) { // check if this mutation is user related
        global.db.ordersHistoryCollection.setItem('orders-history', state.user.orders_history).catch((reason) => {
          console.error(reason) // it doesn't work on SSR
        }) // populate cache
      }
      if (nameEnd === types.USER_TOKEN_CHANGED) { // check if this mutation is user related
        global.db.usersCollection.setItem('current-token', state.user.token).catch((reason) => {
          console.error(reason) // it doesn't work on SSR
        }) // populate cache
      }
      if (nameBegin === types.SN_CHECKOUT) {
        if (nameEnd === types.CHECKOUT_SAVE_PERSONAL_DETAILS) {
          global.db.checkoutFieldsCollection.setItem('personal-details', state.checkout.personalDetails).catch((reason) => {
            console.error(reason) // it doesn't work on SSR
          }) // populate cache
        } else if (nameEnd === types.CHECKOUT_SAVE_SHIPPING_DETAILS) {
          global.db.checkoutFieldsCollection.setItem('shipping-details', state.checkout.shippingDetails).catch((reason) => {
            console.error(reason) // it doesn't work on SSR
          }) // populate cache
        } else if (nameEnd === types.CHECKOUT_SAVE_PAYMENT_DETAILS) {
          global.db.checkoutFieldsCollection.setItem('payment-details', state.checkout.paymentDetails).catch((reason) => {
            console.error(reason) // it doesn't work on SSR
          }) // populate cache
        }
      }
      if (nameEnd === types.USER_UPDATE_PREFERENCES) {
        global.db.newsletterPreferencesCollection.setItem('newsletter-preferences', state.user.newsletter).catch((reason) => {
          console.error(reason)
        })
      }
    })
  }
]

export default new Vuex.Store({
  modules: {
    order,
    product,
    category,
    attribute,
    cart,
    wishlist,
    compare,
    user,
    payment,
    shipping,
    ui,
    homepage,
    social,
    stock,
    checkout,
    tax,
    claims,
    sync,
    promoted,
    ...themeModules
  },
  state,
  mutations,
  plugins
})
