// Entry point for your plugin
// This should expose your plugin's modules
/* START IMPORTS */
import MiningDashboard from './components/MiningDashboard';
/* END IMPORTS */

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

    static get propTypes(){
      return {
        customChildren: PropTypes.array
      }
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
