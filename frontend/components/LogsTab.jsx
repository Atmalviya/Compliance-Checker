import { useEffect, useState } from 'react';
import { api } from '../services/api';

export default function LogsTab() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [expandedLogs, setExpandedLogs] = useState(new Set());
  const LIMIT = 10;

  const fetchLogs = async () => {
    try {
      const data = await api.getLogs(LIMIT, page * LIMIT);
      setLogs(prevLogs => page === 0 ? data.logs : [...prevLogs, ...data.logs]);
      setHasMore(data.logs.length === LIMIT);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page]);

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const toggleDetails = (index) => {
    setExpandedLogs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  if (loading && page === 0) return <div>Loading logs...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Compliance Logs</h2>
      <div className="space-y-4">
        {logs.map((log, index) => (
          <div key={index} className="border rounded-lg p-4 bg-white shadow">
            <div 
              className="flex justify-between items-start cursor-pointer"
              onClick={() => toggleDetails(index)}
            >
              <div>
                <span className={`inline-block px-2 py-1 rounded text-sm ${
                  log.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {log.check_type}
                </span>
                <p className="text-gray-600 text-sm mt-1">
                  {formatDate(log.timestamp)}
                </p>
              </div>
              <div className="flex items-center">
                <span className={`px-2 py-1 rounded text-sm mr-2 ${
                  log.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {log.status ? 'Pass' : 'Fail'}
                </span>
                <svg
                  className={`w-5 h-5 transition-transform ${
                    expandedLogs.has(index) ? 'transform rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
            {expandedLogs.has(index) && (
              <div className="mt-4">
                <pre className="text-sm bg-gray-50 p-2 rounded overflow-x-auto">
                  {JSON.stringify(log.details, null, 2)}
                </pre>
              </div>
            )}
          </div>
        ))}
      </div>
      {hasMore && (
        <button
          onClick={() => setPage(p => p + 1)}
          className="w-full mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Load More
        </button>
      )}
    </div>
  );
}
