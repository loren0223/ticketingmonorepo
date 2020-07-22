import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/build-client';
import Header from '../components/header';

const AppComponent = ({ Component, pageProps, currentuser }) => {
  // console.log(Component);
  // console.log(pageProps);
  // console.log(currentuser);

  return (
    <div>
      <Header currentuser={currentuser} />
      <div className="container">
        <Component currentuser={currentuser} {...pageProps} />
      </div>
    </div>
  );
};

// appContext === { Component, ctx:{req, res}, ... }
AppComponent.getInitialProps = async (appContext) => {
  // For every page
  const client = buildClient(appContext.ctx);
  const { data } = await client.get('/api/users/currentuser');

  // For particular page has getInitialProps()
  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    //pageProps = await appContext.Component.getInitialProps(appContext.ctx);
    pageProps = await appContext.Component.getInitialProps(
      appContext.ctx,
      client,
      data.currentuser
    );
  }

  return { pageProps, ...data };
};

export default AppComponent;
