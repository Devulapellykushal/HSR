'use client';

import { useState, useEffect } from 'react';
import { FiEdit2, FiPlus, FiTrash2, FiX } from 'react-icons/fi';
import { testimonialsService, Testimonial } from '@/services/testimonialsService';
import { useProjectsAPI } from '@/hooks/useProjectsAPI';
import ImagePicker from '@/components/admin/ImagePicker';

export default function TestimonialsManagement() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { projects, loading: projectsLoading } = useProjectsAPI();
  
  const [formData, setFormData] = useState({
    customer_name: '',
    project_id: 0,
    quote: '',
    customer_photo: '',
    is_active: true,
    display_order: 0,
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const data = await testimonialsService.getAllTestimonials();
      setTestimonials(data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load testimonials');
      console.error('Testimonials error:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      customer_name: '',
      project_id: 0,
      quote: '',
      customer_photo: '',
      is_active: true,
      display_order: 0,
    });
    setEditingTestimonial(null);
  };


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formData.customer_name || !formData.quote || !formData.project_id) {
      alert('Please fill in all required fields.');
      return;
    }

    // Prevent duplicate submissions
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingTestimonial) {
        // Use PATCH for partial updates (more efficient than PUT)
        await testimonialsService.patchTestimonial(editingTestimonial.id, formData);
      } else {
        await testimonialsService.createTestimonial(formData);
      }
      await fetchTestimonials();
      setShowAddForm(false);
      resetForm();
    } catch (err: any) {
      console.error('Save error:', err);
      
      // User-friendly error messages
      let errorMessage = 'Failed to save testimonial. Please try again.';
      if (err.response?.status === 401 || err.response?.status === 403) {
        errorMessage = 'Your session has expired. Please log in again.';
      } else if (err.response?.status === 400) {
        errorMessage = err.response?.data?.message || 'Please check all fields and try again.';
      } else if (err.response?.status === 404) {
        errorMessage = 'Testimonial not found. It may have been deleted.';
      } else if (err.response?.status === 500) {
        errorMessage = 'Server error occurred. Please try again later.';
      } else if (err.response?.data?.errors) {
        const errors = err.response.data.errors;
        const fieldErrors = Object.entries(errors)
          .map(([field, messages]: [string, any]) => {
            const fieldLabel = field.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
            const messageList = Array.isArray(messages) ? messages : [messages];
            return `${fieldLabel}: ${messageList.join(', ')}`;
          })
          .join('\n');
        errorMessage = fieldErrors || errorMessage;
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setFormData({
      customer_name: testimonial.customer_name,
      project_id: testimonial.project_id,
      quote: testimonial.quote,
      customer_photo: testimonial.customer_photo || '',
      is_active: testimonial.is_active,
      display_order: testimonial.display_order,
    });
    setShowAddForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this testimonial?')) return;
    try {
      await testimonialsService.deleteTestimonial(id);
      await fetchTestimonials();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete testimonial');
      console.error('Delete error:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2E936B] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading testimonials...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: '#343A40' }}>Testimonials Management</h2>
          <p className="text-sm sm:text-base" style={{ color: '#6c757d' }}>Manage customer testimonials and reviews</p>
        </div>
        <button 
          onClick={() => {
            resetForm();
            setShowAddForm(!showAddForm);
          }}
          className="w-full sm:w-auto px-4 py-2 bg-[#2E936B] text-white rounded-lg font-semibold text-sm transition-colors hover:bg-[#247556] flex items-center justify-center gap-2"
        >
          <FiPlus className="w-5 h-5" />
          <span>Add Testimonial</span>
        </button>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Add New Testimonial Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 sm:p-6 mb-6 relative">
          <button
            onClick={() => {
              setShowAddForm(false);
              resetForm();
            }}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors z-10"
          >
            <FiX className="w-5 h-5" style={{ color: '#6c757d' }} />
          </button>
          
          <h3 className="text-xl font-bold mb-6" style={{ color: '#343A40' }}>
            {editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}
          </h3>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Customer Name */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#343A40' }}>
                Customer Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.customer_name}
                onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                placeholder="Enter customer name"
                className="w-full px-4 py-2 border border-[#ced4da] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E936B] focus:border-transparent"
                style={{ color: '#343A40' }}
                disabled={isSubmitting}
              />
            </div>

            {/* Associated Project */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#343A40' }}>
                Associated Project <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.project_id}
                onChange={(e) => setFormData({ ...formData, project_id: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-[#ced4da] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E936B] focus:border-transparent bg-white"
                style={{ color: '#343A40' }}
                disabled={isSubmitting || projectsLoading}
              >
                <option value="0">Select a project</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Testimonial Quote */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#343A40' }}>
                Testimonial Quote <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                value={formData.quote}
                onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                placeholder="Enter customer testimonial"
                rows={4}
                className="w-full px-4 py-2 border border-[#ced4da] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E936B] focus:border-transparent resize-y"
                style={{ color: '#343A40' }}
                disabled={isSubmitting}
              />
            </div>

            {/* Customer Photo */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#343A40' }}>
                Customer Photo
              </label>
              <ImagePicker
                label=""
                value={formData.customer_photo}
                onChange={(url) => setFormData({ ...formData, customer_photo: url })}
                onClear={() => setFormData({ ...formData, customer_photo: '' })}
                placeholder="Enter photo URL or select from uploaded images"
                showPreview={true}
                previewClassName="w-32 h-32 rounded-full border-2 border-[#2E936B] overflow-hidden"
              />
            </div>

            {/* Display Order */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#343A40' }}>
                Display Order
              </label>
              <input
                type="number"
                value={formData.display_order}
                onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                placeholder="0"
                className="w-full px-4 py-2 border border-[#ced4da] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E936B] focus:border-transparent"
                style={{ color: '#343A40' }}
                disabled={isSubmitting}
              />
            </div>

            {/* Active Status */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="w-4 h-4 rounded border-gray-300 text-[#2E936B] focus:ring-[#2E936B]"
                disabled={isSubmitting}
              />
              <label className="text-sm font-medium" style={{ color: '#343A40' }}>
                Active (visible on website)
              </label>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-6 py-2 bg-[#2E936B] text-white rounded-lg font-semibold text-sm transition-colors hover:bg-[#247556] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Saving...' : editingTestimonial ? 'Update Testimonial' : 'Add Testimonial'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  resetForm();
                }}
                className="w-full sm:w-auto px-6 py-2 bg-white border border-[#ced4da] text-[#343A40] rounded-lg font-semibold text-sm transition-colors hover:bg-gray-50"
                disabled={isSubmitting}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Testimonial Cards */}
      {testimonials.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-500">No testimonials found. Add your first testimonial above.</p>
        </div>
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <img
                  src={
                      testimonial.customer_photo ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.customer_name)}&background=28A745&color=fff`
                  }
                    alt={testimonial.customer_name}
                  className="w-16 h-16 rounded-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3 className="text-lg font-bold mb-1" style={{ color: '#343A40' }}>
                    {testimonial.customer_name}
                </h3>
                <p className="text-sm mb-3" style={{ color: '#2E936B' }}>
                    {testimonial.project_title || 'No project'}
                </p>
                <p className="text-sm italic mb-4" style={{ color: '#343A40' }}>
                    &quot;{testimonial.quote}&quot;
                </p>
                  {!testimonial.is_active && (
                    <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                      Inactive
                    </span>
                  )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleEdit(testimonial)}
                  className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                  aria-label="Edit testimonial"
                >
                  <FiEdit2 className="w-5 h-5" style={{ color: '#343A40' }} />
                </button>
                <button
                  onClick={() => handleDelete(testimonial.id)}
                  className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                  aria-label="Delete testimonial"
                >
                  <FiTrash2 className="w-5 h-5" style={{ color: '#343A40' }} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      )}
    </div>
  );
}
