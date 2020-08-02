# Simple Ticketing Microservices App

## Purpose

Ticketing is an Online Auction Website that the backend developed based on microservices.

- Implement microservices of authentication, orders, tickets, payments and order expiration management
- Async communication using events between services
- Authentication on service using JWT that transferred by cookie

## Services

| Service    | Description                                                                                    |
| ---------- | ---------------------------------------------------------------------------------------------- |
| auth       | Everything related to user signup/signin/signout.                                              |
| tickets    | Ticket creation/editing. Knows whether a ticket can be updated                                 |
| orders     | Order creation/editing.                                                                        |
| expiration | Watches for orders to be created, cancels them after 15 minutes.                               |
| payments   | Handles credit card payments. Cancels orders if payments fails, completes if payment succeeds. |
| client     | Ticketing app web client.                                                                      |

## Tech

Ticketing uses a number of open source projects to work properly:

- [node.js] - evented I/O for the backend
- [Express] - fast node.js network app framework
- [typescript] - a typed superset of JavaScript that compiles to plain JavaScript
- [mongoose] - elegant mongodb object modeling for node.js
- [mongoose-update-if-current] - Optimistic concurrency control plugin for Mongoose v5.0 and higher
- [jsonwebtoken] - An implementation of JSON Web Tokens
- [cookie-session] - Simple cookie-based session middleware
- [jest] - a delightful JavaScript Testing Framework
- [supertest] - HTTP assertions made easy
- [mongodb-memory-server] - spins up an actual/real MongoDB server programmatically from node, for testing or mocking during development
- [np] - A better npm publish
- [node-nats-streaming] - Stan.js - Node.js client for NATS Streaming
- [bull] - The fastest, most reliable, Redis-based queue for Node
- [next.js] - The React framework for web apps!
- [axios] - Promise based HTTP client for the browser and node.js
- [Bootstrap] - great UI boilerplate for modern web apps
- [stripe] - Online payment processing for internet businesses
- [docker] - a tool designed to make it easier to create, deploy, and run applications by using containers
- [kubernetes] - an open-source system for automating deployment, scaling, and management of containerized applications
- [skaffold] - handles the workflow for building, pushing and deploying your application

## Installation

#### For development environment

- [DEV.md][dev]

[//]: # "These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax"
[node.js]: http://nodejs.org
[bootstrap]: http://twitter.github.com/bootstrap/
[jquery]: http://jquery.com
[express]: http://expressjs.com
[typescript]: https://www.typescriptlang.org/
[mongoose]: https://mongoosejs.com/
[mongoose-update-if-current]: https://www.npmjs.com/package/mongoose-update-if-current
[jsonwebtoken]: https://www.npmjs.com/package/jsonwebtoken
[cookie-session]: https://www.npmjs.com/package/cookie-session
[jest]: https://jestjs.io/
[supertest]: https://www.npmjs.com/package/supertest
[mongodb-memory-server]: https://www.npmjs.com/package/mongodb-memory-server
[np]: https://www.npmjs.com/package/np
[node-nats-streaming]: https://www.npmjs.com/package/node-nats-streaming
[bull]: https://www.npmjs.com/package/bull
[next.js]: https://nextjs.org
[axios]: https://github.com/axios/axios
[stripe]: https://stripe.com/
[docker]: https://www.docker.com/
[kubernetes]: https://kubernetes.io/
[skaffold]: https://skaffold.dev/
[dev]: https://github.com/loren0223/ticketingmonorepo/tree/master/DEV.md
[prod+do]: https://github.com/loren0223/ticketingmonorepo/tree/master/PROD-DO.md
[prod+gcp]: https://github.com/loren0223/ticketingmonorepo/tree/master/PROD-GCP.md
