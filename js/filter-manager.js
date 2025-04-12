import { baselines, workspaceData } from './config.js';

export function updateBaselineFilter(workspaceId) {
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

export function resetFilter() {
    document.getElementById('baseline-filter').value = '';
    const rows = document.querySelectorAll('#signal-interface-table tbody tr');
    rows.forEach(row => row.style.display = '');
}

export function handleBaselineFilterChange() {
    const baselineValue = this.value;
    const rows = document.querySelectorAll('#signal-interface-table tbody tr');
    
    rows.forEach(row => {
        const rowBaselineValue = row.querySelector('td:nth-child(3) select').value;
        row.style.display = (!baselineValue || rowBaselineValue === baselineValue) ? '' : 'none';
    });
}

export function setupSearch() {
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Tìm kiếm signal hoặc interface...';
    searchInput.id = 'search-input';
    searchInput.style.marginBottom = '15px';
    searchInput.style.padding = '10px';
    searchInput.style.width = '100%';
    searchInput.style.borderRadius = 'var(--radius-sm)';
    searchInput.style.border = '1px solid var(--gray-medium)';
    
    const contentDiv = document.getElementById('workspace-content');
    contentDiv.insertBefore(searchInput, contentDiv.firstChild);
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const rows = document.querySelectorAll('#signal-interface-table tbody tr');
        
        rows.forEach(row => {
            const signal = row.querySelector('td:nth-child(1) select').value.toLowerCase();
            const aswif = row.querySelector('td:nth-child(2) select').value.toLowerCase();
            const isVisible = signal.includes(searchTerm) || aswif.includes(searchTerm);
            row.style.display = isVisible ? '' : 'none';
        });
    });
}