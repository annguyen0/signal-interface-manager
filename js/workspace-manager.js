import { workspaceData, state } from './config.js';
import { updateBaselineFilter, resetFilter } from './filter-manager.js';
import { addRowWithData, saveInitialState } from './table-manager.js';
import { showToast, closeCreateWorkspaceModal } from './ui-manager.js';
import { formatDateTime } from './helpers.js';

// Workspace management functions
export function loadWorkspaces() {
    // Kiểm tra nếu có dữ liệu được lưu trong localStorage
    const savedWorkspaces = localStorage.getItem('workspaceData');
    const savedNextId = localStorage.getItem('nextWorkspaceId');
    
    if (savedWorkspaces) {
        Object.assign(workspaceData, JSON.parse(savedWorkspaces));
    }
    
    if (savedNextId) {
        state.nextWorkspaceId = parseInt(savedNextId);
    }
    
    // Cập nhật danh sách workspace trong select box
    updateWorkspaceList();
}

export function updateWorkspaceList() {
    const workspaceSelect = document.getElementById('workspace');
    const selectedValue = workspaceSelect.value;
    
    // Lưu lại option đầu tiên (-- Chọn Workspace --)
    const firstOption = workspaceSelect.options[0];
    workspaceSelect.innerHTML = '';
    workspaceSelect.appendChild(firstOption);
    
    // Thêm các workspace vào select box
    for (const workspaceId in workspaceData) {
        const option = document.createElement('option');
        option.value = workspaceId;
        option.textContent = workspaceId;        
        workspaceSelect.appendChild(option);
    }
    
    // Khôi phục lại giá trị đã chọn trước đó
    if (selectedValue && workspaceData[selectedValue]) {
        workspaceSelect.value = selectedValue;
    }
}

export function createNewWorkspace() {
    const nameInput = document.getElementById('new-workspace-name');
    const errorElement = document.getElementById('workspace-error');
    const workspaceName = nameInput.value.trim();
    
    // Validate tên workspace
    if (!workspaceName) {
        errorElement.textContent = 'Vui lòng nhập tên cho workspace mới.';
        return;
    }
    
    // Tạo ID cho workspace mới
    const newWorkspaceId = workspaceName;
    state.nextWorkspaceId++;
    
    // Thêm workspace mới vào dữ liệu
    workspaceData[newWorkspaceId] = [];
    
    // Lưu dữ liệu vào localStorage
    saveWorkspacesToStorage();
    
    // Cập nhật danh sách workspace
    updateWorkspaceList();
    
    // Chọn workspace vừa tạo
    document.getElementById('workspace').value = newWorkspaceId;
    document.getElementById('workspace').dispatchEvent(new Event('change'));
    
    // Đóng modal
    closeCreateWorkspaceModal();
    showToast(`Đã tạo workspace ${workspaceName} thành công`, 'success');
}

export function saveWorkspacesToStorage() {
    localStorage.setItem('workspaceData', JSON.stringify(workspaceData));
    localStorage.setItem('nextWorkspaceId', state.nextWorkspaceId.toString());
}

export function handleWorkspaceChange() {
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
            addRowWithData('', '', '', '', '', 0);
        }
        
        saveInitialState();
    } else {
        contentDiv.style.display = 'none';
    }
}

export function saveData() {
    const workspaceId = document.getElementById('workspace').value;
    if (!workspaceId) return;
    
    const rows = document.querySelectorAll('#signal-interface-table tbody tr');
    const data = [];
    const currentTime = formatDateTime(new Date());
    
    rows.forEach((row, index) => {
        const rowIndex = parseInt(row.dataset.rowIndex);
        const signal = row.querySelector('td:nth-child(1) select').value;
        const aswif = row.querySelector('td:nth-child(2) select').value;
        const baseline = row.querySelector('td:nth-child(3) select').value;
        const logic = row.querySelector('td:nth-child(4) textarea').value;
        const timestampCell = row.querySelector('td:nth-child(5)');
        let lastUpdated = timestampCell.textContent;
        
        if (state.initialStates[workspaceId] && state.initialStates[workspaceId][rowIndex]) {
            const initialState = state.initialStates[workspaceId][rowIndex];
            if (signal !== initialState.signal || 
                aswif !== initialState.interface || 
                baseline !== initialState.baseline ||
                logic !== initialState.logic) {
                lastUpdated = currentTime;
                timestampCell.textContent = lastUpdated;
            }
        } else {
            lastUpdated = currentTime;
            timestampCell.textContent = lastUpdated;
        }
        
        if (signal && aswif) {
            data.push({ signal, ['interface']: aswif, baseline, logic, lastUpdated });
        }
    });
    
    workspaceData[workspaceId] = data;
    updateBaselineFilter(workspaceId);
    saveInitialState();
    
    // Lưu dữ liệu vào localStorage
    saveWorkspacesToStorage();
    
    showToast('Đã lưu thành công!', 'success');
}