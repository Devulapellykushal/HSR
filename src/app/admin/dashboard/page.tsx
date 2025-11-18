'use client';

import { getUser } from '@/lib/auth';
import { dashboardService } from '@/services/dashboardService';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  FiBarChart2,
  FiBriefcase,
  FiCheckCircle,
  FiClock,
  FiHome,
  FiMessageCircle,
  FiPlusCircle,
  FiUsers,
} from 'react-icons/fi';
const formatTimeAgo = (date: string) => {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  return past.toLocaleDateString();
};

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const data = await dashboardService.getDashboardOverview();
        setDashboardData(data);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load dashboard data');
        console.error('Dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getStatusColor = (status: string | boolean | null | undefined) => {
    if (status === null || status === undefined) {
      return '#6c757d';
    }
    
    // Handle boolean values
    if (typeof status === 'boolean') {
      return status ? '#2E936B' : '#DC3545';
    }
    
    // Handle string values
    if (typeof status === 'string') {
      switch (status.toLowerCase()) {
        case 'online':
        case 'active':
        case 'working':
          return '#2E936B';
        case 'offline':
        case 'inactive':
        case 'not_working':
          return '#DC3545';
        default:
          return '#6c757d';
      }
    }
    
    return '#6c757d';
  };

  const summaryCards = dashboardData
    ? [
    {
      title: 'Total Projects',
          value: dashboardData.statistics.total_projects.toString(),
      icon: FiBriefcase,
      iconColor: '#007bff',
      bgColor: '#e7f3ff',
    },
    {
      title: 'Ongoing Projects',
          value: dashboardData.statistics.ongoing_projects.toString(),
      icon: FiClock,
      iconColor: '#fd7e14',
      bgColor: '#fff3e0',
    },
    {
      title: 'Completed Projects',
          value: dashboardData.statistics.completed_projects.toString(),
      icon: FiCheckCircle,
      iconColor: '#2E936B',
      bgColor: '#e6ffed',
    },
    {
      title: 'Total Leads',
          value: dashboardData.statistics.total_leads.toString(),
      icon: FiUsers,
      iconColor: '#6f42c1',
      bgColor: '#f3e6ff',
    },
      ]
    : [];

  const quickActions = [
    {
      title: 'Add New Project',
      icon: FiPlusCircle,
      iconColor: '#2E936B',
      bgColor: '#e6ffed',
      onClick: () => router.push('/admin/projects/new'),
    },
    {
      title: 'Manage Testimonials',
      icon: FiMessageCircle,
      iconColor: '#007bff',
      bgColor: '#e7f3ff',
      onClick: () => router.push('/admin/testimonials'),
    },
    {
      title: 'Statistics',
      icon: FiBarChart2,
      iconColor: '#6f42c1',
      bgColor: '#f3e6ff',
      onClick: () => router.push('/admin/dashboard/statistics'),
    },
    {
      title: 'Edit Home Page',
      icon: FiHome,
      iconColor: '#fd7e14',
      bgColor: '#fff3e0',
      onClick: () => router.push('/admin/home'),
    },
  ];

  const user = getUser();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2E936B] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
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
    <div className="max-w-full overflow-x-hidden">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div className="flex-1">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: '#343a40' }}>Dashboard</h2>
          <p className="text-sm sm:text-base" style={{ color: '#6c757d' }}>
            Welcome back{user?.full_name ? `, ${user.full_name}` : ''} to HSR Green Homes Admin Panel
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {summaryCards.map((card, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-4">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: card.bgColor }}
              >
                <card.icon className="w-6 h-6" style={{ color: card.iconColor }} />
              </div>
            </div>
            <h3 className="text-sm font-medium mb-1" style={{ color: '#6c757d' }}>
              {card.title}
            </h3>
            <p className="text-3xl font-bold" style={{ color: '#343a40' }}>
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* Quick Actions Section */}
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-4" style={{ color: '#343a40' }}>
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow"
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: action.bgColor }}
              >
                <action.icon className="w-6 h-6" style={{ color: action.iconColor }} />
              </div>
              <h3 className="font-semibold text-sm" style={{ color: '#343a40' }}>
                {action.title}
              </h3>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 gap-6">
        {/* Recent Leads */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-bold mb-4" style={{ color: '#343a40' }}>
            Recent Leads
          </h3>
          <div className="space-y-4 mb-4">
            {dashboardData?.recent_leads && dashboardData.recent_leads.length > 0 ? (
              dashboardData.recent_leads.map((lead: any) => (
                <div key={lead.id} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm mb-1 truncate" style={{ color: '#343a40' }}>
                      {lead.name}
                    </p>
                    <p className="text-sm truncate" style={{ color: '#6c757d' }}>
                        {lead.project?.title || 'No project'}
                    </p>
                  </div>
                  <span className="text-xs whitespace-nowrap flex-shrink-0" style={{ color: '#adb5bd' }}>
                      {formatTimeAgo(lead.created_at)}
                  </span>
                </div>
              </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No recent leads</p>
            )}
          </div>
          <button
            className="text-sm font-medium hover:underline w-full text-left mt-4"
            style={{ color: '#007bff' }}
            onClick={() => router.push('/admin/leads')}
          >
            View All Leads
          </button>
        </div>

        {/* System Status - Commented out as not needed on UI */}
        {/* <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold mb-4" style={{ color: '#343a40' }}>
            System Status
          </h3>
          <div className="space-y-4">
            {dashboardData?.system_status && (
              <>
            <div className="flex justify-between items-center">
              <span className="text-sm" style={{ color: '#343a40' }}>Website Status</span>
              <div className="flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: getStatusColor(dashboardData.system_status.website_status_display) }}
                    ></span>
                    <span
                      className="text-sm font-medium capitalize"
                      style={{ color: getStatusColor(dashboardData.system_status.website_status_display) }}
                    >
                      {dashboardData.system_status.website_status_display}
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm" style={{ color: '#343a40' }}>
                WhatsApp Integration
              </span>
              <div className="flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: getStatusColor(dashboardData.system_status.whatsapp_status_display) }}
                    ></span>
                    <span
                      className="text-sm font-medium capitalize"
                      style={{ color: getStatusColor(dashboardData.system_status.whatsapp_status_display) }}
                    >
                      {dashboardData.system_status.whatsapp_status_display}
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm" style={{ color: '#343a40' }}>Contact Forms</span>
              <div className="flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: getStatusColor(dashboardData.system_status.contact_forms_display) }}
                    ></span>
                    <span
                      className="text-sm font-medium capitalize"
                      style={{ color: getStatusColor(dashboardData.system_status.contact_forms_display) }}
                    >
                      {dashboardData.system_status.contact_forms_display}
                </span>
              </div>
            </div>
                {dashboardData.system_status.last_backup_display && (
            <div className="flex justify-between items-center">
              <span className="text-sm" style={{ color: '#343a40' }}>Last Backup</span>
              <span className="text-sm" style={{ color: '#6c757d' }}>
                      {dashboardData.system_status.last_backup_display}
              </span>
            </div>
                )}
              </>
            )}
          </div>
        </div> */}
      </div>
    </div>
  );
}
