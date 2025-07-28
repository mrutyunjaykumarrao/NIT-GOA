import React, { useState, useEffect } from 'react';
import './ListEditForm.css';

const ListEditForm = ({ 
  data = [], 
  listName, 
  facultyId, 
  onSave, 
  onCancel,
  apiEndpoint,
  itemStructure = { field: 'title', placeholder: 'Enter item' }
}) => {
  const [listData, setListData] = useState([]);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [newItem, setNewItem] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setListData(data.map((item, index) => ({ 
      id: item.id || null,
      text: typeof item === 'string' ? item : item[itemStructure.field] || '',
      _tempId: item.id || `temp_${index}`
    })));
  }, [data, itemStructure.field]);

  const handleAddItem = () => {
    if (newItem.trim()) {
      const tempItem = {
        id: null,
        text: newItem.trim(),
        _tempId: `temp_${Date.now()}`
      };
      setListData(prev => [...prev, tempItem]);
      setNewItem('');
      saveItem(tempItem);
    }
  };

  const handleEditItem = (index) => {
    setEditingIndex(index);
    setNewItem(listData[index].text);
  };

  const handleSaveEdit = () => {
    if (newItem.trim() && editingIndex >= 0) {
      const updatedItem = {
        ...listData[editingIndex],
        text: newItem.trim()
      };
      
      const updatedData = [...listData];
      updatedData[editingIndex] = updatedItem;
      setListData(updatedData);
      
      saveItem(updatedItem);
      setEditingIndex(-1);
      setNewItem('');
    }
  };

  const handleDeleteItem = async (index) => {
    const item = listData[index];
    if (window.confirm('Are you sure you want to delete this item?')) {
      if (item.id) {
        try {
          setLoading(true);
          const response = await fetch(`${apiEndpoint}/${item.id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            throw new Error('Failed to delete item');
          }

          setListData(prev => prev.filter((_, i) => i !== index));
          onSave(); // Refresh parent data
        } catch (error) {
          console.error('Error deleting item:', error);
          alert('Failed to delete item. Please try again.');
        } finally {
          setLoading(false);
        }
      } else {
        setListData(prev => prev.filter((_, i) => i !== index));
      }
    }
  };

  const saveItem = async (item) => {
    try {
      setLoading(true);
      const isNewItem = !item.id;
      const method = isNewItem ? 'POST' : 'PUT';
      const url = isNewItem 
        ? apiEndpoint.replace(':facultyId', facultyId)
        : `${apiEndpoint}/${item.id}`;

      const payload = {
        [itemStructure.field]: item.text
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${isNewItem ? 'add' : 'update'} item`);
      }

      const result = await response.json();
      
      if (isNewItem && result.data?.id) {
        // Update the item with the real ID from database
        setListData(prev => prev.map(listItem => 
          listItem._tempId === item._tempId 
            ? { ...listItem, id: result.data.id }
            : listItem
        ));
      }

      onSave(); // Refresh parent data
    } catch (error) {
      console.error('Error saving item:', error);
      alert(`Failed to ${item.id ? 'update' : 'add'} item. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingIndex(-1);
    setNewItem('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      if (editingIndex >= 0) {
        handleSaveEdit();
      } else {
        handleAddItem();
      }
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  return (
    <div className="list-edit-form">
      <div className="list-header">
        <h3>{listName}</h3>
        <button type="button" className="close-button" onClick={onCancel}>
          <i className="fas fa-times"></i>
        </button>
      </div>

      <div className="list-content">
        <div className="add-item-section">
          <div className="add-item-input">
            <input
              type="text"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={editingIndex >= 0 ? 'Edit item...' : itemStructure.placeholder}
              disabled={loading}
            />
            {editingIndex >= 0 ? (
              <div className="edit-actions">
                <button 
                  className="save-button" 
                  onClick={handleSaveEdit}
                  disabled={!newItem.trim() || loading}
                >
                  <i className="fas fa-check"></i>
                  Save
                </button>
                <button 
                  className="cancel-button" 
                  onClick={handleCancelEdit}
                  disabled={loading}
                >
                  <i className="fas fa-times"></i>
                  Cancel
                </button>
              </div>
            ) : (
              <button 
                className="add-button" 
                onClick={handleAddItem}
                disabled={!newItem.trim() || loading}
              >
                <i className="fas fa-plus"></i>
                Add
              </button>
            )}
          </div>
        </div>

        <div className="list-items">
          {listData.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-list"></i>
              <p>No {listName.toLowerCase()} found.</p>
              <p className="empty-hint">Add your first item using the input above.</p>
            </div>
          ) : (
            <ul className="items-list">
              {listData.map((item, index) => (
                <li key={item._tempId} className={`list-item ${editingIndex === index ? 'editing' : ''}`}>
                  <div className="item-content">
                    <span className="item-number">{index + 1}.</span>
                    <span className="item-text">{item.text}</span>
                  </div>
                  <div className="item-actions">
                    <button 
                      className="edit-btn" 
                      onClick={() => handleEditItem(index)}
                      disabled={editingIndex >= 0 || loading}
                      title="Edit item"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button 
                      className="delete-btn" 
                      onClick={() => handleDeleteItem(index)}
                      disabled={editingIndex >= 0 || loading}
                      title="Delete item"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="list-footer">
          <div className="item-count">
            Total items: {listData.length}
          </div>
          {loading && (
            <div className="loading-indicator">
              <i className="fas fa-spinner fa-spin"></i>
              Saving...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListEditForm;
