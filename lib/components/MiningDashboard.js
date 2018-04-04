import React from 'react';
import PropTypes from 'prop-types';
import { Header, Text, Button, Input } from '@bpanel/bpanel-ui';
import { bpanelClient } from '@bpanel/bpanel-utils';

const MinerInfo = info => (
  <div className="mining-info row">
    {Object.keys(info).map(key => (
      <Text key={key} className="col-6" style={{ textTransform: 'capitalize' }} type="p">
        {key}: {info[key]}
      </Text>
    ))}
  </div>
);

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
    this.client = bpanelClient();
  }

  async componentDidMount() {
    const mining = await this.client.execute('getgenerate');
    const miningInfo = await this.client.execute('getmininginfo');
    this.setState({ mining, miningInfo });
  }

  onUpdateCoinbase(e) {
    e.preventDefault();
    this.setState({ coinbaseAddress: e.target.value });
  }

  async onSetAddress(e) {
    const { coinbaseAddress } = this.state;
    window.sessionStorage.setItem('coinbaseAddress', coinbaseAddress);
    this.setState({ savedCoinbase: coinbaseAddress });
  }

  setNumBlocks(e) {
    e.preventDefault();
    const numBlocks = e.target.value;
    this.setState({ numBlocks });
  }

  async mineBlocks(e) {
    e.preventDefault();
    const { savedCoinbase, numBlocks } = this.state;
    try {
      if (!savedCoinbase) {
        alert('Must set a coinbase address to mine');
      } else {
        const result = await this.client.execute('generatetoaddress', [
          parseInt(numBlocks),
          savedCoinbase
        ]);

        alert(`Successfully initiated mining for ${numBlocks} blocks.`);
      }
    } catch (e) {
      if (e.message) {
        alert(`Problem with miner: ${e.message}`);
      } else {
        alert('Problem with miner. See console for more information');
        //eslint-disable-next-line no-console
        console.error(e);
      }
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

    let info = miningInfo ? MinerInfo(miningInfo) : <Text>Loading...</Text>;

    return (
      <div className="simple-mining">
        <Header type="h2">Simple Mining Dashboard</Header>
        <Text type="p">
          This is a simple mining dashboard for playing with the miner on your
          node. It's mainly meant as a playground for testing, especially in
          regtest and simnet environments.
        </Text>
        <Header type="h4">Miner State</Header>
        <Text type="p">Miner: {mining ? 'on' : 'off'}</Text>
        <Text type="p">
          Coinbase Address: {savedCoinbase ? savedCoinbase : 'No address set'}
        </Text>
        {!mining && (
          <div className="mining-forms">
            <Header type="h4">Set Coinbase Address</Header>
            <Input
              type="text"
              placeholder="Set Address"
              name="coinbaseAddress"
              value={coinbaseAddress}
              onChange={e => this.onUpdateCoinbase(e)}
            />

            <Button onClick={e => this.onSetAddress(e)}>Set Address</Button>

            <Header type="h4">Mine Blocks</Header>
            <form onSubmit={e => this.mineBlocks(e)}>
              <input
                type="number"
                id="blocks-to-mine"
                name="numBlocks"
                value={numBlocks}
                onChange={e => this.setNumBlocks(e)}
              />
              <Input name="submit" type="submit" />
            </form>
          </div>
        )}
        <Header type="h4">Mining Info</Header>
        {info}
      </div>
    );
  }
}

export default MiningDashboard;
