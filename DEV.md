# Installation

## For development environment

Prerequisites:

- A Stripe API Key
- A DockerHub account
- Install skaffold (https://skaffold.dev/docs/install/)
- Install Docker for Mac/Windows and enable kubernetes
- Install cert-manager (https://cert-manager.io/docs/installation/kubernetes/)

Configuration:

- Change the content of `template.spec.containers.image` property in infra/k8s/\*\*-depl.yaml files to be your DockerHub repository name.
- Change the content of `build.artifacts.image` properties in skaffold.yaml file to be your DockerHub repository name.
- Change the value of `STRIPE_PUBLIC_KEY` in client/.env.development file to be your Stripe public key.
- Connect to kubernetes,
  - Create jwt-secret object:
    ```
    $ kubectl create secret generic jwt-secret --from-literal=JWT_KEY={YOUR_JWT_KEY}
    ```
  - Create stripe-secret object:
    ```
    $ kubectl create secret generic stripe-secret --from-literal=STRIPE_KEY={YOUR_STRIPE_SECRET_KEY}
    ```
  - Install Nginx Ingress Controller (https://kubernetes.github.io/ingress-nginx/deploy/#minikube)
    Docker for Mac/Windows
    ```
    $ kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v0.34.1/deploy/static/provider/cloud/deploy.yaml
    ```
- Setup local hosts file to map "localhost" to "ticketing.dev"
  ```
  127.0.0.1  ticketing.dev
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
