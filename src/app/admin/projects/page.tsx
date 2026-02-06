'use client';

import { useProjectsAPIAdmin } from '@/hooks/useProjectsAPIAdmin';
import { projectsService } from '@/services/projectsService';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState, useEffect, useRef } from 'react';
import { usePersistedState } from '@/hooks/usePersistedState';
import {
  FiEdit2,
  FiEye,
  FiFileText,
  FiMapPin,
  FiPlus,
  FiStar,
  FiTrash2,
  FiDownload,
  FiCheckSquare,
  FiSquare,
  FiChevronDown,
} from 'react-icons/fi';

export default function ProjectsManagement() {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = usePersistedState('admin_projects_statusFilter', 'all');
  const { projects: rawProjects, loading, invalidateCache } = useProjectsAPIAdmin();
  const [selectedProjects, setSelectedProjects] = useState<Set<number>>(new Set());
  const [bulkActionLoading, setBulkActionLoading] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [showStatusChange, setShowStatusChange] = useState(false);
  const [newStatus, setNewStatus] = useState<'upcoming' | 'ongoing' | 'completed'>('ongoing');
  const bulkActionsRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (bulkActionsRef.current && !bulkActionsRef.current.contains(event.target as Node)) {
        setShowBulkActions(false);
      }
    };

    if (showBulkActions) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showBulkActions]);

  const projects = useMemo(
    () =>
      rawProjects.map((project) => ({
        id: project.id,
        name: project.title,
        location: project.location,
        rera: project.rera_number,
        primaryStatus: project.status === 'ongoing' ? 'Ongoing' : project.status === 'completed' ? 'Completed' : 'Upcoming',
        status: [
          ...(project.is_featured ? ['Featured'] : []),
          project.status === 'ongoing' ? 'Ongoing' : project.status === 'completed' ? 'Completed' : 'Upcoming',
        ],
        image: project.hero_image_url,
        slug: project.slug,
        isDefault: false, // No default projects when using API
        is_featured: project.is_featured,
      })),
    [rawProjects],
  );

  const handleViewProject = (id: number) => {
    router.push(`/admin/projects/${id}`);
  };

  const handleDeleteProject = async (id: number) => {
    if (!confirm('Are you sure you want to delete this project?')) {
      return;
    }
    try {
      await projectsService.deleteProject(id);
      invalidateCache();
      window.location.reload();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to delete project');
      console.error('Delete error:', error);
    }
  };

  const handleSelectProject = (id: number) => {
    const newSelected = new Set(selectedProjects);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedProjects(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedProjects.size === filteredProjects.length) {
      setSelectedProjects(new Set());
    } else {
      setSelectedProjects(new Set(filteredProjects.map(p => p.id)));
    }
  };

  const handleBulkAction = async (action: 'delete' | 'restore' | 'feature' | 'unfeature' | 'change_status') => {
    if (selectedProjects.size === 0) {
      alert('Please select at least one project');
      return;
    }

    if (action === 'change_status' && !showStatusChange) {
      setShowStatusChange(true);
      return;
    }

    let confirmMessage = '';
    switch (action) {
      case 'delete':
        confirmMessage = `Are you sure you want to delete ${selectedProjects.size} project(s)?`;
        break;
      case 'restore':
        confirmMessage = `Are you sure you want to restore ${selectedProjects.size} project(s)?`;
        break;
      case 'feature':
        confirmMessage = `Are you sure you want to feature ${selectedProjects.size} project(s)?`;
        break;
      case 'unfeature':
        confirmMessage = `Are you sure you want to unfeature ${selectedProjects.size} project(s)?`;
        break;
      case 'change_status':
        confirmMessage = `Are you sure you want to change status of ${selectedProjects.size} project(s) to ${newStatus}?`;
        break;
    }

    if (!confirm(confirmMessage)) {
      if (action === 'change_status') {
        setShowStatusChange(false);
      }
      return;
    }

    try {
      setBulkActionLoading(true);
      const projectIds = Array.from(selectedProjects);
      await projectsService.bulkAction({
        project_ids: projectIds,
        action,
        ...(action === 'change_status' ? { status: newStatus } : {}),
      });

      setSelectedProjects(new Set());
      setShowBulkActions(false);
      setShowStatusChange(false);
      invalidateCache();
      window.location.reload();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to perform bulk action');
      console.error('Bulk action error:', error);
    } finally {
      setBulkActionLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      setBulkActionLoading(true);
      const blob = await projectsService.exportProjects();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `projects_export_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to export projects');
      console.error('Export error:', error);
    } finally {
      setBulkActionLoading(false);
    }
  };

  // Filter projects based on selected status
  const filteredProjects = useMemo(() => {
    if (statusFilter === 'all') return projects;
    if (statusFilter === 'featured') return projects.filter(p => p.is_featured);
    return projects.filter(project => project.primaryStatus.toLowerCase() === statusFilter);
  }, [statusFilter, projects]);

  const statusColors: { [key: string]: { bg: string; text: string } } = {
    Featured: { bg: '#FFC107', text: '#000000' },
    Ongoing: { bg: '#FD7E14', text: '#FFFFFF' },
    Completed: { bg: '#2E936B', text: '#FFFFFF' },
  };

  const filters = ['All', 'Ongoing', 'Completed', 'Featured'];

  return (
    <div>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div className="flex-1">
          <h2 className="text-3xl font-bold mb-2" style={{ color: '#343A40' }}>Projects Management</h2>
          <p className="text-base" style={{ color: '#6c757d' }}>Manage all HSR Green Homes projects</p>
        </div>
        <Link
          href="/admin/projects/new"
          className="w-full sm:w-auto px-4 py-2 bg-[#2E936B] text-white rounded-lg font-semibold text-sm transition-colors hover:bg-[#247556] flex items-center justify-center gap-2"
        >
          <FiPlus className="w-5 h-5" />
          <span>Add New Project</span>
        </Link>
      </div>

      {/* Filter Section */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:gap-4 gap-3">
        <span className="text-sm font-medium" style={{ color: '#343A40' }}>Filter by status:</span>
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => {
            const isActive = statusFilter === filter.toLowerCase();
            return (
              <button
                key={filter}
                onClick={() => setStatusFilter(filter.toLowerCase())}
                className={`px-4 py-2 rounded-full font-medium text-sm transition-colors ${isActive
                    ? 'bg-[#2E936B] text-white'
                    : 'bg-white border border-[#ced4da] text-[#343A40] hover:bg-gray-50'
                  }`}
              >
                {filter}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bulk Actions Toolbar */}
      {filteredProjects.length > 0 && (
        <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                <button
                  onClick={handleSelectAll}
                  className="flex items-center gap-2 text-sm font-medium"
                  style={{ color: '#343A40' }}
                >
                  {selectedProjects.size === filteredProjects.length ? (
                    <FiCheckSquare className="w-5 h-5" />
                  ) : (
                    <FiSquare className="w-5 h-5" />
                  )}
                  <span className="whitespace-nowrap">
                    {selectedProjects.size === 0
                      ? 'Select All'
                      : `${selectedProjects.size} of ${filteredProjects.length} selected`}
                  </span>
                </button>

                {selectedProjects.size > 0 && (
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="relative" ref={bulkActionsRef}>
                      <button
                        onClick={() => setShowBulkActions(!showBulkActions)}
                        disabled={bulkActionLoading}
                        className="px-3 sm:px-4 py-2 bg-[#2E936B] text-white rounded-lg font-medium text-sm transition-colors hover:bg-[#247556] flex items-center gap-2 disabled:opacity-50"
                      >
                        Bulk Actions
                        <FiChevronDown className="w-4 h-4" />
                      </button>

                      {showBulkActions && (
                        <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[200px]">
                          <button
                            onClick={() => handleBulkAction('feature')}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                            style={{ color: '#343A40' }}
                          >
                            Mark as Featured
                          </button>
                          <button
                            onClick={() => handleBulkAction('unfeature')}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                            style={{ color: '#343A40' }}
                          >
                            Unmark as Featured
                          </button>
                          <button
                            onClick={() => handleBulkAction('change_status')}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                            style={{ color: '#343A40' }}
                          >
                            Change Status
                          </button>
                          <div className="border-t border-gray-200 my-1"></div>
                          <button
                            onClick={() => handleBulkAction('delete')}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors text-red-600"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => handleBulkAction('restore')}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                            style={{ color: '#343A40' }}
                          >
                            Restore
                          </button>
                        </div>
                      )}
                    </div>

                    {showStatusChange && (
                      <div className="flex flex-wrap items-center gap-2">
                        <select
                          value={newStatus}
                          onChange={(e) => setNewStatus(e.target.value as 'upcoming' | 'ongoing' | 'completed')}
                          className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          style={{ color: '#343A40' }}
                        >
                          <option value="upcoming">Upcoming</option>
                          <option value="ongoing">Ongoing</option>
                          <option value="completed">Completed</option>
                        </select>
                        <button
                          onClick={() => handleBulkAction('change_status')}
                          disabled={bulkActionLoading}
                          className="px-3 sm:px-4 py-2 bg-[#2E936B] text-white rounded-lg font-medium text-sm transition-colors hover:bg-[#247556] disabled:opacity-50"
                        >
                          Apply
                        </button>
                        <button
                          onClick={() => {
                            setShowStatusChange(false);
                            setShowBulkActions(false);
                          }}
                          className="px-3 sm:px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium text-sm transition-colors hover:bg-gray-300"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <button
                onClick={handleExport}
                disabled={bulkActionLoading}
                className="w-full sm:w-auto px-4 py-2 bg-white border border-[#ced4da] text-[#343A40] rounded-lg font-medium text-sm transition-colors hover:bg-gray-50 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <FiDownload className="w-4 h-4" />
                Export to CSV
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Project Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2E936B] mx-auto mb-4"></div>
            <p className="text-gray-500">Loading projects...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500">No projects found with the selected filter.</p>
          </div>
        ) : (
          filteredProjects.map((project) => (
            <div key={project.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 relative">
              {/* Checkbox - positioned at top-right of card, avoiding image badges */}
              <div className="absolute top-2 right-2 z-20">
                <button
                  onClick={() => handleSelectProject(project.id)}
                  className="bg-white rounded-full p-1.5 shadow-lg hover:bg-gray-50 transition-colors border border-gray-200"
                  aria-label={selectedProjects.has(project.id) ? 'Deselect project' : 'Select project'}
                >
                  {selectedProjects.has(project.id) ? (
                    <FiCheckSquare className="w-5 h-5 text-[#2E936B]" />
                  ) : (
                    <FiSquare className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              </div>

              {/* Image with Status Tags */}
              <div className="relative">
                <img
                  src={project.image}
                  alt={project.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 left-2 flex flex-wrap gap-2 z-10">
                  {project.status.filter(s => s === 'Featured').map((status) => (
                    <span
                      key={status}
                      className="px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1"
                      style={{
                        backgroundColor: statusColors[status].bg,
                        color: statusColors[status].text,
                      }}
                    >
                      <FiStar className="w-3 h-3" />
                      {status}
                    </span>
                  ))}
                </div>
                <div className="absolute bottom-2 right-2 z-10">
                  <span
                    className="px-2 py-1 rounded-full text-xs font-semibold"
                    style={{
                      backgroundColor: statusColors[project.primaryStatus]?.bg || statusColors.Completed.bg,
                      color: statusColors[project.primaryStatus]?.text || statusColors.Completed.text,
                    }}
                  >
                    {project.primaryStatus}
                  </span>
                </div>
              </div>

              {/* Project Info */}
              <div className="p-4">
                <h3 className="text-lg font-bold mb-2" style={{ color: '#343A40' }}>
                  {project.name}
                </h3>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm" style={{ color: '#6c757d' }}>
                    <FiMapPin className="w-4 h-4" />
                    <span>{project.location}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/projects/${project.id}/edit`}
                    className="flex-1 px-4 py-2 bg-[#2E936B] text-white rounded-lg font-medium text-sm transition-colors hover:bg-[#247556] flex items-center justify-center gap-2"
                  >
                    <FiEdit2 className="w-4 h-4" />
                    <span>Edit</span>
                  </Link>
                  <button
                    className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                    aria-label="View project details"
                    onClick={() => handleViewProject(project.id)}
                  >
                    <FiEye className="w-5 h-5" style={{ color: '#6c757d' }} />
                  </button>
                  <button
                    className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors disabled:opacity-50"
                    aria-label="Delete project"
                    onClick={() => handleDeleteProject(project.id)}
                    title="Delete project"
                  >
                    <FiTrash2 className="w-5 h-5" style={{ color: project.isDefault ? '#adb5bd' : '#6c757d' }} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

