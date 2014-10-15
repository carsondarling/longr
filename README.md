# [Longr](https://github.com/carsondarling/longr)

Longr is a simple URL-shortener built in Node.js and using SQLite3 as a backend. The goal of Longr is to provide an easy way to add a URL-shortening service onto an app, so there's no frontend.

To get started super simply, just clone this repo and start Longr running.

```
git clone https://github.com/carsondarling/longr
cd longr
npm install --production
npm start
```

In its default configuration, Longr uses an in-memory store for SQLite. It also runs on port 6430, and all the URLs are based on `http://localhost:6430`.

You can test Longr out using cURL:

```
$ curl -i -X POST localhost:6430/?url=http://google.com/1236234
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 70
Date: Wed, 15 Oct 2014 06:00:38 GMT
Connection: keep-alive

{"target":"http://google.com/1236234","url":"http://localhost:6430/F"}%


$ curl -i http://localhost:6430/F
HTTP/1.1 302 Moved Temporarily
X-Powered-By: Express
Location: http://google.com/1236234
Vary: Accept
Content-Type: text/plain; charset=utf-8
Content-Length: 59
Date: Wed, 15 Oct 2014 06:00:51 GMT
Connection: keep-alive

Moved Temporarily. Redirecting to http://google.com/1236234%
```

## Configuration

Configuration for Longr is provided entirely by environment variables.

__PORT:__ Port that Longr will listen on (default: `6430`)

__DOMAIN:__ Domain that URLs will start with (default: `http://localhost:$PORT`)

__DB_PATH:__ Path to SQLite database file (default: `:memory:`)

__ALPHABET:__ String of characters to use in shortened links, must not repeat (default: `hFDlqf4LXAMZonzat92xui51OpvjB0cCQY3kWdU8GVH7s6KEwPrTembJySgNRI`). The length of the alphabet determines the base of the encoding, and the ordering determines the value associated with each character. For example, using the alphabet `01` will cause the shortened links to be in binary. Using `0123456789` will be in decimal, and `0123456789ABCDEF` will be in hex. The longer the alphabet is, the fewer characters needed for a given link. The default value includes all URL-safe characters in a random order.

__AUTH_USER & AUTH_PASS:__ Username for HTTP Basic authentication. Auth is only applied to creating links, not claiming them. Both `AUTH_USER` and `AUTH_PASS` must be provided for auth to be enabled.

## Docker

*Coming soon*

## API

## Debugging

To see debugging output from Longr, set the `DEBUG` environment variable.

```
$ DEBUG=longr* npm start

  longr:db Database path: :memory: +0ms
  longr Listening on 6430 +180ms
  longr:app Creating link for http://google.com/1236234 +3s
  longr:app sending link +9ms
  longr:app grabbing token +13s
  longr:app found link F -> http://google.com/1236234 +2ms
```

## Copyright & License

Copyright (c) 2014 Carson Darling - Released under the [MIT license](LICENSE).