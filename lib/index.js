// Entry point for your plugin
// This should expose your plugin's modules/* START IMPORTS */
/* END IMPORTS */
import MiningDashboard from './components/MiningDashboard';

/* START EXPORTS */

export const metadata = {
  name: '@bpanel/simple-mining',
  pathName: 'simple-mining',
  displayName: 'Simple Mining',
  author: 'bpanel-org',
  description: 'A simple plugin for managing basic mining operations.',
  version: require('../package.json').version,
  icon: 'wrench',
  sidebar: true
};

// decorator for the wallets reducer,
// this will extend the current wallets reducer
// make sure to replace the constants
// and prop names with your actual targets
// NOTE: state uses `seamless-immutable` to ensure immutability
// See their API Docs for more details (e.g. `set`)
// https://www.npmjs.com/package/seamless-immutable
export const reduceWallets = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    // case 'ACTION_CONSTANT': {
    //   return state.set('testProp', payload);
    //   break;
    // }

    default:
      return state;
  }
};

// add new socket listeners
// push an object with event and actionType properties
// onto existing array of listeners
export const addSocketConstants = (sockets = { listeners: [] }) => {
  sockets.listeners
    .push
    // {
    //   event: '',
    //   actionType: 'ACTION_CONSTANT'
    // }
    ();
  return Object.assign(sockets, {
    socketListeners: sockets.listeners
  });
};

export const mapComponentState = {
  Panel: (state, map) =>
    Object.assign(map, {
      chainHeight: state.chain.height
    })
};

export const getRouteProps = {
  '@bpanel/simple-mining': (parentProps, props) =>
    Object.assign(props, {
      chainHeight: parentProps.chainHeight
    })
};

// a decorator for the Panel container component in our app
// here we're extending the Panel's children by adding
// our plugin's component (`MyComponent` below)
// You'll want to make sure to import an actual component
// This is what you need if you're making a new view/route
export const decoratePanel = (Panel, { React, PropTypes }) => {
  return class extends React.Component {
    static displayName() {
      return metadata.name;
    }

    render() {
      const { customChildren = [] } = this.props;
      const routeData = {
        metadata,
        Component: MiningDashboard
      };
      return (
        <Panel
          {...this.props}
          customChildren={customChildren.concat(routeData)}
        />
      );
    }
  };
};
/* END EXPORTS */
