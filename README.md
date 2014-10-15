# Longr

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

### Configuration

### Docker

### API

### Debugging

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