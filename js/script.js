// Constants
const signals = ["Signal 1", "Signal 2", "Signal 3", "Signal 4", "Signal 5"];
const interfaces = ["Interface 1", "Interface 2", "Interface 3", "Interface 4", "Interface 5"];
const baselines = ["BL01", "BL02", "BL03", "BL04", "BL05", "BL06", "BL07", "BL08", "BL09"];

// Data structure
const workspaceData = {
    "workspace1": [
        { signal: "Signal 1", interface: "Interface 2", baseline: "BL01", logic: "Logic cho Signal 1 và Interface 2", lastUpdated: "2025-04-10 14:30:22" },
        { signal: "Signal 3", interface: "Interface 1", baseline: "BL02", logic: "Logic cho Signal 3 và Interface 1", lastUpdated: "2025-04-11 09:15:47" }
    ],
    "workspace2": [
        { signal: "Signal 2", interface: "Interface 3", baseline: "BL03", logic: "Logic cho Signal 2 và Interface 3", lastUpdated: "2025-04-09 16:45:33" },
        { signal: "Signal 4", interface: "Interface 2", baseline: "BL01", logic: "Logic cho Signal 4 và Interface 2", lastUpdated: "2025-04-11 11:20:15" }
    ],
    "workspace3": []
};

const initialStates = {};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Setup workspace selector event
    document.getElementById('workspace').addEventListener('change', handleWorkspaceChange);
    
    // Setup baseline filter event
    document.getElementById('baseline-filter').addEventListener('change', handleBaselineFilterChange);
});

// Event handlers
function handleWorkspaceChange() {
    const workspaceId = this.value;
    const contentDiv = document.getElementById('workspace-content');
    const tableBody = document.querySelector('#signal-interface-table tbody');
    
    tableBody.innerHTML = '';
    
    if (workspaceId) {
        contentDiv.style.display = 'block';
        updateBaselineFilter(workspaceId);
        
        const data = workspaceData[workspaceId] || [];
        data.forEach((item, index) => {
            addRowWithData(item.signal, item.interface, item.baseline, item.logic, item.lastUpdated, index);
        });
        
        if (data.length === 0) {
            addNewRow();
        }
        
        saveInitialState();
    } else {
        contentDiv.style.display = 'none';
    }
}

function handleBaselineFilterChange() {
    const baselineValue = this.value;
    const rows = document.querySelectorAll('#signal-interface-table tbody tr');
    
    rows.forEach(row => {
        const rowBaselineValue = row.querySelector('td:nth-child(3) select').value;
        row.style.display = (!baselineValue || rowBaselineValue === baselineValue) ? '' : 'none';
    });
}

// Core functions
function updateBaselineFilter(workspaceId) {
    const baselineFilter = document.getElementById('baseline-filter');
    baselineFilter.innerHTML = '<option value="">-- Tất cả Baseline --</option>';
    
    if (!workspaceId) return;
    
    const data = workspaceData[workspaceId] || [];
    const uniqueBaselines = new Set(data.map(item => item.baseline).filter(Boolean));
    
    baselines.forEach(baseline => {
        if (uniqueBaselines.has(baseline)) {
            const option = document.createElement('option');
            option.value = baseline;
            option.textContent = baseline;
            baselineFilter.appendChild(option);
        }
    });
}

function resetFilter() {
    document.getElementById('baseline-filter').value = '';
    const rows = document.querySelectorAll('#signal-interface-table tbody tr');
    rows.forEach(row => row.style.display = '');
}

function saveInitialState() {
    const workspaceId = document.getElementById('workspace').value;
    initialStates[workspaceId] = [];
    const rows = document.querySelectorAll('#signal-interface-table tbody tr');
    
    rows.forEach((row, index) => {
        initialStates[workspaceId][index] = {
            signal: row.querySelector('td:nth-child(1) select').value,
            interface: row.querySelector('td:nth-child(2) select').value,
            baseline: row.querySelector('td:nth-child(3) select').value,
            logic: row.querySelector('td:nth-child(4) textarea').value
        };
    });
}

function addNewRow() {
    const currentTime = formatDateTime(new Date());
    addRowWithData('', '', '', '', currentTime, document.querySelectorAll('#signal-interface-table tbody tr').length);
}

