'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { dashboardService } from '@/services/dashboardService';
import { FiArrowLeft, FiBarChart2 } from 'react-icons/fi';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function StatisticsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true);
        const statsData = await dashboardService.getStatistics();
        setStatistics(statsData);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load statistics');
        console.error('Statistics error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2E936B] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading statistics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 text-red-600 hover:text-red-800 underline text-sm"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Go back"
          >
            <FiArrowLeft className="w-5 h-5" style={{ color: '#343a40' }} />
          </button>
          <div>
            <h2 className="text-3xl font-bold mb-2" style={{ color: '#343a40' }}>
              Statistics
            </h2>
            <p className="text-base" style={{ color: '#6c757d' }}>
              Detailed statistics for projects and leads
            </p>
          </div>
        </div>
      </div>

      {/* Statistics Content */}
      {statistics ? (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-sm font-medium mb-2" style={{ color: '#6c757d' }}>
                Total Projects
              </p>
              <p className="text-3xl font-bold" style={{ color: '#343a40' }}>
                {statistics.total_projects}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-sm font-medium mb-2" style={{ color: '#6c757d' }}>
                Total Leads
              </p>
              <p className="text-3xl font-bold" style={{ color: '#343a40' }}>
                {statistics.total_leads}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-sm font-medium mb-2" style={{ color: '#6c757d' }}>
                Ongoing Projects
              </p>
              <p className="text-3xl font-bold" style={{ color: '#007bff' }}>
                {statistics.ongoing_projects}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-sm font-medium mb-2" style={{ color: '#6c757d' }}>
                New Leads
              </p>
              <p className="text-3xl font-bold" style={{ color: '#007bff' }}>
                {statistics.new_leads}
              </p>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Projects Status Pie Chart */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: '#e7f3ff' }}
                >
                  <FiBarChart2 className="w-6 h-6" style={{ color: '#007bff' }} />
                </div>
                <h3 className="text-xl font-bold" style={{ color: '#343a40' }}>
                  Projects by Status
                </h3>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Upcoming', value: statistics.upcoming_projects, color: '#fd7e14' },
                      { name: 'Ongoing', value: statistics.ongoing_projects, color: '#007bff' },
                      { name: 'Completed', value: statistics.completed_projects, color: '#2E936B' },
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {[
                      { name: 'Upcoming', value: statistics.upcoming_projects, color: '#fd7e14' },
                      { name: 'Ongoing', value: statistics.ongoing_projects, color: '#007bff' },
                      { name: 'Completed', value: statistics.completed_projects, color: '#2E936B' },
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Leads Status Bar Chart */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: '#f3e6ff' }}
                >
                  <FiBarChart2 className="w-6 h-6" style={{ color: '#6f42c1' }} />
                </div>
                <h3 className="text-xl font-bold" style={{ color: '#343a40' }}>
                  Leads by Status
                </h3>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={[
                    { name: 'New', value: statistics.new_leads },
                    { name: 'Contacted', value: statistics.contacted_leads },
                    { name: 'Qualified', value: statistics.qualified_leads },
                    { name: 'Closed', value: statistics.closed_leads },
                  ]}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#6f42c1" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Detailed Statistics Table */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold mb-4" style={{ color: '#343a40' }}>
              Detailed Breakdown
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Projects Breakdown */}
              <div>
                <h4 className="text-lg font-semibold mb-3" style={{ color: '#6c757d' }}>
                  Projects
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 bg-orange-50 rounded">
                    <span className="text-sm font-medium">Upcoming</span>
                    <span className="text-lg font-bold" style={{ color: '#fd7e14' }}>
                      {statistics.upcoming_projects}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                    <span className="text-sm font-medium">Ongoing</span>
                    <span className="text-lg font-bold" style={{ color: '#007bff' }}>
                      {statistics.ongoing_projects}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                    <span className="text-sm font-medium">Completed</span>
                    <span className="text-lg font-bold" style={{ color: '#2E936B' }}>
                      {statistics.completed_projects}
                    </span>
                  </div>
                </div>
              </div>

              {/* Leads Breakdown */}
              <div>
                <h4 className="text-lg font-semibold mb-3" style={{ color: '#6c757d' }}>
                  Leads
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                    <span className="text-sm font-medium">New</span>
                    <span className="text-lg font-bold" style={{ color: '#007bff' }}>
                      {statistics.new_leads}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-yellow-50 rounded">
                    <span className="text-sm font-medium">Contacted</span>
                    <span className="text-lg font-bold" style={{ color: '#ffc107' }}>
                      {statistics.contacted_leads}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-purple-50 rounded">
                    <span className="text-sm font-medium">Qualified</span>
                    <span className="text-lg font-bold" style={{ color: '#6f42c1' }}>
                      {statistics.qualified_leads}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                    <span className="text-sm font-medium">Closed</span>
                    <span className="text-lg font-bold" style={{ color: '#2E936B' }}>
                      {statistics.closed_leads}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-500 text-center">No statistics available</p>
        </div>
      )}
    </div>
  );
}

