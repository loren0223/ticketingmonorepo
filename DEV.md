# Simple Ticketing Microservices App

## Purpose

Ticketing is a mobile-ready, next.js powered e-commercial web app that based on microservices.

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

Prerequisites:

- A Stripe API Key
- A DockerHub account
- Install skaffold (https://skaffold.dev/docs/install/)
- Install Docker for Mac/Windows and enable kubernetes

Configuration:

- Change the content of `template.spec.containers.image` property in infra/k8s/\*\*-depl.yaml files to be your DockerHub repository name.
- Change the content of `build.artifacts.image` properties in skaffold.yaml file to be your DockerHub repository name.
- Change the value of container env named `BASE_URL_ON_SERVER` in infra/k8s-prod/client-depl.yaml file to be your production domain name.
- Connect to kubernetes,
  - Create jwt-secret object:
    ```
    $ kubectl create secret generic jwt-secret --from-literal=JWT_KEY={YOUR_JWT_KEY}
    ```
  - Create jwt-secret object:
    ```
    $ kubectl create secret generic stripe-secret --from-literal=STRIPE_KEY={YOUR_STRIPE_KEY}
    ```
  - Install Nginx Ingress Controller (https://kubernetes.github.io/ingress-nginx/deploy/#minikube)
    Docker for Mac/Windows
    ```
    $ kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v0.34.1/deploy/static/provider/cloud/deploy.yaml
    ```
- Setup local hosts file to map localhost to ticketing.dev
  ```
  127.0.0.1  ticketing.dev
  ```

Install the dependencies and devDependencies

```sh
$ cd auth [cd client] [cd common] [cd expiration] [cd orders] [cd payments] [cd tickets]
$ npm install
```

Start the server

```
$ skaffold dev
```

Login the app

```
https://ticketing.dev
```

Type `thisisunsafe` to pass if there is security warning on Chrome.

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
