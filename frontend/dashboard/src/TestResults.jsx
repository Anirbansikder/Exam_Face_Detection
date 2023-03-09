import React, { useState, useEffect } from 'react';
import './TestResults.css';

function TestResults(props) {
  const { code } = props;
  const [results, setResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalLength,setTotalLength] = useState(0);
  const resultsPerPage = 10;

  useEffect(() => {
    // Make API request to get results for test with given code
    fetch(`http://localhost:5000/get-image?code=${code}&pageNum=${currentPage}`)
      .then(response => response.json())
      .then(data => {
        setResults(data.arrayList);
        setTotalLength(data.totalLength)
      })
      .catch(err => {
        console.log(err);
      })
  }, [code,currentPage]);

  // Logic for displaying page numbers
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalLength / resultsPerPage); i++) {
    pageNumbers.push(i);
  }

  // Change page
  const paginate = pageNumber => setCurrentPage(pageNumber);

  return (
    <div className="test-results-container">
      <h1 className="test-results-header">Test Results ({code})</h1>
      <table className="test-results-table">
        <thead>
          <tr>
            <th>Faces Detected</th>
            <th>Objects Detected</th>
            <th>Date Clicked</th>
            <th>Time Clicked</th>
            <th>View Image</th>
          </tr>
        </thead>
        <tbody>
          {results.map((result,index) => (
            <tr key={index} className={result.facesDetected > 1 ? 'red-flag' : ''}>
              <td>{result.facesDetected}</td>
              <td>{result.objects.join(', ')}</td>
              <td>{result.timeStamp.split('T')[0]}</td>
              <td>{result.timeStamp.split('T')[1].split('.')[0]}</td>
              <td>
                <button className="view-image-button" onClick={() => window.open(result.url)}>View Image</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        {pageNumbers.map(number => (
          <button key={number} className={`page-number ${currentPage === number ? 'active' : ''}`} onClick={() => paginate(number)}>{number}</button>
        ))}
      </div>
    </div>
  );
}

export default TestResults;
