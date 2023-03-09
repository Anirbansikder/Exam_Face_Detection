import React, { useState, useEffect } from 'react';
import TestResults from "./TestResults";
import './TestList.css';

function TestList() {
  const [tests, setTests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTest, setSelectedTest] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/get-data', {
      method: 'GET',
      })
      .then(response => response.json())
      .then(data => {
        setTests(data.data)
      })
      .catch(err => console.log(err))
  }, []);

  const filteredTests = tests.filter(test =>
    test.code.toLowerCase().startsWith(searchTerm.toLowerCase())
  );

  const handleSearch = e => {
    setSearchTerm(e.target.value);
  };

  const handleTestSelected = code => {
    setSelectedTest(code);
  };
    
  const handleBack = () => {
    setSelectedTest(null);
  };
    
  return (
    <div className="test-list-container">
      {selectedTest ? (
        <TestResults code={selectedTest} handleBack={handleBack} />
      ) : (
        <>
        <h1 className="test-list-header">Test List</h1>
        <div className="search-bar">
          <label htmlFor="search">Search by Test Code:</label>
          <input
               type="text"
               id="search"
               value={searchTerm}
               onChange={handleSearch}
          />
        </div>
        <table className="test-list-table">
          <thead>
            <tr>
              <th>Test Code</th>
              <th>Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTests.map(test => (
              <tr key={test.code}>
                <td>{test.code}</td>
                <td>{test.name}</td>
                <td>{test.email}</td>
                <td>
                <button className="view-results-button" onClick={() => handleTestSelected(test.code)}>
                View Images
                </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </>
      )}
    </div>
  );
}
    
export default TestList;