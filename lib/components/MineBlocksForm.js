import React from 'react';
import PropTypes from 'prop-types';
import { Header, Text, Button, TabMenu } from '@bpanel/bpanel-ui';

const MineBlocksForm = ({
  mining,
  numBlocks,
  setNumBlocks,
  mineBlocks,
  cpuMine
}) => {
  const mineForm = (
    <div className="mine-form">
      <input
        type="number"
        id="blocks-to-mine"
        name="numBlocks"
        max="25"
        className="form-control"
        min="0"
        value={numBlocks}
        onChange={e => setNumBlocks(e)}
      />
      <Button
        name="submit"
        onClick={e => mineBlocks(e)}
        className="col-lg-6 mt-3"
      >
        Submit
      </Button>
    </div>
  );

  const mineButton = mining ? (
    <Button type="primary" onClick={() => cpuMine()}>
      Stop CPU Miner
    </Button>
  ) : (
    <Button type="action" onClick={() => cpuMine()}>
      Engage CPU Miner
    </Button>
  );

  const tabs = [
    {
      header: 'Set Num. Blocks',
      body: mining ? <Text>Mining blocks...</Text> : mineForm
    },
    {
      header: 'CPU Mine',
      body: mineButton
    }
  ];

  return (
    <div className="mining-forms">
      <Header type="h4">Set Mining</Header>
      <TabMenu tabs={tabs} />
    </div>
  );
};

MineBlocksForm.propTypes = {
  mining: PropTypes.bool,
  numBlocks: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  coinbaseAddress: PropTypes.string,
  setNumBlocks: PropTypes.func,
  mineBlocks: PropTypes.func,
  cpuMine: PropTypes.func
};

export default MineBlocksForm;
