// Entry point for your plugin
// This should expose your plugin's modules
import MiningDashboard from './components/MiningDashboard';
import { PLUGIN_NAMESPACE } from './constants';
import { updateCoinbaseAddress } from './actions';
import { minerReducer } from './reducers';

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

export const mapComponentState = {
  Panel: (state, map) =>
    Object.assign(map, {
      chainHeight: state.chain.height,
      coinbaseAddress: state.plugins[PLUGIN_NAMESPACE].coinbaseAddress
    })
};

export const mapComponentDispatch = {
  Panel: (dispatch, map) =>
    Object.assign(map, {
      updateCoinbaseAddress: addr => dispatch(updateCoinbaseAddress(addr))
    })
};

export const getRouteProps = {
  [metadata.name]: (parentProps, props) =>
    Object.assign(props, {
      chainHeight: parentProps.chainHeight,
      updateCoinbaseAddress: parentProps.updateCoinbaseAddress,
      coinbaseAddress: parentProps.coinbaseAddress
    })
};

export const pluginReducers = {
  [PLUGIN_NAMESPACE]: minerReducer
};

export const persistReducers = [PLUGIN_NAMESPACE];

export const decoratePanel = (Panel, { React, PropTypes }) => {
  return class extends React.Component {
    static displayName() {
      return metadata.name;
    }

    static get propTypes() {
      return {
        customChildren: PropTypes.array
      };
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
