import axios from 'axios';

export default ({ req }) => {
  if (typeof window === 'undefined') {
    // We are on the server!
    //    URL Pattern of Cross Namespace Services Communication:
    //    http://[SERVICE_OF_NAMESPACE].[NAMESPACE].svc.cluster.local/.........
    //
    //    The optional configuration tells ingress-nginx to understand where we come from
    return axios.create({
      baseURL:
        'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
      headers: req.headers,
    });
  } else {
    // We are on the browser!
    return axios.create({ baseURL: '/' });
  }
};
