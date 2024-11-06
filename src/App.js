import React, { useState } from 'react';
import jokeBotImage from './joke-bot.jpg'; 

const App = () => {
  const [joke, setJoke] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speak = (text) => {

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);

    utterance.rate = 0.8; 
    utterance.pitch = 1;
    
   
    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(voice => voice.lang.startsWith('en-'));
    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => {
      setIsSpeaking(false);
      setError('Failed to speak the joke. Please try again.');
    };

    window.speechSynthesis.speak(utterance);
  };

  const tellJoke = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('https://official-joke-api.appspot.com/jokes/programming/random');
      const data = await response.json();
      const fullJoke = `${data[0].setup}... ${data[0].punchline}`;
      setJoke(fullJoke);
      speak(fullJoke);
    } catch (error) {
      setError('Failed to fetch a joke. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
        <div className="mb-6">
          <img
            src={jokeBotImage}
            alt="Joke Bot"
            className="w-32 h-32 mx-auto rounded-full shadow-md"
          />
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-center space-x-2">
            <button
              onClick={tellJoke}
              disabled={loading || isSpeaking}
              className={`px-4 py-2 rounded-lg font-medium ${
                loading || isSpeaking
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              {loading ? 'Loading...' : 'Tell me a joke!'}
            </button>
            
            {isSpeaking && (
              <button
                onClick={stopSpeaking}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium"
              >
                Stop Speaking
              </button>
            )}
          </div>

          {joke && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-800 text-center">{joke}</p>
            </div>
          )}
          
          {error && (
            <div className="mt-4 p-4 bg-red-50 rounded-lg">
              <p className="text-red-600 text-center">{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;

