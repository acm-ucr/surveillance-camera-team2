"use client"
import React, { useState, useEffect } from 'react';
import mqtt from 'mqtt';

const MqttReceiver = () => {
  const [frame, setFrame] = useState<string | null>(null);
  const [frameCount, setFrameCount] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState('Disconnected');

  useEffect(() => {
    setConnectionStatus('Connecting');
    const client = mqtt.connect('wss://broker.emqx.io:8084/mqtt');

    client.on('connect', () => {
      setConnectionStatus('Connected');
      client.subscribe('taito/yolo/#');
    });

    client.on('message', (topic, message) => {
      const raw = message.toString().trim();
      console.log('First 20 chars:', raw.substring(0, 20));
      console.log('Frame size:', raw.length);
      setFrame(`data:image/jpeg;base64,${raw}`);
      setFrameCount(prev => prev + 1);
      // setMessages(prev => [...prev, message.toString()]);
      // console.log('Topic:', topic);
      // console.log('Message:', message.toString());
      // setMessages(prev => [...prev, `[${topic}] ${message.toString()}`]);
    });

    client.on('error', () => setConnectionStatus('Connection failed'));
    client.on('reconnect', () => setConnectionStatus('Reconnecting'));


    return () => { client.end(); };
  }, []);

  return (
    <div className="mqttReceiver">
      <p>Status: <strong>{connectionStatus}</strong> | Frames received: {frameCount}</p>
      {frame ? (
        <img src={frame} alt="Video frame" style={{ maxWidth: '100%' }} />
      ) : (
        <p>No video frames received yet.</p>
      )}
      {/* <h3>EMQX Receiver (React)</h3>
      <p>Subscribed to: taito/yolo/video/demo123</p>
      <h4>Received Messages:</h4> */}
      {/* <ul className = "mqttList">
        {messages.map((msg, index) => <li key={index}>{msg}</li>)}
      </ul> */}
    </div>
  );
};

export default MqttReceiver;