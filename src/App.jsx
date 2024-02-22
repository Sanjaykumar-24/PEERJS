import React, { useEffect, useRef, useState } from 'react';
import Peer from 'peerjs';
import './App.css';

function App() {
  const [peerId, setPeerId] = useState('');
  const [remotePeerIdValue, setRemotePeerIdValue] = useState('');
  const remoteVideoRef = useRef(null);
  const currentUserVideoRef = useRef(null);
  const peerInstance = useRef(null);

  useEffect(() => {
    const initializePeer = async () => {
      try {
        const peer = new Peer({host:'172.17.1.186', port: 7000 
        ,path:'/peer',token:'sanjaykumar24@gmail.com'});

        peer.on('open', (id) => {
          console.log(id)
          setPeerId(id);
        });

        peer.on('call', (call) => {
          navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then((mediaStream) => {
              currentUserVideoRef.current.srcObject = mediaStream;
              currentUserVideoRef.current.play();

              call.answer(mediaStream);

              call.on('stream', (remoteStream) => {
                remoteVideoRef.current.srcObject = remoteStream;
                remoteVideoRef.current.play();
              });
            })
            .catch((error) => {
              console.error('Error accessing media devices:', error);
            });
        });

        peerInstance.current = peer;
      } catch (error) {
        console.error('Error initializing Peer:', error);
      }
    };

    initializePeer();
  }, []);

  const call = (remotePeerId) => {
    try {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then((mediaStream) => {
          currentUserVideoRef.current.srcObject = mediaStream;
          currentUserVideoRef.current.play();

          const call = peerInstance.current.call(remotePeerId, mediaStream);

          call.on('stream', (remoteStream) => {
            remoteVideoRef.current.srcObject = remoteStream;
            remoteVideoRef.current.play();
          });
        })
        .catch((error) => {
          console.error('Error accessing media devices:', error);
        });
    } catch (error) {
      console.error('Error initiating call:', error);
    }
  };

  return (
    <div className="App">
      <h1>Current user id is {peerId}</h1>
      <input type="text" value={remotePeerIdValue} onChange={(e) => setRemotePeerIdValue(e.target.value)} />
      <button onClick={() => call(remotePeerIdValue)}>Call</button>
      <div>
        <video ref={currentUserVideoRef} autoPlay muted />
      </div>
      <div>
        <video ref={remoteVideoRef} autoPlay />
      </div>
    </div>
  );
}

export default App;
