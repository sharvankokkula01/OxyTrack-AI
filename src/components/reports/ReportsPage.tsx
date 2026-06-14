'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Download,
  Trash2,
  Plus,
  Calendar,
  BarChart3,
  TrendingUp,
  AlertCircle,
  Package,
  Filter,
  Loader,
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import KPICard from '@/components/common/KPICard';
import { cn } from '@/lib/utils';
import { formatDate, formatDateTime } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import { useSimulation } from '@/contexts/SimulationContext';

interface Report {
  id: string;
  title: string;
  type: 'usage' | 'alert' | 'refill' | 'inventory';
  dateRangeStart: string;
  dateRangeEnd: string;
  createdAt: string;
  format: 'PDF' | 'CSV';
}

interface GeneratedReport {
  id: string;
  title: string;
  type: string;
  dateRange: string;
  createdAt: string;
  format: string;
  size: string;
}

const generatePDFReport = (
  title: string,
  reportType: string,
  startDate: string,
  endDate: string,
  data: any[]
) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;

  // Title
  doc.setFontSize(20);
  doc.setTextColor(0, 100, 200);
  doc.text(title, margin, 20);

  // Metadata
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Report Type: ${reportType}`, margin, 30);
  doc.text(`Period: ${startDate} to ${endDate}`, margin, 36);
  doc.text(`Generated: ${new Date().toLocaleString()}`, margin, 42);

  // Summary section
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text('Summary Statistics', margin, 55);

  const summary = [
    { label: 'Total Records', value: data.length },
    { label: 'Date Range', value: `${startDate} to ${endDate}` },
    { label: 'Report Generated', value: new Date().toLocaleDateString() },
  ];

  let yPosition = 62;
  summary.forEach((item) => {
    doc.setFontSize(10);
    doc.text(`${item.label}: ${item.value}`, margin + 5, yPosition);
    yPosition += 6;
  });

  // Data table
  if (data.length > 0) {
    yPosition += 5;
    const headers = Object.keys(data[0]);
    const rows = data.map((item) => headers.map((header) => String(item[header] || '-')));

    autoTable(doc, {
      startY: yPosition,
      head: [headers],
      body: rows,
      margin: { left: margin, right: margin },
      styles: { fontSize: 9 },
      headStyles: { fillColor: [0, 100, 200], textColor: 255 },
    });
  }

  return doc;
};

const generateCSVReport = (data: any[]): string => {
  if (data.length === 0) return '';

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map((row) =>
      headers.map((header) => {
        const value = row[header];
        const stringValue = String(value || '');
        return stringValue.includes(',') ? `"${stringValue}"` : stringValue;
      }).join(',')
    ),
  ].join('\n');

  return csvContent;
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' as const },
  },
};

export default function ReportsPage() {
  const { cylinders } = useSimulation();
  const [reports, setReports] = useState<GeneratedReport[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [formData, setFormData] = useState({
    reportType: 'usage',
    startDate: '',
    endDate: '',
    format: 'PDF',
  });

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) {
        setReports(
          data.map((r: any) => ({
            id: r.id,
            title: r.title,
            type: r.report_type,
            dateRange: `${formatDate(r.start_date)} - ${formatDate(r.end_date)}`,
            createdAt: r.created_at,
            format: r.format,
            size: r.size,
          }))
        );
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.startDate || !formData.endDate) {
      alert('Please select both start and end dates');
      return;
    }

    try {
      setGenerating(true);
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);

      // Filter cylinders data by date range
      const filteredCylinders = cylinders
        .filter((c) => {
          const createdAt = new Date(c.created_at);
          return createdAt >= startDate && createdAt <= endDate;
        })
        .map((c) => ({
          cylinderId: c.cylinder_id,
          ward: c.ward,
          level: c.current_level,
          status: c.status,
          date: formatDate(c.created_at),
        }));

      const reportTypes: Record<string, string> = {
        usage: 'Oxygen Usage Report',
        alert: 'Alert Summary Report',
        refill: 'Refill Schedule Report',
        inventory: 'Inventory Status Report',
      };

      const reportTitle = reportTypes[formData.reportType];
      let reportFile: jsPDF | null = null;
      let csvContent = '';

      if (formData.format === 'PDF') {
        reportFile = generatePDFReport(
          reportTitle,
          formData.reportType,
          formData.startDate,
          formData.endDate,
          filteredCylinders
        );
      } else {
        csvContent = generateCSVReport(filteredCylinders);
      }

      // Save report metadata to Supabase
      const fileSize = formData.format === 'PDF'
        ? `${Math.round(((reportFile as any)?.internal?.getNumberOfPages() || 1) * 50)}KB`
        : `${Math.round(csvContent.length / 1024)}KB`;

      const { data: savedReport, error: saveError } = await supabase
        .from('reports')
        .insert({
          title: reportTitle,
          report_type: formData.reportType,
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
          format: formData.format,
          size: fileSize,
          content: formData.format === 'PDF' ? reportFile?.output('dataurlstring') : csvContent,
        })
        .select()
        .single();

      if (saveError) throw saveError;

      // Trigger download
      if (formData.format === 'PDF' && reportFile) {
        reportFile.save(`${reportTitle.replace(/\s+/g, '_')}.pdf`);
      } else if (formData.format === 'CSV') {
        const element = document.createElement('a');
        element.setAttribute('href', `data:text/csv;charset=utf-8,${encodeURIComponent(csvContent)}`);
        element.setAttribute('download', `${reportTitle.replace(/\s+/g, '_')}.csv`);
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
      }

      // Add to reports list
      setReports((prev) => [
        {
          id: savedReport.id,
          title: reportTitle,
          type: formData.reportType,
          dateRange: `${formData.startDate} - ${formData.endDate}`,
          createdAt: savedReport.created_at,
          format: formData.format,
          size: fileSize,
        },
        ...prev,
      ]);

      setShowForm(false);
      setFormData({ reportType: 'usage', startDate: '', endDate: '', format: 'PDF' });
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Failed to generate report. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const handleDownloadReport = async (reportId: string) => {
    try {
      const report = reports.find((r) => r.id === reportId);
      if (!report) return;

      const { data, error } = await supabase
        .from('reports')
        .select('content')
        .eq('id', reportId)
        .single();

      if (error) throw error;

      const element = document.createElement('a');
      const fileName = `${report.title.replace(/\s+/g, '_')}.${report.format.toLowerCase()}`;

      if (report.format === 'PDF') {
        element.setAttribute('href', data.content);
        element.setAttribute('download', fileName);
      } else {
        element.setAttribute('href', `data:text/csv;charset=utf-8,${encodeURIComponent(data.content)}`);
        element.setAttribute('download', fileName);
      }

      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    } catch (error) {
      console.error('Error downloading report:', error);
      alert('Failed to download report.');
    }
  };

  const handleDeleteReport = async (reportId: string) => {
    try {
      const { error } = await supabase
        .from('reports')
        .delete()
        .eq('id', reportId);

      if (error) throw error;

      setReports((prev) => prev.filter((r) => r.id !== reportId));
    } catch (error) {
      console.error('Error deleting report:', error);
      alert('Failed to delete report.');
    }
  };

  const quickReports = [
    {
      title: "This Week's Usage",
      icon: <TrendingUp className="w-6 h-6" />,
      variant: 'blue' as const,
      description: 'Last 7 days oxygen consumption',
    },
    {
      title: 'Monthly Alert Summary',
      icon: <AlertCircle className="w-6 h-6" />,
      variant: 'red' as const,
      description: 'Alert frequency and trends',
    },
    {
      title: 'Refill Report',
      icon: <BarChart3 className="w-6 h-6" />,
      variant: 'amber' as const,
      description: 'Refill schedule and costs',
    },
    {
      title: 'Inventory Status',
      icon: <Package className="w-6 h-6" />,
      variant: 'green' as const,
      description: 'Current stock and valuation',
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-cyan-500/20 border border-cyan-500/30">
                <FileText className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white">Reports</h1>
                <p className="text-gray-400 text-sm mt-1">
                  Generate and manage analytics reports
                </p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-cyan-500 text-white rounded-lg font-medium hover:bg-cyan-600 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Generate Report
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {quickReports.map((report) => (
            <motion.div
              key={report.title}
              whileHover={{ scale: 1.02 }}
              className={cn(
                'rounded-lg backdrop-blur-xl border p-4 shadow-lg cursor-pointer transition-all',
                report.variant === 'blue'
                  ? 'from-blue-600/20 to-blue-500/10 border-blue-500/30 bg-gradient-to-br'
                  : report.variant === 'red'
                    ? 'from-red-600/20 to-red-500/10 border-red-500/30 bg-gradient-to-br'
                    : report.variant === 'amber'
                      ? 'from-amber-600/20 to-amber-500/10 border-amber-500/30 bg-gradient-to-br'
                      : 'from-green-600/20 to-green-500/10 border-green-500/30 bg-gradient-to-br'
              )}
            >
              <div className="mb-3">
                {report.icon}
              </div>
              <h3 className="text-white font-semibold text-sm mb-1">
                {report.title}
              </h3>
              <p className="text-gray-400 text-xs">{report.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="rounded-xl backdrop-blur-xl bg-slate-800/40 border border-slate-700/50 p-6 shadow-xl mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-cyan-400" />
              Generated Reports ({reports.length})
            </h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowForm(true)}
              className="text-cyan-400 hover:text-cyan-300 transition-colors text-sm font-medium flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              New Report
            </motion.button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="w-6 h-6 text-cyan-400 animate-spin" />
              <span className="ml-2 text-gray-400">Loading reports...</span>
            </div>
          ) : reports.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No reports generated yet. Create one to get started.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700/50 bg-slate-900/50">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                      Report Title
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                      Type
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                      Date Range
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                      Created
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                      Format
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {reports.slice(0, 10).map((report, idx) => (
                    <motion.tr
                      key={report.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-white">
                        {report.title}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={cn(
                            'inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold border',
                            report.type === 'usage'
                              ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                              : report.type === 'alert'
                                ? 'bg-red-500/20 text-red-400 border-red-500/30'
                                : report.type === 'refill'
                                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                                  : 'bg-green-500/20 text-green-400 border-green-500/30'
                          )}
                        >
                          {report.type.charAt(0).toUpperCase() +
                            report.type.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">
                        {report.dateRange}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">
                        {formatDate(report.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-slate-700/50 text-gray-300 border border-slate-600/50">
                          {report.format}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleDownloadReport(report.id)}
                            className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors text-gray-400 hover:text-green-400"
                            title="Download report"
                          >
                            <Download className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleDeleteReport(report.id)}
                            className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors text-gray-400 hover:text-red-400"
                            title="Delete report"
                          >
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!loading && reports.length > 0 && (
            <div className="px-6 py-4 bg-slate-900/30 border-t border-slate-700/50 text-sm text-gray-400">
              Showing {reports.slice(0, 10).length} of {reports.length} reports
            </div>
          )}
        </motion.div>

        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-slate-800 border border-slate-700/50 rounded-xl p-6 max-w-md w-full"
            >
              <h3 className="text-xl font-bold text-white mb-6">
                Generate New Report
              </h3>

              <form onSubmit={handleGenerateReport} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Report Type
                  </label>
                  <select
                    value={formData.reportType}
                    onChange={(e) =>
                      setFormData({ ...formData, reportType: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="usage">Oxygen Usage</option>
                    <option value="alert">Alert Summary</option>
                    <option value="refill">Refill Schedule</option>
                    <option value="inventory">Inventory Status</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData({ ...formData, endDate: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Format
                  </label>
                  <select
                    value={formData.format}
                    onChange={(e) =>
                      setFormData({ ...formData, format: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="PDF">PDF</option>
                    <option value="CSV">CSV</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => setShowForm(false)}
                    disabled={generating}
                    className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={generating}
                    className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {generating ? <Loader className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
                    {generating ? 'Generating...' : 'Generate'}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
