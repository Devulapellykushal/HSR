'use client';

import { useState, useEffect } from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import {
  FiCheckCircle,
  FiDownload,
  FiLayers,
  FiMail,
  FiPhone,
  FiUsers,
} from 'react-icons/fi';
import { HiOutlineUserAdd } from 'react-icons/hi';
import { TbTargetArrow } from 'react-icons/tb';
import { leadsService, Lead, LeadStatistics } from '@/services/leadsService';
import { buildWhatsAppLink } from '@/lib/contactStore';
import { contactSettingsService } from '@/services/contactSettingsService';
import { usePersistedState } from '@/hooks/usePersistedState';

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const mapSourceDisplay = (source: string): string => {
  const sourceMap: { [key: string]: string } = {
    'contact_form': 'Contact Form',
    'whatsapp': 'WhatsApp',
    'phone_call': 'Phone Call',
    'walk_in': 'Walk In',
  };
  return sourceMap[source] || source;
};

export default function LeadsManagement() {
  const [statusFilter, setStatusFilter] = usePersistedState('admin_leads_statusFilter', 'all');
  const [selectedLeads, setSelectedLeads] = useState<number[]>([]);
  const [leadsList, setLeadsList] = useState<Lead[]>([]);
  const [statistics, setStatistics] = useState<LeadStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        setLoading(true);
        setError(null);
        const [leadsData, statsData] = await Promise.all([
          leadsService.getLeads({ page_size: 100 }),
          leadsService.getStatistics(),
        ]);
        setLeadsList(leadsData.results);
        setStatistics(statsData);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load leads');
        console.error('Leads error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, []);

  const refreshLeads = async () => {
    try {
      setLoading(true);
      const [leadsData, statsData] = await Promise.all([
        leadsService.getLeads({ page_size: 100 }),
        leadsService.getStatistics(),
      ]);
      setLeadsList(leadsData.results);
      setStatistics(statsData);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to refresh leads');
      console.error('Leads refresh error:', err);
    } finally {
      setLoading(false);
    }
  };

  const summaryCards = statistics ? [
    {
      title: 'Total Leads',
      value: statistics.total_leads.toString(),
      accent: '#2E936B',
      description: 'All captured inquiries',
      icon: FiUsers,
    },
    {
      title: 'New Leads',
      value: statistics.new_leads.toString(),
      accent: '#0EA5E9',
      description: 'Awaiting first contact',
      icon: HiOutlineUserAdd,
    },
    {
      title: 'Contacted',
      value: statistics.contacted_leads.toString(),
      accent: '#10B981',
      description: 'Responded to',
      icon: FiCheckCircle,
    },
    {
      title: 'Qualified',
      value: statistics.qualified_leads.toString(),
      accent: '#8B5CF6',
      description: 'Ready to close',
      icon: TbTargetArrow,
    },
  ] : [];

  const handleStatusChange = async (leadId: number, newStatus: string) => {
    try {
      await leadsService.updateLeadStatus(leadId, newStatus.toLowerCase() as 'new' | 'contacted' | 'qualified' | 'closed');
      // Refresh leads and statistics
      await refreshLeads();
    } catch (err: any) {
      console.error('Failed to update lead status:', err);
      alert(err.response?.data?.message || 'Failed to update lead status');
    }
  };

  const statusColors: { [key: string]: string } = {
    new: '#007bff',
    contacted: '#2E936B',
    qualified: '#6c757d',
    closed: '#dc3545',
  };

  const statusDisplayMap: { [key: string]: string } = {
    new: 'New',
    contacted: 'Contacted',
    qualified: 'Qualified',
    closed: 'Closed',
  };

  const filters = ['All', 'New', 'Contacted', 'Qualified', 'Closed'];

  // Filter leads based on selected status
  const filteredLeads = statusFilter === 'all'
    ? leadsList
    : leadsList.filter(lead => lead.status.toLowerCase() === statusFilter.toLowerCase());

  const toggleLeadSelection = (leadId: number) => {
    setSelectedLeads(prev =>
      prev.includes(leadId)
        ? prev.filter(id => id !== leadId)
        : [...prev, leadId]
    );
  };

  const areAllFilteredSelected =
    filteredLeads.length > 0 &&
    filteredLeads.every(lead => selectedLeads.includes(lead.id));

  const handleSelectAll = (checked: boolean) => {
    if (!checked) {
      // remove filtered leads from selection
      setSelectedLeads(prev =>
        prev.filter(id => !filteredLeads.some(lead => lead.id === id))
      );
      return;
    }

    // add filtered leads to selection while preserving existing
    setSelectedLeads(prev => {
      const filteredIds = filteredLeads.map(lead => lead.id);
      const merged = new Set([...prev, ...filteredIds]);
      return Array.from(merged);
    });
  };

  const handleExportCSV = async () => {
    try {
      const blob = await leadsService.exportLeads(
        statusFilter !== 'all' ? { status: statusFilter } : undefined
      );
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `leads_export_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err: any) {
      console.error('Failed to export leads:', err);
      alert(err.response?.data?.message || 'Failed to export leads');
    }
  };

  const handleBulkAction = async (action: 'delete' | 'change_status', status?: string) => {
    if (selectedLeads.length === 0) {
      alert('Please select at least one lead');
      return;
    }

    if (action === 'delete' && !confirm(`Are you sure you want to delete ${selectedLeads.length} lead(s)?`)) {
      return;
    }

    try {
      await leadsService.bulkAction(
        selectedLeads,
        action,
        status ? status.toLowerCase() as 'new' | 'contacted' | 'qualified' | 'closed' : undefined
      );
      setSelectedLeads([]);
      await refreshLeads();
      alert(`Successfully ${action === 'delete' ? 'deleted' : 'updated'} ${selectedLeads.length} lead(s)`);
    } catch (err: any) {
      console.error('Failed to perform bulk action:', err);
      alert(err.response?.data?.message || 'Failed to perform bulk action');
    }
  };

  const handleWhatsApp = async (phone: string) => {
    try {
      // Lazy load contact settings only when WhatsApp button is clicked
      const contactSettings = await contactSettingsService.getContactSettings();
      if (contactSettings.whatsapp_enabled && contactSettings.whatsapp_number) {
        const whatsappLink = buildWhatsAppLink(contactSettings.whatsapp_number);
        if (whatsappLink) {
          window.open(whatsappLink, '_blank', 'noopener,noreferrer');
        }
      } else {
        alert('WhatsApp is not configured');
      }
    } catch (err) {
      console.error('Failed to load contact settings:', err);
      alert('Failed to load WhatsApp settings');
    }
  };

  const handleCall = (phone: string) => {
    window.open(`tel:${phone}`, '_self');
  };

  const handleEmail = (email: string) => {
    window.open(`mailto:${email}`, '_self');
  };

  if (loading && leadsList.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2E936B] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading leads...</p>
        </div>
      </div>
    );
  }

  if (error && leadsList.length === 0) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">{error}</p>
        <button
          onClick={refreshLeads}
          className="mt-2 text-red-600 hover:text-red-800 underline text-sm"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div className="flex-1">
          <h2 className="text-3xl font-bold mb-2" style={{ color: '#343A40' }}>Leads Management</h2>
          <p className="text-base" style={{ color: '#6c757d' }}>Track and manage customer inquiries</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button 
            onClick={handleExportCSV}
            className="w-full sm:w-auto px-4 py-2 bg-white border border-[#2E936B] text-[#2E936B] rounded-lg font-semibold text-sm transition-colors hover:bg-[#E8F5EF] flex items-center justify-center gap-2"
          >
            <FiDownload className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
          {selectedLeads.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <button 
                onClick={() => handleBulkAction('change_status', 'contacted')}
                className="flex-1 sm:flex-none px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold text-sm transition-colors hover:bg-blue-600"
              >
                Mark Contacted ({selectedLeads.length})
              </button>
              <button 
                onClick={() => handleBulkAction('delete')}
                className="flex-1 sm:flex-none px-4 py-2 bg-red-500 text-white rounded-lg font-semibold text-sm transition-colors hover:bg-red-600"
              >
                Delete ({selectedLeads.length})
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {summaryCards.length > 0 ? summaryCards.map((card) => (
          <div
            key={card.title}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col gap-2"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg"
                style={{ backgroundColor: card.accent }}
              >
                <card.icon className="w-6 h-6" />
              </div>
              <p className="text-3xl font-bold" style={{ color: '#1F2937' }}>
                {card.value}
              </p>
            </div>
            <div>
              <p className="text-base font-semibold" style={{ color: '#343A40' }}>
                {card.title}
              </p>
              <p className="text-sm" style={{ color: '#6c757d' }}>
                {card.description}
              </p>
            </div>
          </div>
        )) : (
          <div className="col-span-4 text-center py-8 text-gray-500">
            Loading statistics...
          </div>
        )}
      </div>

      {/* Filter Section */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium" style={{ color: '#343A40' }}>Filter by status:</span>
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => {
              const filterId = filter.toLowerCase();
              const isActive = statusFilter === filterId;
              return (
                <button
                  key={filter}
                  onClick={() => setStatusFilter(filterId)}
                  className={`px-4 py-2 rounded-full font-medium text-sm transition-colors ${
                    isActive
                      ? 'bg-[#2E936B] text-white shadow-sm'
                      : 'bg-white border border-[#ced4da] text-[#343A40] hover:bg-gray-50'
                  }`}
                >
                  {filter}
                </button>
              );
            })}
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm font-medium cursor-pointer select-none" style={{ color: '#343A40' }}>
          <input
            type="checkbox"
            className="w-4 h-4 rounded border-gray-300 text-[#2E936B] focus:ring-[#2E936B]"
            checked={areAllFilteredSelected}
            onChange={(e) => handleSelectAll(e.target.checked)}
            disabled={filteredLeads.length === 0}
          />
          <span>Select All</span>
        </label>
      </div>

      {/* Leads Table - Responsive Design */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#6c757d' }}>
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-[#2E936B] focus:ring-[#2E936B]"
                  checked={areAllFilteredSelected}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  disabled={filteredLeads.length === 0}
                />
              </th>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#6c757d' }}>
                CONTACT
              </th>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#6c757d' }}>
                PROJECT
              </th>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#6c757d' }}>
                MESSAGE
              </th>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#6c757d' }}>
                STATUS
              </th>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#6c757d' }}>
                DATE
              </th>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#6c757d' }}>
                ACTIONS
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredLeads.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                  No leads found with the selected filter.
                </td>
              </tr>
            ) : (
              filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50">
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300 text-[#2E936B] focus:ring-[#2E936B]"
                      checked={selectedLeads.includes(lead.id)}
                      onChange={() => toggleLeadSelection(lead.id)}
                    />
                  </td>
                  <td className="px-4 lg:px-6 py-4">
                    <div>
                      <p className="text-sm font-semibold truncate max-w-[150px]" style={{ color: '#1F2937' }}>
                        {lead.name}
                      </p>
                      <p className="text-sm truncate max-w-[150px]" style={{ color: '#6c757d' }}>
                        {lead.phone}
                      </p>
                      <p className="text-sm truncate max-w-[150px]" style={{ color: '#6c757d' }}>
                        {lead.email}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 lg:px-6 py-4">
                    <div>
                      <p className="text-sm font-medium truncate max-w-[150px]" style={{ color: '#1F2937' }}>
                        {lead.project_name || 'No project'}
                      </p>
                      <p className="text-xs uppercase tracking-wide" style={{ color: '#6c757d' }}>
                        {lead.source_display || mapSourceDisplay(lead.source)}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 lg:px-6 py-4 max-w-xs">
                    <p className="text-sm leading-relaxed line-clamp-2" style={{ color: '#1F2937' }}>
                      {lead.message}
                    </p>
                  </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                    <select
                      className="px-2 lg:px-3 py-1 rounded-full text-xs font-medium border-0 focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer"
                      style={{
                        backgroundColor: statusColors[lead.status] || '#6c757d',
                        color: '#FFFFFF',
                      }}
                      value={lead.status}
                      onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="qualified">Qualified</option>
                      <option value="closed">Closed</option>
                    </select>
                  </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm" style={{ color: '#6c757d' }}>
                    {formatDate(lead.created_at)}
                  </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1 lg:gap-2">
                      <button
                        onClick={() => handleWhatsApp(lead.phone)}
                        className="w-8 h-8 lg:w-9 lg:h-9 rounded-full bg-[#E8F5EF] text-[#2E936B] hover:bg-[#D6EFE1] flex items-center justify-center transition-colors"
                        aria-label="Message on WhatsApp"
                      >
                        <FaWhatsapp className="w-3 h-3 lg:w-4 lg:h-4" />
                      </button>
                      <button
                        onClick={() => handleCall(lead.phone)}
                        className="w-8 h-8 lg:w-9 lg:h-9 rounded-full bg-[#EFF6FF] text-[#2563EB] hover:bg-[#DFEAFF] flex items-center justify-center transition-colors"
                        aria-label="Call lead"
                      >
                        <FiPhone className="w-3 h-3 lg:w-4 lg:h-4" />
                      </button>
                      <button
                        onClick={() => handleEmail(lead.email)}
                        className="w-8 h-8 lg:w-9 lg:h-9 rounded-full bg-[#F5F3FF] text-[#7C3AED] hover:bg-[#EBE6FF] flex items-center justify-center transition-colors"
                        aria-label="Send email"
                      >
                        <FiMail className="w-3 h-3 lg:w-4 lg:h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
            </tbody>
          </table>
        </div>

        {/* Mobile/Tablet Card View */}
        <div className="lg:hidden divide-y divide-gray-200">
          {filteredLeads.length === 0 ? (
            <div className="px-4 py-8 text-center text-gray-500">
              No leads found with the selected filter.
            </div>
          ) : (
            filteredLeads.map((lead) => (
              <div key={lead.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-start gap-3 mb-3">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300 text-[#2E936B] focus:ring-[#2E936B] mt-1 flex-shrink-0"
                    checked={selectedLeads.includes(lead.id)}
                    onChange={() => toggleLeadSelection(lead.id)}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate" style={{ color: '#1F2937' }}>
                          {lead.name}
                        </p>
                        <p className="text-xs truncate" style={{ color: '#6c757d' }}>
                          {lead.phone}
                        </p>
                        <p className="text-xs truncate" style={{ color: '#6c757d' }}>
                          {lead.email}
                        </p>
                      </div>
                      <span className="text-xs whitespace-nowrap flex-shrink-0" style={{ color: '#adb5bd' }}>
                        {formatDate(lead.created_at)}
                      </span>
                    </div>
                    <div className="mb-2">
                      <p className="text-sm font-medium truncate" style={{ color: '#1F2937' }}>
                        {lead.project_name || 'No project'}
                      </p>
                      <p className="text-xs uppercase tracking-wide" style={{ color: '#6c757d' }}>
                        {lead.source_display || mapSourceDisplay(lead.source)}
                      </p>
                    </div>
                    <p className="text-sm leading-relaxed line-clamp-2 mb-3" style={{ color: '#1F2937' }}>
                      {lead.message}
                    </p>
                    <div className="flex items-center justify-between gap-2">
                      <select
                        className="px-2 py-1 rounded-full text-xs font-medium border-0 focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer flex-1"
                        style={{
                          backgroundColor: statusColors[lead.status] || '#6c757d',
                          color: '#FFFFFF',
                        }}
                        value={lead.status}
                        onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="qualified">Qualified</option>
                        <option value="closed">Closed</option>
                      </select>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleWhatsApp(lead.phone)}
                          className="w-8 h-8 rounded-full bg-[#E8F5EF] text-[#2E936B] hover:bg-[#D6EFE1] flex items-center justify-center transition-colors"
                          aria-label="Message on WhatsApp"
                        >
                          <FaWhatsapp className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleCall(lead.phone)}
                          className="w-8 h-8 rounded-full bg-[#EFF6FF] text-[#2563EB] hover:bg-[#DFEAFF] flex items-center justify-center transition-colors"
                          aria-label="Call lead"
                        >
                          <FiPhone className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEmail(lead.email)}
                          className="w-8 h-8 rounded-full bg-[#F5F3FF] text-[#7C3AED] hover:bg-[#EBE6FF] flex items-center justify-center transition-colors"
                          aria-label="Send email"
                        >
                          <FiMail className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

