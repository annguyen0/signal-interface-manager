import { signals, interfaces, baselines, workspaceData, state } from './config.js';
import { updateBaselineFilter } from './filter-manager.js';
import { showToast } from './ui-manager.js';
import { formatDateTime, createSelect } from './helpers.js';

export function addNewRow() {
    const currentTime = formatDateTime(new Date());
    addRowWithData('', '', '', '', currentTime, document.querySelectorAll('#signal-interface-table tbody tr').length);
}

export function addRowWithData(signalValue, interfaceValue, baselineValue, logicValue, lastUpdated, rowIndex) {
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
    deleteButton.className = "delete-btn";
    deleteButton.onclick = function() {
        if (confirm('Bạn có chắc chắn muốn xóa hàng này?')) {
            state.lastDeletedRow = newRow;
            state.lastDeletedRowData = {
                signal: signalSelect.value,
                interface: interfaceSelect.value,
                baseline: baselineSelect.value,
                logic: logicTextarea.value,
                lastUpdated: timestampCell.textContent
            };
            
            newRow.classList.add('fade-out');
            setTimeout(() => {
                tableBody.removeChild(newRow);
                updateBaselineFilter(document.getElementById('workspace').value);
                showToast('Đã xóa hàng. <button onclick="undoDelete()" class="undo-btn">Hoàn tác</button>', 'info');
            }, 300);
        }
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
    
    // Add highlight effect
    newRow.classList.add('highlight-row');
    setTimeout(() => {
        newRow.classList.remove('highlight-row');
    }, 2000);
    
    tableBody.appendChild(newRow);
    
    // Scroll to new row
    newRow.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

export function undoDelete() {
    if (state.lastDeletedRow && state.lastDeletedRowData) {
        addRowWithData(
            state.lastDeletedRowData.signal,
            state.lastDeletedRowData.interface,
            state.lastDeletedRowData.baseline,
            state.lastDeletedRowData.logic,
            state.lastDeletedRowData.lastUpdated,
            state.lastDeletedRow.dataset.rowIndex
        );
        showToast('Đã khôi phục hàng', 'success');
        state.lastDeletedRow = null;
        state.lastDeletedRowData = null;
    }
}

export function saveInitialState() {
    const workspaceId = document.getElementById('workspace').value;
    state.initialStates[workspaceId] = [];
    const rows = document.querySelectorAll('#signal-interface-table tbody tr');
    
    rows.forEach((row, index) => {
        state.initialStates[workspaceId][index] = {
            signal: row.querySelector('td:nth-child(1) select').value,
            interface: row.querySelector('td:nth-child(2) select').value,
            baseline: row.querySelector('td:nth-child(3) select').value,
            logic: row.querySelector('td:nth-child(4) textarea').value
        };
    });
}