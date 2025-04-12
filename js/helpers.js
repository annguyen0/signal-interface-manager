export function createSelect(options, selectedValue, placeholder) {
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

export function formatDateTime(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}