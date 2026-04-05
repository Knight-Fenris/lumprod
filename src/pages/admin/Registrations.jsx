import { useState, useEffect, useMemo } from 'react';
import AdminNavbar from '../../components/admin/AdminNavbar';
import { db } from '../../firebaseDb';
import { collection, getDocs, doc, updateDoc, query, orderBy } from 'firebase/firestore';
import { useAdmin } from '../../contexts/AdminContext';
import './AdminCommon.css';
import './Registrations.css';

const INITIAL_FILTERS = {
  status: 'all',
  category: 'all',
  language: 'all',
  hasTransaction: 'all',
  minFee: '',
  maxFee: '',
  dateFrom: '',
  dateTo: '',
};

const normalizeText = (value) => String(value ?? '').trim().toLowerCase();

const normalizeStatus = (value) => normalizeText(value) || 'pending';

const toReadableLabel = (value) =>
  String(value ?? '')
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

const escapeXml = (value) => {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
};

export default function Registrations() {
  const [submissions, setSubmissions] = useState([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [draftFilters, setDraftFilters] = useState(INITIAL_FILTERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { admin } = useAdmin();

  useEffect(() => {
    loadSubmissions();
  }, []);

  useEffect(() => {
    filterSubmissions();
  }, [filters, searchTerm, submissions]);

  const statusOptions = useMemo(() => {
    const statuses = new Set(['pending']);
    submissions.forEach((sub) => {
      statuses.add(normalizeStatus(sub.paymentStatus));
    });
    return ['all', ...Array.from(statuses).sort((a, b) => a.localeCompare(b))];
  }, [submissions]);

  const categoryOptions = useMemo(() => {
    const optionsMap = new Map();

    submissions.forEach((sub) => {
      const label = String(sub.categoryName ?? '').trim();
      if (!label) return;
      const key = label.toLowerCase();
      if (!optionsMap.has(key)) {
        optionsMap.set(key, label);
      }
    });

    return Array.from(optionsMap.entries())
      .map(([value, label]) => ({ value, label }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [submissions]);

  const languageOptions = useMemo(() => {
    const optionsMap = new Map();

    submissions.forEach((sub) => {
      const label = String(sub.language ?? '').trim();
      if (!label) return;
      const key = label.toLowerCase();
      if (!optionsMap.has(key)) {
        optionsMap.set(key, label);
      }
    });

    return Array.from(optionsMap.entries())
      .map(([value, label]) => ({ value, label }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [submissions]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.status !== 'all') count += 1;
    if (filters.category !== 'all') count += 1;
    if (filters.language !== 'all') count += 1;
    if (filters.hasTransaction !== 'all') count += 1;
    if (filters.minFee !== '') count += 1;
    if (filters.maxFee !== '') count += 1;
    if (filters.dateFrom !== '') count += 1;
    if (filters.dateTo !== '') count += 1;
    return count;
  }, [filters]);

  const appliedFilterSummary = useMemo(() => {
    const summaryParts = [];

    if (filters.status !== 'all') summaryParts.push(`Status: ${toReadableLabel(filters.status)}`);
    if (filters.category !== 'all') {
      const categoryLabel = categoryOptions.find((option) => option.value === filters.category)?.label || filters.category;
      summaryParts.push(`Category: ${categoryLabel}`);
    }
    if (filters.language !== 'all') {
      const languageLabel = languageOptions.find((option) => option.value === filters.language)?.label || filters.language;
      summaryParts.push(`Language: ${languageLabel}`);
    }
    if (filters.hasTransaction !== 'all') {
      summaryParts.push(`Transaction: ${filters.hasTransaction === 'yes' ? 'Present' : 'Missing'}`);
    }
    if (filters.minFee !== '') summaryParts.push(`Min Fee: INR ${filters.minFee}`);
    if (filters.maxFee !== '') summaryParts.push(`Max Fee: INR ${filters.maxFee}`);
    if (filters.dateFrom) summaryParts.push(`From: ${filters.dateFrom}`);
    if (filters.dateTo) summaryParts.push(`To: ${filters.dateTo}`);

    return summaryParts.length ? summaryParts.join(' | ') : 'None';
  }, [categoryOptions, filters, languageOptions]);

  const loadSubmissions = async () => {
    try {
      const q = query(collection(db, 'lumiere_submissions'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const data = [];
      snapshot.forEach((docSnap) => {
        const submission = docSnap.data();
        data.push({
          id: docSnap.id,
          ...submission,
          createdAt: submission.createdAt?.toDate?.() || null,
          updatedAt: submission.updatedAt?.toDate?.() || null,
        });
      });
      setSubmissions(data);
      setFilteredSubmissions(data);
    } catch (error) {
      console.error('Error loading submissions:', error);
      alert('Failed to load submissions: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const filterSubmissions = () => {
    let filtered = [...submissions];

    const minFeeValue = filters.minFee === '' ? null : Number(filters.minFee);
    const maxFeeValue = filters.maxFee === '' ? null : Number(filters.maxFee);

    const hasMinFee = minFeeValue !== null && !Number.isNaN(minFeeValue);
    const hasMaxFee = maxFeeValue !== null && !Number.isNaN(maxFeeValue);

    let fromDate = null;
    if (filters.dateFrom) {
      const parsed = new Date(`${filters.dateFrom}T00:00:00`);
      if (!Number.isNaN(parsed.getTime())) {
        fromDate = parsed;
      }
    }

    let toDate = null;
    if (filters.dateTo) {
      const parsed = new Date(`${filters.dateTo}T23:59:59`);
      if (!Number.isNaN(parsed.getTime())) {
        toDate = parsed;
      }
    }

    filtered = filtered.filter((sub) => {
      const status = normalizeStatus(sub.paymentStatus);
      const category = normalizeText(sub.categoryName);
      const language = normalizeText(sub.language);
      const hasTransaction = Boolean(String(sub.transactionId ?? '').trim());
      const fee = Number(sub.fee) || 0;

      const createdAt = sub.createdAt
        ? sub.createdAt instanceof Date
          ? sub.createdAt
          : new Date(sub.createdAt)
        : null;

      if (filters.status !== 'all' && status !== filters.status) return false;
      if (filters.category !== 'all' && category !== filters.category) return false;
      if (filters.language !== 'all' && language !== filters.language) return false;
      if (filters.hasTransaction === 'yes' && !hasTransaction) return false;
      if (filters.hasTransaction === 'no' && hasTransaction) return false;
      if (hasMinFee && fee < minFeeValue) return false;
      if (hasMaxFee && fee > maxFeeValue) return false;
      if (fromDate && (!createdAt || createdAt < fromDate)) return false;
      if (toDate && (!createdAt || createdAt > toDate)) return false;

      return true;
    });

    // Search filter
    if (searchTerm.trim()) {
      const term = normalizeText(searchTerm);
      filtered = filtered.filter(sub =>
        normalizeText(sub.title).includes(term) ||
        normalizeText(sub.submissionId).includes(term) ||
        normalizeText(sub.directorName).includes(term) ||
        normalizeText(sub.directorEmail).includes(term) ||
        normalizeText(sub.categoryName).includes(term) ||
        normalizeText(sub.language).includes(term) ||
        normalizeText(sub.directorPhone).includes(term) ||
        normalizeText(sub.transactionId).includes(term)
      );
    }

    setFilteredSubmissions(filtered);
  };

  const handleViewDetails = (submission) => {
    setSelectedSubmission(submission);
    setShowModal(true);
  };

  const handleUpdateStatus = async (submissionId, newStatus) => {
    try {
      const docRef = doc(db, 'lumiere_submissions', submissionId);
      const verifiedAt = new Date();

      await updateDoc(docRef, {
        paymentStatus: newStatus,
        verifiedBy: admin?.email || 'admin',
        verifiedAt,
      });

      // Update local state
      setSubmissions(prev =>
        prev.map(sub =>
          sub.id === submissionId
            ? {
                ...sub,
                paymentStatus: newStatus,
                verifiedBy: admin?.email || 'admin',
                verifiedAt,
              }
            : sub
        )
      );

      alert(`Submission ${newStatus} successfully!`);
      setShowModal(false);
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  const handleDraftFilterChange = (field, value) => {
    setDraftFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const normalizeFeeInput = (value) => {
    if (value === '') return '';
    const numericValue = Number(value);
    if (Number.isNaN(numericValue)) return '';
    return String(Math.max(0, numericValue));
  };

  const applyDraftFilters = () => {
    let minFee = normalizeFeeInput(draftFilters.minFee);
    let maxFee = normalizeFeeInput(draftFilters.maxFee);
    let dateFrom = draftFilters.dateFrom;
    let dateTo = draftFilters.dateTo;

    if (minFee !== '' && maxFee !== '' && Number(minFee) > Number(maxFee)) {
      [minFee, maxFee] = [maxFee, minFee];
    }

    if (dateFrom && dateTo && new Date(dateFrom) > new Date(dateTo)) {
      [dateFrom, dateTo] = [dateTo, dateFrom];
    }

    setFilters({
      ...draftFilters,
      minFee,
      maxFee,
      dateFrom,
      dateTo,
    });
    setDraftFilters((prev) => ({ ...prev, minFee, maxFee, dateFrom, dateTo }));
    setShowFilters(false);
  };

  const resetFilters = () => {
    setDraftFilters(INITIAL_FILTERS);
    setFilters(INITIAL_FILTERS);
  };

  const clearAllFiltersAndSearch = () => {
    setDraftFilters(INITIAL_FILTERS);
    setFilters(INITIAL_FILTERS);
    setSearchTerm('');
  };

  const toggleFilterPanel = () => {
    setShowFilters((prev) => {
      const next = !prev;
      if (next) {
        setDraftFilters(filters);
      }
      return next;
    });
  };

  const downloadFilteredExcel = () => {
    if (!filteredSubmissions.length) {
      alert('No filtered submissions available to export.');
      return;
    }

    const headers = [
      'Submission ID',
      'Title',
      'Category',
      'Director Name',
      'Director Email',
      'Director Phone',
      'Language',
      'Duration (min)',
      'Fee',
      'Payment Status',
      'Transaction ID',
      'Team Members',
      'Submitted On',
      'Updated On',
      'Verified By',
      'Verified At',
      'Film Link',
      'Poster Link',
      'Subtitles Link',
    ];

    const metadataRows = [
      ['Generated At', formatDateTime(new Date())],
      ['Total Rows', filteredSubmissions.length],
      ['Search Term', searchTerm.trim() || 'None'],
      ['Applied Filters', appliedFilterSummary],
      [''],
    ];

    const rows = filteredSubmissions.map((sub) => [
      sub.submissionId || '',
      sub.title || '',
      sub.categoryName || '',
      sub.directorName || '',
      sub.directorEmail || '',
      sub.directorPhone || '',
      sub.language || '',
      sub.duration || '',
      sub.fee || 0,
      toReadableLabel(normalizeStatus(sub.paymentStatus)),
      sub.transactionId || '',
      sub.teamMembers || '',
      formatDateTime(sub.createdAt),
      formatDateTime(sub.updatedAt),
      sub.verifiedBy || '',
      formatDateTime(sub.verifiedAt),
      sub.filmLink || '',
      sub.posterLink || '',
      sub.subtitlesLink || '',
    ]);

    const allRows = [...metadataRows, headers, ...rows]
      .map((row) => `<Row>${row.map((cell) => `<Cell><Data ss:Type="String">${escapeXml(cell)}</Data></Cell>`).join('')}</Row>`)
      .join('');

    const xml = `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <Worksheet ss:Name="Submissions">
  <Table>${allRows}</Table>
 </Worksheet>
</Workbook>`;

    const blob = new Blob([xml], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const today = new Date().toISOString().slice(0, 10);

    link.href = url;
    link.download = `lumiere-submissions-filtered-${today}.xls`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    const d = date instanceof Date ? date : new Date(date);
    return d.toLocaleDateString('en-IN', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const formatDateTime = (date) => {
    if (!date) return 'N/A';
    const d = date instanceof Date ? date : new Date(date);
    return d.toLocaleDateString('en-IN', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    }) + ' at ' + d.toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  if (loading) {
    return (
      <>
        <AdminNavbar />
        <div className="admin-page">
          <div className="loading">Loading submissions...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <AdminNavbar />
      <div className="admin-page">
        <div className="admin-header">
          <h1>Film Submissions ({submissions.length})</h1>
        </div>

        <div className="registrations-controls">
          <div className="controls-top-row">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search by title, ID, director, phone, transaction..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="controls-actions">
              <button
                type="button"
                className={`toggle-filters-btn ${showFilters ? 'active' : ''}`}
                onClick={toggleFilterPanel}
              >
                {showFilters ? 'Hide Filters' : 'Filter'}
                {activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
              </button>

              <button
                type="button"
                className="download-excel-btn"
                onClick={downloadFilteredExcel}
                disabled={filteredSubmissions.length === 0}
              >
                Download Excel
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="advanced-filters-panel">
              <div className="filters-grid">
                <div className="filter-field">
                  <label htmlFor="status-filter">Status</label>
                  <select
                    id="status-filter"
                    value={draftFilters.status}
                    onChange={(e) => handleDraftFilterChange('status', e.target.value)}
                  >
                    {statusOptions.map((statusOption) => (
                      <option key={statusOption} value={statusOption}>
                        {statusOption === 'all' ? 'All Statuses' : toReadableLabel(statusOption)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="filter-field">
                  <label htmlFor="category-filter">Category</label>
                  <select
                    id="category-filter"
                    value={draftFilters.category}
                    onChange={(e) => handleDraftFilterChange('category', e.target.value)}
                  >
                    <option value="all">All Categories</option>
                    {categoryOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="filter-field">
                  <label htmlFor="language-filter">Language</label>
                  <select
                    id="language-filter"
                    value={draftFilters.language}
                    onChange={(e) => handleDraftFilterChange('language', e.target.value)}
                  >
                    <option value="all">All Languages</option>
                    {languageOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="filter-field">
                  <label htmlFor="transaction-filter">Transaction</label>
                  <select
                    id="transaction-filter"
                    value={draftFilters.hasTransaction}
                    onChange={(e) => handleDraftFilterChange('hasTransaction', e.target.value)}
                  >
                    <option value="all">Any</option>
                    <option value="yes">Present</option>
                    <option value="no">Missing</option>
                  </select>
                </div>

                <div className="filter-field">
                  <label htmlFor="min-fee-filter">Min Fee</label>
                  <input
                    id="min-fee-filter"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={draftFilters.minFee}
                    onChange={(e) => handleDraftFilterChange('minFee', e.target.value)}
                  />
                </div>

                <div className="filter-field">
                  <label htmlFor="max-fee-filter">Max Fee</label>
                  <input
                    id="max-fee-filter"
                    type="number"
                    min="0"
                    placeholder="5000"
                    value={draftFilters.maxFee}
                    onChange={(e) => handleDraftFilterChange('maxFee', e.target.value)}
                  />
                </div>

                <div className="filter-field">
                  <label htmlFor="date-from-filter">Submitted From</label>
                  <input
                    id="date-from-filter"
                    type="date"
                    value={draftFilters.dateFrom}
                    onChange={(e) => handleDraftFilterChange('dateFrom', e.target.value)}
                  />
                </div>

                <div className="filter-field">
                  <label htmlFor="date-to-filter">Submitted To</label>
                  <input
                    id="date-to-filter"
                    type="date"
                    value={draftFilters.dateTo}
                    onChange={(e) => handleDraftFilterChange('dateTo', e.target.value)}
                  />
                </div>
              </div>

              <div className="filter-panel-actions">
                <button type="button" className="apply-filter-btn" onClick={applyDraftFilters}>
                  Apply Filters
                </button>
                <button type="button" className="reset-filter-btn" onClick={resetFilters}>
                  Reset Filters
                </button>
              </div>
            </div>
          )}

          <div className="results-meta">
            <span className="results-count">
              Showing {filteredSubmissions.length} of {submissions.length} submissions
            </span>
            {(activeFilterCount > 0 || searchTerm.trim()) && (
              <button type="button" className="clear-filters-btn" onClick={clearAllFiltersAndSearch}>
                Clear All
              </button>
            )}
          </div>

          <div className="filter-buttons">
            <button
              className={filters.status === 'all' ? 'active' : ''}
              onClick={() => setFilters((prev) => ({ ...prev, status: 'all' }))}
            >
              All
            </button>
            <button
              className={filters.status === 'pending' ? 'active' : ''}
              onClick={() => setFilters((prev) => ({ ...prev, status: 'pending' }))}
            >
              Pending
            </button>
            <button
              className={filters.status === 'verified' ? 'active' : ''}
              onClick={() => setFilters((prev) => ({ ...prev, status: 'verified' }))}
            >
              Verified
            </button>
            <button
              className={filters.status === 'rejected' ? 'active' : ''}
              onClick={() => setFilters((prev) => ({ ...prev, status: 'rejected' }))}
            >
              Rejected
            </button>
          </div>
        </div>

        <div className="registrations-list">
          {filteredSubmissions.length === 0 ? (
            <p className="no-data">No submissions found</p>
          ) : (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Director</th>
                    <th>Email</th>
                    <th>Fee</th>
                    <th>Status</th>
                    <th>Submitted</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubmissions.map((submission) => (
                    <tr key={submission.id}>
                      <td><span className="reg-id">{submission.submissionId}</span></td>
                      <td className="title-cell"><strong>{submission.title}</strong></td>
                      <td>{submission.categoryName}</td>
                      <td><strong>{submission.directorName}</strong></td>
                      <td className="email-cell">{submission.directorEmail}</td>
                      <td className="fees-cell">₹{submission.fee}</td>
                      <td>
                        <span className={`status-badge status-${submission.paymentStatus || 'pending'}`}>
                          {submission.paymentStatus || 'pending'}
                        </span>
                      </td>
                      <td className="date-cell">{formatDate(submission.createdAt)}</td>
                      <td>
                        <button
                          onClick={() => handleViewDetails(submission)}
                          className="action-btn-review"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {showModal && selectedSubmission && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
              
              <h2>Submission Details</h2>
              
              <div className="modal-details">
                <div className="detail-section">
                  <h3>Film Information</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <label>Submission ID</label>
                      <span>{selectedSubmission.submissionId}</span>
                    </div>
                    <div className="detail-item">
                      <label>Title</label>
                      <span>{selectedSubmission.title}</span>
                    </div>
                    <div className="detail-item">
                      <label>Category</label>
                      <span>{selectedSubmission.categoryName}</span>
                    </div>
                    <div className="detail-item">
                      <label>Duration</label>
                      <span>{selectedSubmission.duration} min</span>
                    </div>
                    <div className="detail-item">
                      <label>Language</label>
                      <span>{selectedSubmission.language}</span>
                    </div>
                    <div className="detail-item">
                      <label>Fee</label>
                      <span>₹{selectedSubmission.fee}</span>
                    </div>
                  </div>
                  <div className="detail-item full-width">
                    <label>Synopsis</label>
                    <p>{selectedSubmission.synopsis}</p>
                  </div>
                </div>

                <div className="detail-section">
                  <h3>Director / Team</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <label>Director Name</label>
                      <span>{selectedSubmission.directorName}</span>
                    </div>
                    <div className="detail-item">
                      <label>Email</label>
                      <span>{selectedSubmission.directorEmail}</span>
                    </div>
                    <div className="detail-item">
                      <label>Phone</label>
                      <span>{selectedSubmission.directorPhone}</span>
                    </div>
                  </div>
                  {selectedSubmission.teamMembers && (
                    <div className="detail-item full-width">
                      <label>Team Members</label>
                      <p>{selectedSubmission.teamMembers}</p>
                    </div>
                  )}
                </div>

                <div className="detail-section">
                  <h3>Links</h3>
                  <div className="links-grid">
                    {selectedSubmission.filmLink && (
                      <a href={selectedSubmission.filmLink} target="_blank" rel="noopener noreferrer" className="link-button">
                        View Film
                      </a>
                    )}
                    {selectedSubmission.posterLink && (
                      <a href={selectedSubmission.posterLink} target="_blank" rel="noopener noreferrer" className="link-button">
                        View Poster
                      </a>
                    )}
                    {selectedSubmission.subtitlesLink && (
                      <a href={selectedSubmission.subtitlesLink} target="_blank" rel="noopener noreferrer" className="link-button">
                        View Subtitles
                      </a>
                    )}
                  </div>
                </div>

                <div className="detail-section">
                  <h3>Status Information</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <label>Payment Status</label>
                      <span className={`status-badge ${selectedSubmission.paymentStatus || 'pending'}`}>
                        {selectedSubmission.paymentStatus || 'pending'}
                      </span>
                    </div>
                    {selectedSubmission.transactionId && (
                      <div className="detail-item">
                        <label>Transaction ID</label>
                        <span className="transaction-id">{selectedSubmission.transactionId}</span>
                      </div>
                    )}
                    <div className="detail-item">
                      <label>Submitted On</label>
                      <span>{formatDateTime(selectedSubmission.createdAt)}</span>
                    </div>
                    {selectedSubmission.verifiedBy && (
                      <>
                        <div className="detail-item">
                          <label>Verified By</label>
                          <span>{selectedSubmission.verifiedBy}</span>
                        </div>
                        <div className="detail-item">
                          <label>Verified At</label>
                          <span>{formatDateTime(selectedSubmission.verifiedAt)}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="modal-actions">
                  {selectedSubmission.paymentStatus !== 'verified' && (
                    <button
                      onClick={() => handleUpdateStatus(selectedSubmission.id, 'verified')}
                      className="btn-verify"
                    >
                      Verify Payment
                    </button>
                  )}
                  {selectedSubmission.paymentStatus !== 'rejected' && (
                    <button
                      onClick={() => handleUpdateStatus(selectedSubmission.id, 'rejected')}
                      className="btn-reject"
                    >
                      Reject
                    </button>
                  )}
                  {selectedSubmission.paymentStatus !== 'pending' && (
                    <button
                      onClick={() => handleUpdateStatus(selectedSubmission.id, 'pending')}
                      className="btn-pending"
                    >
                      ↻ Mark Pending
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