function addRowWithData(signalValue, interfaceValue, baselineValue, logicValue, lastUpdated, rowIndex) {
    const tableBody = document.querySelector('#signal-interface-table tbody');
    const newRow = document.createElement('tr');
    newRow.dataset.rowIndex = rowIndex;
    
    // Signal column
    const signalCell = document.createElement('td');
    const signalSelect = createSelect(signals, signalValue, "-- Chọn Signal --");
    signalCell.appendChild(signalSelect);
    
    // Interface column
    const interfaceCell = document.createElement('td');
    const interfaceSelect = createSelect(interfaces, interfaceValue, "-- Chọn Interface --");
    interfaceCell.appendChild(interfaceSelect);
    
    // Baseline column
    const baselineCell = document.createElement('td');
    const baselineSelect = createSelect(baselines, baselineValue, "-- Chọn Baseline --");
    baselineSelect.addEventListener('change', function() {
        updateBaselineFilter(document.getElementById('workspace').value);
    });
    baselineCell.appendChild(baselineSelect);
    
    // Logic column
    const logicCell = document.createElement('td');
    const logicTextarea = document.createElement('textarea');
    logicTextarea.placeholder = "Nhập logic conversion...";
    logicTextarea.value = logicValue || '';
    logicCell.appendChild(logicTextarea);
    
    // Timestamp column
    const timestampCell = document.createElement('td');
    timestampCell.classList.add('timestamp');
    timestampCell.textContent = lastUpdated || formatDateTime(new Date());
    
    // Action column
    const actionCell = document.createElement('td');
    const deleteButton = document.createElement('button');
    deleteButton.textContent = "Xóa";
    deleteButton.onclick = function() {
        tableBody.removeChild(newRow);
        updateBaselineFilter(document.getElementById('workspace').value);
    };
    actionCell.appendChild(deleteButton);
    
    // Append all cells to row
    newRow.appendChild(signalCell);
    newRow.appendChild(interfaceCell);
    newRow.appendChild(baselineCell);
    newRow.appendChild(logicCell);
    newRow.appendChild(timestampCell);
    newRow.appendChild(actionCell);
    
    // Apply current filter if any
    const currentBaselineFilter = document.getElementById('baseline-filter').value;
    if (currentBaselineFilter && baselineValue !== currentBaselineFilter) {
        newRow.style.display = 'none';
    }
    
    tableBody.appendChild(newRow);
}

function saveData() {
    const workspaceId = document.getElementById('workspace').value;
    if (!workspaceId) return;
    
    const rows = document.querySelectorAll('#signal-interface-table tbody tr');
    const data = [];
    const currentTime = formatDateTime(new Date());
    
    rows.forEach((row, index) => {
        const rowIndex = parseInt(row.dataset.rowIndex);
        const signal = row.querySelector('td:nth-child(1) select').value;
        const interface = row.querySelector('td:nth-child(2) select').value;
        const baseline = row.querySelector('td:nth-child(3) select').value;
        const logic = row.querySelector('td:nth-child(4) textarea').value;
        const timestampCell = row.querySelector('td:nth-child(5)');
        let lastUpdated = timestampCell.textContent;
        
        if (initialStates[workspaceId] && initialStates[workspaceId][rowIndex]) {
            const initialState = initialStates[workspaceId][rowIndex];
            if (signal !== initialState.signal || 
                interface !== initialState.interface || 
                baseline !== initialState.baseline ||
                logic !== initialState.logic) {
                lastUpdated = currentTime;
                timestampCell.textContent = lastUpdated;
            }
        } else {
            lastUpdated = currentTime;
            timestampCell.textContent = lastUpdated;
        }
        
        if (signal && interface) {
            data.push({ signal, interface, baseline, logic, lastUpdated });
        }
    });
    
    workspaceData[workspaceId] = data;
    updateBaselineFilter(workspaceId);
    saveInitialState();
    
    alert('Đã lưu thành công!');
}

// Helper functions
function createSelect(options, selectedValue, placeholder) {
    const select = document.createElement('select');
    select.innerHTML = `<option value="">${placeholder}</option>`;
    
    options.forEach(option => {
        const optElement = document.createElement('option');
        optElement.value = option;
        optElement.textContent = option;
        if (option === selectedValue) {
            optElement.selected = true;
        }
        select.appendChild(optElement);
    });
    
    return select;
}

function formatDateTime(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}