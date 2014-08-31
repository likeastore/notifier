# Notifier

HTTP API that receives the event and turning that event into corresponding notification.

## API

The entry point of application responsible for initializing the `notifier`.

```js
var notifier = require('./source/notifier');

notifier.start(5050);
```

To initialize the `notifier` you should create 3 entities - `actions`, `resolvers` and `executors`.

### Receiving event

`notifier` exposes `.receive()` call to initialize particular action. The action `callback` is called then `server` receives event with defined type.

```js
notifier.receive('user-registered', function (event, actions, callback) {
	actions.create('send-welcome-email', {user: event.user}, callback);
});
```

You can define as many actions as you need for same event.

```js
notifier.receive('user-payment-recieved', function (event, actions, callback) {
	actions.create('send-invoice-email', {user: event.user, payment: event.amount}, callback);
});

notifier.receive('user-payment-recieved', function (event, actions, callback) {
	actions.create('notify-developers-sms', {user: event.user}, callback);
});
```

### Resolving action

To resolve an action, `notifier` should define resolved. Usually resolve calls database or other service for additional data.

```js
notifier.resolve('user-registered', function (action, actions, callback) {
	db.user.findOne({email: action.email}, function (err, user) {
		if (err) {
			return callback(err);
		}

		var data = {
			email: user.email,
			firstName: user.firstName,
			secondName: user.secondName,
			registered: user.registered
		};

		actions.resolved(action, data, callback);
	});
});
```

Note, there should be only one resolve function for action, otherwise the exception is thrown.

### Skipping action

For any reason, action could be skipped, means that it could be resolved but will not be executed.

```js
notifier.resolve('user-registered', function (action, actions, callback) {
	db.user.findOne({email: action.email}, function (err, user) {
		if (err) {
			return callback(err);
		}

		if (user.email === 'test@example.com') {
			return actions.skipped(action, callback);
		}

		actions.resolved(action, {data: 123}, callback);
	});
});
```


### Executing action

Once action got resolve, it's ready to be executed.

```js
notifier.execute('user-registered', function (action, transport, callback) {
		var vars = [
			{name: 'FIRST_NAME', content: action.data.firstName}
			{name: 'SECOND_NAME', content: action.data.secondName}
			{name: 'REGISTERED_DATE', content: action.data.registered}
		];

		transport.mandrill('/messages/send-template', {
			template_name: 'welcome-email',
			template_content: [],

			message: {
				to: [{email: user.email}],
				global_merge_vars: vars
			}
		}, callback);
});
```

### Events aggregation

TDB.

## Transports

Each `.execute()` function callback receives `transport` object, which exposes intialized transports clients libraries.

Supported now:
* [Mandrill](https://github.com/jimrubenstein/node-mandrill)
* [Twilio](https://github.com/twilio/twilio-node)
* [Android push notification](https://github.com/ToothlessGear/node-gcm)
* [iOS push notification](https://github.com/argon/node-apn)

Will be added soon:
* [Mailgun](https://github.com/jimrubenstein/node-mandrill)

If you want to extend transport support:

1. Fork this repo
2. Update [transport.js](/source/transport.js)
3. Update [config/*.js](/config/development.js) files with new transport section.
4. Send PR.

## How to use?

Clone repo,

```bash
$ git clone git@github.com:likeastore/notifier.git
```

Create `app.js` file,

```js
var notifier = require('./source/notifier');

// initialize actions, resolvers and executors
notifier
	.receive('incoming-event', function () { /* ... */ })
	.resolve('created-action', function () { /* ... */ })
	.execute('created-action', function () { /* ... */ });

// start the server
notifier.start(process.env.PORT);
```

Update `development.config.js` and `production.config.js` configuration. For now, configuration requires connection string to MongoDB, accessToken (shared secret) to access service, mandrill and logentries tokens.

Commit the changes and deploy (heroku, dokku, aws).

```bash
$ git push master heroku
```

Check the server deployed fine,

```bash
$ curl http://notifier.likeastore.com/
{"app":"notifier","env":"production","version":"0.0.5","apiUrl":"/api"}%
```

Send first notification,

```bash
$ echo '{"event": "incoming-event"}' | curl -H "Content-Type:application/json" -d @- http://notifier.likeastore.com/api/events?access_token=ACCESS_TOKEN
```

## Getting started

Check the following code for guidance.

* [example/server.js](example/server.js) with ready to use `notifier` server.
* [production](https://github.com/likeastore/notifier/tree/production) version of notifier used by Likeastore

## Used by

* [Likeastore](https://likeastore.com)
* [DemocracyOS](http://democracyos.org)
* [Tapreserve](http://tapreserve.com)

(if you are one of the user, please send a PR to extend the list)

## Planned

* [REST hooks](http://resthooks.org/)

# License (MIT)

Copyright (c) 2014, Likeastore.com info@likeastore.com

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
