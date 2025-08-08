import React, { useState } from 'react';

const ApexStats = () => {
  const [player, setPlayer] = useState('');
  const [platform, setPlatform] = useState('');
  const [data, setData] = useState('');

  const getStats = async () => {
    try {
      const url = `http://localhost:8080/api/apex/player/info?player=${encodeURIComponent(player)}&platform=${encodeURIComponent(platform)}`;
      const response = await fetch(url);
      const result = await response.json();
      setData(result);
      console.log(result);
    } catch (error) {
      console.error('Error Fetching Stats: ', error);
    }
  };
  return (
    <div>
      <input
        value={player}
        onChange={(e) => setPlayer(e.target.value)}
        placeholder="Enter Player Name"
      />
      <input
        value={platform}
        onChange={(e) => setPlatform(e.target.value)}
        placeholder="Enter Gaming Platform"
      />
      <button onClick={getStats}>Get Stats</button>

      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default ApexStats;
