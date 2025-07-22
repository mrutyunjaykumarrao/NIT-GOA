# Database Utilities

This directory contains shared utilities and configurations for the faculty database script system.

## 📁 Files

### `db_config.py`
Central configuration module providing:

#### Database Management
- `DatabaseConnection`: Context manager for MySQL connections
- Connection parameters and error handling
- Transaction management

#### Department Mappings
- `DEPARTMENT_MAPPINGS`: Full name to code conversions
- `get_department_code()`: Department name resolution
- `get_all_departments()`: List all department codes

#### JSON File Operations
- `get_json_files()`: Find faculty JSON files by department
- `load_faculty_json()`: Load and parse faculty data
- Path management for faculty JSON files

#### Data Utilities
- `count_json_data()`: Count items in JSON sections
- `count_db_data()`: Count database records
- `print_section_header()`: Formatted output headers
- Data validation helpers

#### Configuration Constants
- `VERIFICATION_SECTIONS`: 11 data sections per faculty
- JSON file path patterns
- Database table mappings

## 🔧 Usage

Import utilities in your scripts:

```python
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'utils'))
from db_config import *

# Use database connection
with DatabaseConnection() as (cursor, conn):
    cursor.execute("SELECT * FROM faculty_profiles")
    results = cursor.fetchall()

# Get department files
files = get_json_files('CSE')

# Load faculty data
faculty_data = load_faculty_json(file_path)
```

## 🏗️ Architecture

The utilities follow a modular design:

1. **Separation of Concerns**: Each function has a single responsibility
2. **Error Handling**: Comprehensive exception management
3. **Reusability**: Functions used across all script types
4. **Configuration**: Centralized settings and mappings
5. **Context Management**: Safe database operations

## 📊 Supported Operations

### Database Operations
- Connection management with automatic cleanup
- Transaction handling
- Error recovery
- Query execution helpers

### File Operations
- JSON parsing with error handling
- File discovery by department
- Path resolution
- Data validation

### Data Processing
- Count comparisons (JSON vs Database)
- Data cleaning and normalization
- Type conversion helpers
- Formatting utilities

## 🔍 Dependencies

- `mysql-connector-python`: Database connectivity
- `json`: JSON file processing
- `os`: File system operations
- `pathlib`: Path management

## 🛠️ Configuration

Update database settings in `db_config.py`:

```python
DB_CONFIG = {
    'host': 'localhost',
    'user': 'your_username',
    'password': 'your_password',
    'database': 'nitgoa_db',
    'raise_on_warnings': True
}
```

## 📈 Performance

The utilities are optimized for:
- **Memory Efficiency**: Minimal memory footprint
- **Connection Pooling**: Reusable database connections
- **Error Recovery**: Graceful failure handling
- **Caching**: Reduced file I/O operations

## 🔒 Security

Security features:
- Parameterized queries to prevent SQL injection
- Connection timeout handling
- Error message sanitization
- Resource cleanup guarantees

## 📝 Extension

To add new utilities:

1. Follow existing naming conventions
2. Include comprehensive error handling
3. Add docstrings with usage examples
4. Update this README with new functions

---

**Central hub for the 100% data integrity achievement system**
