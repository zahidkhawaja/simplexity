import React, { useState, useEffect } from 'react';

const ComplexityTuner = () => {
  const [text, setText] = useState('');
  const [complexity, setComplexity] = useState(0);
  const [prevComplexity, setPrevComplexity] = useState(0);
  const [shouldTune, setShouldTune] = useState(false);

  useEffect(() => {
    const tuneText = async () => {
      if (shouldTune && text) {
        const response = await fetch('/api/tuning', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text,
            complexity: complexity > prevComplexity ? 1 : -1
          }),
        });
        const data = await response.json();
        setText(data.result);
        setShouldTune(false);
      }
    };

    tuneText();
  }, [shouldTune, complexity, text, prevComplexity]);

  const handleTextChange = (e) => {
    setText(e.target.value);
    setComplexity(0);
    setPrevComplexity(0);
    setShouldTune(false);
  };

  const handleComplexityChange = (e) => {
    const newComplexity = Number(e.target.value);
    setPrevComplexity(complexity);
    setComplexity(newComplexity);
    setShouldTune(newComplexity !== complexity);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Simplexity
        </h1>
        <div className="bg-white shadow-md rounded-lg p-6">
          <textarea
            className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
            rows="16"
            placeholder="Enter your text here..."
            value={text}
            onChange={handleTextChange}
          />
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Adjust Complexity
            </label>
            <div className="relative pt-1">
              <input
                type="range"
                min="-3"
                max="3"
                step="1"
                value={complexity}
                onChange={handleComplexityChange}
                className="complexity-slider"
              />
              <div className="flex justify-between w-full px-2 mt-1">
                {[-3, -2, -1, 0, 1, 2, 3].map((value) => (
                  <div key={value} className="flex flex-col items-center">
                    <div className="h-2 w-0.5 bg-gray-300"></div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between w-full px-2 mt-1">
                <span className="text-xs text-gray-600">Very Simple</span>
                <span className="text-xs text-gray-600">Very Complex</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplexityTuner;