import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Cylinder, CylinderStatus } from '@/types';
import { WARDS } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface AddCylinderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Cylinder>) => void;
  cylinder?: Cylinder;
}

interface FormErrors {
  cylinder_id?: string;
  ward?: string;
  capacity?: string;
  current_level?: string;
}

export default function AddCylinderModal({
  isOpen,
  onClose,
  onSubmit,
  cylinder,
}: AddCylinderModalProps) {
  const [formData, setFormData] = useState({
    cylinder_id: '',
    ward: WARDS[0],
    capacity: '10000',
    current_level: '100',
    notes: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (cylinder) {
      setFormData({
        cylinder_id: cylinder.cylinder_id,
        ward: cylinder.ward,
        capacity: cylinder.capacity.toString(),
        current_level: cylinder.current_level.toString(),
        notes: cylinder.notes || '',
      });
    } else {
      const nextId = Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, '0');
      setFormData({
        cylinder_id: `CYL-${nextId}`,
        ward: WARDS[0],
        capacity: '10000',
        current_level: '100',
        notes: '',
      });
    }
    setErrors({});
  }, [isOpen, cylinder]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.cylinder_id.trim()) {
      newErrors.cylinder_id = 'Cylinder ID is required';
    }

    if (!formData.ward) {
      newErrors.ward = 'Ward is required';
    }

    const capacity = parseFloat(formData.capacity);
    if (!formData.capacity || isNaN(capacity) || capacity <= 0) {
      newErrors.capacity = 'Capacity must be a positive number';
    }

    const currentLevel = parseFloat(formData.current_level);
    if (!formData.current_level || isNaN(currentLevel) || currentLevel < 0 || currentLevel > 100) {
      newErrors.current_level = 'Current level must be between 0 and 100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 500));

    const submitData: Partial<Cylinder> = {
      cylinder_id: formData.cylinder_id,
      ward: formData.ward,
      capacity: parseFloat(formData.capacity),
      current_level: parseFloat(formData.current_level),
      notes: formData.notes || null,
    };

    onSubmit(submitData);
    setIsSubmitting(false);
    onClose();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleGenerateId = () => {
    const nextId = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0');
    setFormData((prev) => ({
      ...prev,
      cylinder_id: `CYL-${nextId}`,
    }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 flex items-center justify-center z-50 px-4"
          >
            <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl shadow-2xl">
              <div className="sticky top-0 z-10 flex items-center justify-between bg-slate-800/95 backdrop-blur-sm px-8 py-6 border-b border-slate-700">
                <h2 className="text-2xl font-bold text-white">
                  {cylinder ? 'Edit Cylinder' : 'Add New Cylinder'}
                </h2>
                <button
                  onClick={onClose}
                  className="text-slate-400 hover:text-white transition-colors p-1"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-white mb-3">
                      Cylinder ID
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        name="cylinder_id"
                        value={formData.cylinder_id}
                        onChange={handleChange}
                        placeholder="e.g., CYL-0001"
                        className={cn(
                          'flex-1 bg-slate-700/50 border rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all',
                          errors.cylinder_id
                            ? 'border-red-500 focus:border-red-500'
                            : 'border-slate-600 focus:border-emerald-500'
                        )}
                      />
                      {!cylinder && (
                        <button
                          type="button"
                          onClick={handleGenerateId}
                          className="px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors whitespace-nowrap"
                        >
                          Generate
                        </button>
                      )}
                    </div>
                    {errors.cylinder_id && (
                      <p className="text-red-400 text-sm mt-2">{errors.cylinder_id}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-white mb-3">
                      Ward
                    </label>
                    <select
                      name="ward"
                      value={formData.ward}
                      onChange={handleChange}
                      className={cn(
                        'w-full bg-slate-700/50 border rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all',
                        errors.ward
                          ? 'border-red-500 focus:border-red-500'
                          : 'border-slate-600 focus:border-emerald-500'
                      )}
                    >
                      {WARDS.map((ward) => (
                        <option key={ward} value={ward}>
                          {ward}
                        </option>
                      ))}
                    </select>
                    {errors.ward && (
                      <p className="text-red-400 text-sm mt-2">{errors.ward}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-white mb-3">
                      Capacity (Liters)
                    </label>
                    <input
                      type="number"
                      name="capacity"
                      value={formData.capacity}
                      onChange={handleChange}
                      placeholder="e.g., 10000"
                      min="1"
                      step="100"
                      className={cn(
                        'w-full bg-slate-700/50 border rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all',
                        errors.capacity
                          ? 'border-red-500 focus:border-red-500'
                          : 'border-slate-600 focus:border-emerald-500'
                      )}
                    />
                    {errors.capacity && (
                      <p className="text-red-400 text-sm mt-2">{errors.capacity}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-white mb-3">
                      Current Level (%)
                    </label>
                    <input
                      type="number"
                      name="current_level"
                      value={formData.current_level}
                      onChange={handleChange}
                      placeholder="e.g., 100"
                      min="0"
                      max="100"
                      step="1"
                      className={cn(
                        'w-full bg-slate-700/50 border rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all',
                        errors.current_level
                          ? 'border-red-500 focus:border-red-500'
                          : 'border-slate-600 focus:border-emerald-500'
                      )}
                    />
                    {errors.current_level && (
                      <p className="text-red-400 text-sm mt-2">{errors.current_level}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-3">
                    Notes (Optional)
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Add any additional notes..."
                    rows={3}
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all resize-none"
                  />
                </div>

                <div className="bg-slate-700/30 border border-slate-600 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-slate-400 text-xs">Initial Status</p>
                      <p className="text-white font-semibold mt-1">
                        {parseFloat(formData.current_level) >= 70
                          ? 'Full'
                          : parseFloat(formData.current_level) >= 40
                          ? 'Medium'
                          : parseFloat(formData.current_level) >= 20
                          ? 'Low'
                          : parseFloat(formData.current_level) >= 10
                          ? 'Critical'
                          : 'Emergency'}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-xs">Usable Capacity</p>
                      <p className="text-white font-semibold mt-1">
                        {(
                          (parseFloat(formData.capacity) *
                            parseFloat(formData.current_level)) /
                          100
                        ).toLocaleString('en-US', {
                          maximumFractionDigits: 0,
                        })}{' '}
                        L
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-6 border-t border-slate-700">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={onClose}
                    disabled={isSubmitting}
                    className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-emerald-500/50"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        {cylinder ? 'Updating...' : 'Creating...'}
                      </div>
                    ) : (
                      <>{cylinder ? 'Update Cylinder' : 'Add Cylinder'}</>
                    )}
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
