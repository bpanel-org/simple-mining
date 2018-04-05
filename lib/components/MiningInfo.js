import React from 'react';
import PropTypes from 'prop-types';
import { Text } from '@bpanel/bpanel-ui';

const MinerInfo = ({ info, blocks }) => {
  const miningInfo = Object.assign(info, { blocks });
  return (
    <div className="mining-info row">
      {Object.keys(miningInfo).map(key => (
        <Text
          key={key}
          className="col-6"
          style={{ textTransform: 'capitalize' }}
          type="p"
        >
          {key}: {info[key]}
        </Text>
      ))}
    </div>
  );
};

MinerInfo.propTypes = {
  info: PropTypes.object,
  blocks: PropTypes.number
};

export default MinerInfo;
