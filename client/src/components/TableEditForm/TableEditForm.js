import React, { useState, useEffect } from 'react';
import './TableEditForm.css';

const TableEditForm = ({ 
  data = [], 
  columns, 
  tableName, 
  facultyId, 
  onSave, 
  onCancel,
  apiEndpoint 
}) => {
  const [tableData, setTableData] = useState([]);
  const [editingRow, setEditingRow] = useState(null);
  const [newRow, setNewRow] = useState({});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setTableData(data.map((item, index) => ({ ...item, _tempId: item.id || `temp_${index}` })));
  }, [data]);

  const initializeNewRow = () => {
    const row = {};
    columns.forEach(column => {
      row[column.key] = column.type === 'select' ? column.options[0]?.value || '' : '';
    });
    return row;
  };

  const handleAddRow = () => {
    setNewRow(initializeNewRow());
    setEditingRow('new');
    setErrors({});
  };

  const handleEditRow = (row) => {
    setEditingRow(row._tempId);
    setNewRow({ ...row });
    setErrors({});
  };

  const handleDeleteRow = async (row) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      if (row.id) {
        // Delete from database
        try {
          setLoading(true);
          const response = await fetch(`${apiEndpoint}/${row.id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            throw new Error('Failed to delete entry');
          }

          setTableData(prev => prev.filter(item => item._tempId !== row._tempId));
          onSave(); // Refresh parent data
        } catch (error) {
          console.error('Error deleting entry:', error);
          alert('Failed to delete entry. Please try again.');
        } finally {
          setLoading(false);
        }
      } else {
        // Remove from local state only
        setTableData(prev => prev.filter(item => item._tempId !== row._tempId));
      }
    }
  };

  const validateRow = (row) => {
    const newErrors = {};
    columns.forEach(column => {
      if (column.required && (!row[column.key] || row[column.key].toString().trim() === '')) {
        newErrors[column.key] = `${column.label} is required`;
      }
      
      if (column.type === 'url' && row[column.key] && row[column.key].trim()) {
        try {
          new URL(row[column.key]);
        } catch (e) {
          newErrors[column.key] = 'Please enter a valid URL';
        }
      }
      
      if (column.type === 'email' && row[column.key] && row[column.key].trim()) {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row[column.key])) {
          newErrors[column.key] = 'Please enter a valid email address';
        }
      }
      
      if (column.type === 'number' && row[column.key] && isNaN(row[column.key])) {
        newErrors[column.key] = 'Please enter a valid number';
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveRow = async () => {
    if (!validateRow(newRow)) {
      return;
    }

    setLoading(true);
    try {
      const isNewEntry = editingRow === 'new';
      const method = isNewEntry ? 'POST' : 'PUT';
      const url = isNewEntry 
        ? `${apiEndpoint.replace(':facultyId', facultyId)}`
        : `${apiEndpoint}/${newRow.id}`;

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRow),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${isNewEntry ? 'add' : 'update'} entry`);
      }

      const result = await response.json();

      if (isNewEntry) {
        const newEntry = { ...newRow, id: result.data?.id, _tempId: `temp_${Date.now()}` };
        setTableData(prev => [...prev, newEntry]);
      } else {
        setTableData(prev => prev.map(item => 
          item._tempId === editingRow ? { ...newRow, _tempId: item._tempId } : item
        ));
      }

      setEditingRow(null);
      setNewRow({});
      onSave(); // Refresh parent data
    } catch (error) {
      console.error('Error saving entry:', error);
      alert(`Failed to ${editingRow === 'new' ? 'add' : 'update'} entry. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingRow(null);
    setNewRow({});
    setErrors({});
  };

  const handleInputChange = (key, value) => {
    setNewRow(prev => ({
      ...prev,
      [key]: value
    }));
    
    // Clear error when user starts typing
    if (errors[key]) {
      setErrors(prev => ({
        ...prev,
        [key]: ''
      }));
    }
  };

  const renderEditCell = (column, value) => {
    const hasError = errors[column.key];
    
    switch (column.type) {
      case 'textarea':
        return (
          <div className="edit-cell">
            <textarea
              value={value || ''}
              onChange={(e) => handleInputChange(column.key, e.target.value)}
              placeholder={column.placeholder || ''}
              className={hasError ? 'error' : ''}
              rows="3"
            />
            {hasError && <span className="error-message">{hasError}</span>}
          </div>
        );
      
      case 'select':
        return (
          <div className="edit-cell">
            <select
              value={value || ''}
              onChange={(e) => handleInputChange(column.key, e.target.value)}
              className={hasError ? 'error' : ''}
            >
              <option value="">Select {column.label}</option>
              {column.options?.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {hasError && <span className="error-message">{hasError}</span>}
          </div>
        );
      
      case 'date':
        return (
          <div className="edit-cell">
            <input
              type="date"
              value={value || ''}
              onChange={(e) => handleInputChange(column.key, e.target.value)}
              className={hasError ? 'error' : ''}
            />
            {hasError && <span className="error-message">{hasError}</span>}
          </div>
        );
      
      case 'number':
        return (
          <div className="edit-cell">
            <input
              type="number"
              value={value || ''}
              onChange={(e) => handleInputChange(column.key, e.target.value)}
              placeholder={column.placeholder || ''}
              className={hasError ? 'error' : ''}
              min={column.min || 0}
              max={column.max}
            />
            {hasError && <span className="error-message">{hasError}</span>}
          </div>
        );
      
      default:
        return (
          <div className="edit-cell">
            <input
              type={column.type || 'text'}
              value={value || ''}
              onChange={(e) => handleInputChange(column.key, e.target.value)}
              placeholder={column.placeholder || ''}
              className={hasError ? 'error' : ''}
            />
            {hasError && <span className="error-message">{hasError}</span>}
          </div>
        );
    }
  };

  const renderDisplayCell = (column, value, row) => {
    if (column.render) {
      return column.render(value, row);
    }
    
    switch (column.type) {
      case 'url':
        return value ? (
          <a href={value} target="_blank" rel="noopener noreferrer" className="link-cell">
            {value.length > 30 ? `${value.substring(0, 30)}...` : value}
          </a>
        ) : '-';
      
      case 'email':
        return value ? (
          <a href={`mailto:${value}`} className="link-cell">
            {value}
          </a>
        ) : '-';
      
      case 'date':
        return value ? new Date(value).toLocaleDateString() : '-';
      
      default:
        return value || '-';
    }
  };

  return (
    <div className="table-edit-form">
      <div className="table-header">
        <h3>{tableName}</h3>
        <div className="table-actions">
          <button 
            type="button" 
            className="add-button" 
            onClick={handleAddRow}
            disabled={editingRow !== null || loading}
          >
            <i className="fas fa-plus"></i>
            Add New
          </button>
          <button type="button" className="close-button" onClick={onCancel}>
            <i className="fas fa-times"></i>
          </button>
        </div>
      </div>

      <div className="table-container">
        <table className="edit-table">
          <thead>
            <tr>
              <th style={{ width: '50px' }}>#</th>
              {columns.map(column => (
                <th key={column.key} style={{ width: column.width || 'auto' }}>
                  {column.label}
                  {column.required && <span className="required">*</span>}
                </th>
              ))}
              <th style={{ width: '120px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, index) => (
              <tr key={row._tempId} className={editingRow === row._tempId ? 'editing' : ''}>
                <td>{index + 1}</td>
                {columns.map(column => (
                  <td key={column.key}>
                    {editingRow === row._tempId 
                      ? renderEditCell(column, newRow[column.key])
                      : renderDisplayCell(column, row[column.key], row)
                    }
                  </td>
                ))}
                <td>
                  {editingRow === row._tempId ? (
                    <div className="row-actions">
                      <button 
                        className="save-btn" 
                        onClick={handleSaveRow}
                        disabled={loading}
                      >
                        <i className="fas fa-check"></i>
                      </button>
                      <button 
                        className="cancel-btn" 
                        onClick={handleCancelEdit}
                        disabled={loading}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  ) : (
                    <div className="row-actions">
                      <button 
                        className="edit-btn" 
                        onClick={() => handleEditRow(row)}
                        disabled={editingRow !== null || loading}
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button 
                        className="delete-btn" 
                        onClick={() => handleDeleteRow(row)}
                        disabled={editingRow !== null || loading}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            
            {editingRow === 'new' && (
              <tr className="editing new-row">
                <td>{tableData.length + 1}</td>
                {columns.map(column => (
                  <td key={column.key}>
                    {renderEditCell(column, newRow[column.key])}
                  </td>
                ))}
                <td>
                  <div className="row-actions">
                    <button 
                      className="save-btn" 
                      onClick={handleSaveRow}
                      disabled={loading}
                    >
                      <i className="fas fa-check"></i>
                    </button>
                    <button 
                      className="cancel-btn" 
                      onClick={handleCancelEdit}
                      disabled={loading}
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {tableData.length === 0 && editingRow !== 'new' && (
        <div className="empty-state">
          <i className="fas fa-database"></i>
          <p>No {tableName.toLowerCase()} entries found.</p>
          <button className="add-button" onClick={handleAddRow}>
            <i className="fas fa-plus"></i>
            Add First Entry
          </button>
        </div>
      )}
    </div>
  );
};

export default TableEditForm;
