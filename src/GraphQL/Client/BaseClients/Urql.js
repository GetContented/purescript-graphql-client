import 'isomorphic-unfetch';
import { createClient, dedupExchange, cacheExchange, fetchExchange, subscriptionExchange } from '@urql/core';
import { createClient as createWsClient } from 'graphql-ws';
import { subscribe, pipe } from 'wonka';

const createClient_ = function (opts) {

  let wsClient = null

  if (opts.websocketUrl) {
    wsClient = createWsClient({
      url: opts.websocketUrl
    })
  }

  const otherExchanges = opts.websocketUrl
    ? [
        subscriptionExchange({
          forwardSubscription (operation) {
            return {
              subscribe: function (sink) {
                const dispose = wsClient.subscribe(operation, sink)
                return {
                  unsubscribe: dispose
                }
              }
            }
          }
        })
      ]
    : []

  const defaultExchanges = [dedupExchange, cacheExchange, fetchExchange]

  return createClient({
    url: opts.url,
    fetchOptions: { headers: opts.headers },
    exchanges: defaultExchanges.concat(otherExchanges)
  })
}
let globalClient

export function createGlobalClientUnsafeImpl (opts) {
  return function () {
    if (globalClient) {
      return globalClient
    }
    globalClient = createClient_(opts)

    return globalClient
  }
}

export function createClientImpl (opts) {
  return function () {
    return createClient_(opts)
  }
}

export function createSubscriptionClientImpl (opts) {
  return function () {
    return createClient_(opts)
  }
}

export function queryImpl (client) {
  return function (query) {
    return function (variables) {
      return function (onError, onSuccess) {

        try {
          client
            .query(query, variables)
            .toPromise()
            .then(onSuccess)
            .catch(onError)
        } catch (err) {
          onError(err)
        }
        return function (cancelError, onCancelerError, onCancelerSuccess) {
          onCancelerSuccess()
        }
      }
    }
  }
}

export function mutationImpl (client) {
  return function (mutation) {
    return function (variables) {
      return function (onError, onSuccess) {
        try {
          client
            .mutation(mutation, variables)
            .toPromise()
            .then(onSuccess)
            .catch(onError)
        } catch (err) {
          onError(err)
        }
        return function (cancelError, onCancelerError, onCancelerSuccess) {
          onCancelerSuccess()
        }
      }
    }
  }
}

export function subscriptionImpl (client) {
  return function (query) {
    return function (variables) {
      return function (callback) {
        return function () {
          const { unsubscribe } = pipe(
            client.subscription(query, variables),
            subscribe(function (value) {
              callback(value)()
            })
          )
          return unsubscribe
        }
      }
    }
  }
}
