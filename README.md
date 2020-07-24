Installation Prerequisites:

Stripe Online Payment Service

- Apply an account to get API key

Digital Ocean

- Apply an account of Digital Ocean VPS Service
- Create a new project called 'Ticketing'
- Create a k8s cluster called 'ticketing'
- Connect to k8s
- Setup the secrets: jwt-secret, stripe-secret
- Install Nginx Ingress Controller
- Install cert-manager for HTTPS tls connection

DockerHub

- Apply an account to push docker image for service deployment

GitHub

- Apply an account to setup CI/CD pipeline
- Setup the secrets: DOCKER_USER, DOCKER_PASSWORD, DIGITALOCEAN_ACCESS_TOKEN
