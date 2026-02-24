import React, { useState, useEffect } from 'react';
import mqtt from 'mqtt';

const MqttReceiver = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [connectionStatus, setConnectionStatus] = useState('Disconnected');

  useEffect(() => {
    setConnectionStatus('Connecting');
    const client = mqtt.connect('ws://broker.emqx.io:8083/mqtt');

    client.on('connect', () => {
      setConnectionStatus('Connected');
      client.subscribe('testtopic/react');
    });

    client.on('message', (_, message) => {
      setMessages(prev => [...prev, message.toString()]);
    });

    client.on('error', () => setConnectionStatus('Connection failed'));
    client.on('reconnect', () => setConnectionStatus('Reconnecting'));

    return () => { client.end(); };
  }, []);

  return (
    <div>
      <h3>EMQX Receiver (React)</h3>
      <p>Status: {connectionStatus}</p>
      <p>Subscribed to: testtopic/react</p>
      <h4>Received Messages:</h4>
      <ul>
        {messages.map((msg, index) => <li key={index}>{msg}</li>)}
      </ul>
    </div>
  );
};

export default MqttReceiver;