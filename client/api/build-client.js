import axios from 'axios';

export default ({ req }) => {
  const baseUrlOnServer = process.env.BASE_URL_ON_SERVER;

  if (typeof window === 'undefined') {
    // We are on the server!
    //    URL Pattern of Cross Namespace Services Communication:
    //    http://[SERVICE_OF_NAMESPACE].[NAMESPACE].svc.cluster.local/.........
    //
    //    The optional configuration tells ingress-nginx to understand where we come from
    return axios.create({
      // For development
      // baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
      // For production
      // baseURL: 'http://{YOUR_DOMAIN_NAME}',
      baseURL: baseUrlOnServer,
      headers: req.headers,
    });
  } else {
    // We are on the browser!
    return axios.create({ baseURL: '/' });
  }
};
