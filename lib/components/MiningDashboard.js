import React from 'react';
import PropTypes from 'prop-types';
import { Header, Text, Button, Input } from '@bpanel/bpanel-ui';
import { getClient } from '@bpanel/bpanel-utils';

import MiningInfo from './MiningInfo';
import MineBlocksForm from './MineBlocksForm';

class MiningDashboard extends React.PureComponent {
  constructor(props) {
    super(props);
    const coinbase = window.sessionStorage.getItem('coinbaseAddress');
    this.state = {
      mining: false,
      coinbaseAddress: '',
      savedCoinbase: coinbase ? coinbase : '',
      numBlocks: 0,
      miningInfo: {}
    };
    this.client = null;
  }

  static get propTypes() {
    return {
      chainHeight: PropTypes.number
    };
  }

  static getDerivedStateFromProps({ chainHeight }, { miningInfo }) {
    if (chainHeight > miningInfo.blocks)
      return { miningInfo: Object.assign({ blocks: chainHeight }, miningInfo) };
    return null;
  }

  async componentDidMount() {
    this.client = getClient().node;
    const mining = await this.client.execute('getgenerate');
    const miningInfo = await this.client.execute('getmininginfo');
    this.setState({ mining, miningInfo });
  }

  onUpdateCoinbase(e) {
    e.preventDefault();
    this.setState({ coinbaseAddress: e.target.value });
  }

  async onSetAddress() {
    const { coinbaseAddress } = this.state;
    window.sessionStorage.setItem('coinbaseAddress', coinbaseAddress);
    this.setState({ savedCoinbase: coinbaseAddress });
  }

  setNumBlocks(e) {
    e.preventDefault();
    const numBlocks = e.target.value;
    this.setState({ numBlocks });
  }

  async cpuMine() {
    const { mining } = this.state;
    const generate = !mining;
    try {
      const mining = await this.client.execute('setgenerate', [generate]);
      const miningInfo = await this.client.execute('getmininginfo');
      this.setState({ mining, miningInfo });
    } catch (e) {
      //eslint-disable-next-line no-console
      console.error(e);
    }
  }

  async mineBlocks(e) {
    e.preventDefault();
    const { savedCoinbase, numBlocks } = this.state;
    try {
      if (!savedCoinbase) {
        alert('Must set a coinbase address to mine');
      } else {
        this.setState({ mining: true });
        this.client
          .execute('generatetoaddress', [parseInt(numBlocks), savedCoinbase])
          .then(async () => {
            const mining = await this.client.execute('getgenerate');
            this.setState({ mining, numBlocks: 0 });
          })
          .catch(() => this.setState({ mining: false }));
      }
    } catch (e) {
      if (e.message) {
        alert(`Problem with miner: ${e.message}`);
      } else {
        alert('Problem with miner. See console for more information');
        //eslint-disable-next-line no-console
        console.error(e);
      }
      const mining = await this.client.execute('getgenerate');
      this.setState({ mining, numBlocks: 0 });
    }
  }

  render() {
    const {
      mining,
      coinbaseAddress,
      savedCoinbase,
      numBlocks,
      miningInfo
    } = this.state;
    const { chainHeight } = this.props;

    let info = miningInfo ? (
      <MiningInfo info={miningInfo} blocks={chainHeight} />
    ) : (
      <Text>Loading...</Text>
    );

    return (
      <div className="simple-mining">
        <Header type="h2">Simple Mining Dashboard</Header>
        <Text type="p">
          This is a simple mining dashboard for playing with the miner on your
          node. It&#39;s mainly meant as a playground for testing, especially in
          regtest and simnet environments.
        </Text>
        <Header type="h4">Miner State</Header>
        <div className="row">
          <Text type="span" className="col-lg-2">
            Miner: {mining ? 'on' : 'off'}
          </Text>
          <Text type="span" className="col-lg-6">
            Coinbase Address: {savedCoinbase ? savedCoinbase : 'No address set'}
          </Text>
        </div>
        <div className="row mt-5">
          <div className="set-coinbase col-lg">
            <Header type="h4">Set Coinbase Address</Header>
            <Input
              type="text"
              placeholder="Set Address"
              name="coinbaseAddress"
              value={coinbaseAddress}
              className="form-control"
              onChange={e => this.onUpdateCoinbase(e)}
            />
            <Button
              onClick={e => this.onSetAddress(e)}
              className="col-lg-6 mt-3"
            >
              Set Address
            </Button>
          </div>
          <div className="col-lg">
            <MineBlocksForm
              coinbaseAddress={coinbaseAddress}
              numBlocks={numBlocks}
              setNumBlocks={e => this.setNumBlocks(e)}
              mineBlocks={e => this.mineBlocks(e)}
              onSetAddress={e => this.onSetAddress(e)}
              cpuMine={() => this.cpuMine()}
              mining={mining}
            />
          </div>
        </div>
        <div className="row mt-4">
          <Header type="h4">Mining Info</Header>
          {info}
        </div>
      </div>
    );
  }
}

export default MiningDashboard;
