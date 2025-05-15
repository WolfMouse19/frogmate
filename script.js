// Data storage
const appData = {
    settings: {
        invoicePrefix: 'INV-',
        nextInvoiceNumber: 1,
        vatRate: 20,
        paymentTerms: 30,
        fromCompany: '',
        fromName: '',
        fromAddress: '',
        fromEmail: '',
        fromPhone: '',
        defaultLogo: null,
        taxYearStartMonth: 4,  // April
        taxYearStartDay: 6,    // 6th
        taxYearEndMonth: 4,    // April
        taxYearEndDay: 5       // 5th
    },
    invoices: [],
    contacts: [],
    currentInvoice: null,
    currentContact: null
};

// Local Storage Functions
function saveToLocalStorage() {
    try {
        // Save settings without the logo (handle separately)
        const settingsForStorage = {...appData.settings};
        const logoData = settingsForStorage.defaultLogo;
        delete settingsForStorage.defaultLogo;
        
        localStorage.setItem('invoiceAppSettings', JSON.stringify(settingsForStorage));
        localStorage.setItem('invoiceAppInvoices', JSON.stringify(appData.invoices));
        localStorage.setItem('invoiceAppContacts', JSON.stringify(appData.contacts));
        
        // Store logo separately if it exists (it can be large)
        if (logoData) {
            localStorage.setItem('invoiceAppLogo', logoData);
        }
        
        console.log('Data saved to local storage');
    } catch (error) {
        console.error('Error saving to local storage:', error);
        // If localStorage is full, try without the logo
        try {
            const settingsForStorage = {...appData.settings};
            delete settingsForStorage.defaultLogo;
            
            localStorage.setItem('invoiceAppSettings', JSON.stringify(settingsForStorage));
            localStorage.setItem('invoiceAppInvoices', JSON.stringify(appData.invoices));
            localStorage.setItem('invoiceAppContacts', JSON.stringify(appData.contacts));
            
            console.log('Data saved to local storage (without logo)');
            alert('Warning: Your logo was not saved due to storage limitations.');
        } catch (fallbackError) {
            console.error('Error in fallback save:', fallbackError);
            alert('Unable to save your data. Local storage might be full.');
        }
    }
}

function loadFromLocalStorage() {
    try {
        // Load settings
        const storedSettings = localStorage.getItem('invoiceAppSettings');
        if (storedSettings) {
            Object.assign(appData.settings, JSON.parse(storedSettings));
        }
        
        // Load logo separately
        const storedLogo = localStorage.getItem('invoiceAppLogo');
        if (storedLogo) {
            appData.settings.defaultLogo = storedLogo;
        }
        
        // Load invoices
        const storedInvoices = localStorage.getItem('invoiceAppInvoices');
        if (storedInvoices) {
            appData.invoices = JSON.parse(storedInvoices);
        }
        
        // Load contacts
        const storedContacts = localStorage.getItem('invoiceAppContacts');
        if (storedContacts) {
            appData.contacts = JSON.parse(storedContacts);
        }
        
        console.log('Data loaded from local storage');
    } catch (error) {
        console.error('Error loading from local storage:', error);
    }
}

// Dark mode detection
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.classList.add('dark');
}
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
    if (event.matches) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
});

// DOM Elements
const elements = {
    tabs: document.querySelectorAll('[data-tab]'),
    tabPanels: document.querySelectorAll('.tab-panel'),
    
    // Invoice form elements
    invoiceForm: document.getElementById('invoiceForm'),
    invoicePrefix: document.getElementById('invoicePrefix'),
    invoiceNumber: document.getElementById('invoiceNumber'),
    invoiceDate: document.getElementById('invoiceDate'),
    dueDate: document.getElementById('dueDate'),
    primaryLanguage: document.getElementById('primaryLanguage'),
    logoUpload: document.getElementById('logoUpload'),
    logoPreview: document.getElementById('logoPreview'),
    
    fromCompany: document.getElementById('fromCompany'),
    fromName: document.getElementById('fromName'),
    fromAddress: document.getElementById('fromAddress'),
    fromEmail: document.getElementById('fromEmail'),
    fromPhone: document.getElementById('fromPhone'),
    
    toCompany: document.getElementById('toCompany'),
    toName: document.getElementById('toName'),
    toAddress: document.getElementById('toAddress'),
    toEmail: document.getElementById('toEmail'),
    toPhone: document.getElementById('toPhone'),
    
    invoiceItems: document.getElementById('invoiceItems'),
    addItemBtn: document.getElementById('addItemBtn'),
    notes: document.getElementById('notes'),
    vatRate: document.getElementById('vatRate'),
    subtotal: document.getElementById('subtotal'),
    vat: document.getElementById('vat'),
    total: document.getElementById('total'),
    
    saveInvoiceBtn: document.getElementById('saveInvoiceBtn'),
    printInvoiceBtn: document.getElementById('printInvoiceBtn'),
    invoicePreview: document.getElementById('invoicePreview'),
    
    // Invoice history elements
    exportAllInvoicesBtn: document.getElementById('exportAllInvoicesBtn'),
    importInvoicesInput: document.getElementById('importInvoicesInput'),
    invoiceSearchInput: document.getElementById('invoiceSearchInput'),
    invoiceHistoryList: document.getElementById('invoiceHistoryList'),
    
    // Address book elements
    addContactBtn: document.getElementById('addContactBtn'),
    contactSearchInput: document.getElementById('contactSearchInput'),
    contactsList: document.getElementById('contactsList'),
    
    // Settings elements
    defaultInvoicePrefix: document.getElementById('defaultInvoicePrefix'),
    defaultVatRate: document.getElementById('defaultVatRate'),
    defaultPaymentTerms: document.getElementById('defaultPaymentTerms'),
    defaultFromCompany: document.getElementById('defaultFromCompany'),
    defaultFromName: document.getElementById('defaultFromName'),
    defaultFromAddress: document.getElementById('defaultFromAddress'),
    defaultFromEmail: document.getElementById('defaultFromEmail'),
    defaultFromPhone: document.getElementById('defaultFromPhone'),
    defaultLogoUpload: document.getElementById('defaultLogoUpload'),
    defaultLogoPreview: document.getElementById('defaultLogoPreview'),
    saveSettingsBtn: document.getElementById('saveSettingsBtn'),
    
    // Client selection modal
    selectClientBtn: document.getElementById('selectClientBtn'),
    clientModal: document.getElementById('clientModal'),
    closeClientModalBtn: document.getElementById('closeClientModalBtn'),
    clientSearchInput: document.getElementById('clientSearchInput'),
    clientModalList: document.getElementById('clientModalList'),
    
    // Contact form modal
    contactFormModal: document.getElementById('contactFormModal'),
    contactFormTitle: document.getElementById('contactFormTitle'),
    contactForm: document.getElementById('contactForm'),
    contactId: document.getElementById('contactId'),
    contactCompany: document.getElementById('contactCompany'),
    contactName: document.getElementById('contactName'),
    contactAddress: document.getElementById('contactAddress'),
    contactEmail: document.getElementById('contactEmail'),
    contactPhone: document.getElementById('contactPhone'),
    closeContactModalBtn: document.getElementById('closeContactModalBtn'),
    cancelContactBtn: document.getElementById('cancelContactBtn'),
    saveContactBtn: document.getElementById('saveContactBtn'),
    
    // Delete confirmation modal
    deleteConfirmModal: document.getElementById('deleteConfirmModal'),
    deleteConfirmTitle: document.getElementById('deleteConfirmTitle'),
    deleteConfirmText: document.getElementById('deleteConfirmText'),
    cancelDeleteBtn: document.getElementById('cancelDeleteBtn'),
    confirmDeleteBtn: document.getElementById('confirmDeleteBtn'),
    
    // Loading indicator
    loadingIndicator: document.getElementById('loadingIndicator'),
    loadingText: document.getElementById('loadingText')
};

// Tax year functions
function getTaxYearForDate(date) {
    const dateObj = new Date(date);
    const day = dateObj.getDate();
    const month = dateObj.getMonth() + 1; // JavaScript months are 0-indexed
    const year = dateObj.getFullYear();
    
    // Get tax year settings
    const startMonth = appData.settings.taxYearStartMonth;
    const startDay = appData.settings.taxYearStartDay;
    const endMonth = appData.settings.taxYearEndMonth;
    const endDay = appData.settings.taxYearEndDay;
    
    // Determine if the date is before or after the tax year start
    let taxYearStart, taxYearEnd;
    
    // Check if date is before tax year start in current calendar year
    if (month < startMonth || (month === startMonth && day < startDay)) {
        taxYearStart = `${year-1}-${startMonth.toString().padStart(2, '0')}-${startDay.toString().padStart(2, '0')}`;
        taxYearEnd = `${year}-${endMonth.toString().padStart(2, '0')}-${endDay.toString().padStart(2, '0')}`;
        return `${year-1}/${year}`;
    } else {
        taxYearStart = `${year}-${startMonth.toString().padStart(2, '0')}-${startDay.toString().padStart(2, '0')}`;
        taxYearEnd = `${year+1}-${endMonth.toString().padStart(2, '0')}-${endDay.toString().padStart(2, '0')}`;
        return `${year}/${year+1}`;
    }
}

function populateMonthDays(monthElement, dayElement) {
    const monthValue = parseInt(monthElement.value);
    const currentDay = parseInt(dayElement.value) || 1;
    
    // Determine days in month
    let daysInMonth;
    if ([4, 6, 9, 11].includes(monthValue)) {
        daysInMonth = 30;
    } else if (monthValue === 2) {
        // February - simplified, doesn't account for leap years
        daysInMonth = 29;
    } else {
        daysInMonth = 31;
    }
    
    // Generate day options
    dayElement.innerHTML = '';
    for (let i = 1; i <= daysInMonth; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        dayElement.appendChild(option);
    }
    
    // Restore selected day if valid
    if (currentDay <= daysInMonth) {
        dayElement.value = currentDay;
    }
}

function getAllTaxYears() {
    // Get unique tax years from invoices
    const taxYears = new Set();
    
    appData.invoices.forEach(invoice => {
        if (invoice.invoiceDate) {
            const taxYear = getTaxYearForDate(invoice.invoiceDate);
            taxYears.add(taxYear);
        }
    });
    
    // Get current tax year if no invoices exist
    if (taxYears.size === 0) {
        const currentTaxYear = getTaxYearForDate(new Date());
        taxYears.add(currentTaxYear);
    }
    
    // Convert to array and sort
    return Array.from(taxYears).sort();
}

function generateTaxYearReport(taxYear) {
    // Parse tax year string into start/end years
    const [startYear, endYear] = taxYear.split('/');
    
    // Get tax year settings
    const startMonth = appData.settings.taxYearStartMonth;
    const startDay = appData.settings.taxYearStartDay;
    const endMonth = appData.settings.taxYearEndMonth;
    const endDay = appData.settings.taxYearEndDay;
    
    // Create date range for tax year
    const taxYearStart = new Date(`${startYear}-${startMonth.toString().padStart(2, '0')}-${startDay.toString().padStart(2, '0')}`);
    const taxYearEnd = new Date(`${endYear}-${endMonth.toString().padStart(2, '0')}-${endDay.toString().padStart(2, '0')}`);
    
    // Filter invoices for this tax year
    const taxYearInvoices = appData.invoices.filter(invoice => {
        const invoiceDate = new Date(invoice.invoiceDate);
        return invoiceDate >= taxYearStart && invoiceDate <= taxYearEnd;
    });
    
    // Calculate totals
    let subtotal = 0;
    let vatTotal = 0;
    let total = 0;
    
    // Client analysis
    const clientRevenue = {};
    const uniqueClients = new Set();
    
    // Monthly breakdown
    const monthlyData = {};
    
    // Process each invoice
    taxYearInvoices.forEach(invoice => {
        subtotal += invoice.subtotal || 0;
        vatTotal += invoice.vat || 0;
        total += invoice.total || 0;
        
        // Client tracking
        const clientName = invoice.toCompany || invoice.toName || 'Unknown';
        uniqueClients.add(clientName);
        
        if (!clientRevenue[clientName]) {
            clientRevenue[clientName] = 0;
        }
        clientRevenue[clientName] += invoice.total || 0;
        
        // Monthly tracking
        const invoiceDate = new Date(invoice.invoiceDate);
        const monthKey = `${invoiceDate.getFullYear()}-${(invoiceDate.getMonth() + 1).toString().padStart(2, '0')}`;
        const monthName = invoiceDate.toLocaleString('default', { month: 'long', year: 'numeric' });
        
        if (!monthlyData[monthKey]) {
            monthlyData[monthKey] = {
                name: monthName,
                invoiceCount: 0,
                subtotal: 0,
                vat: 0,
                total: 0
            };
        }
        
        monthlyData[monthKey].invoiceCount++;
        monthlyData[monthKey].subtotal += invoice.subtotal || 0;
        monthlyData[monthKey].vat += invoice.vat || 0;
        monthlyData[monthKey].total += invoice.total || 0;
    });
    
    // Find top client
    let topClient = 'None';
    let topClientRevenue = 0;
    
    for (const [client, revenue] of Object.entries(clientRevenue)) {
        if (revenue > topClientRevenue) {
            topClient = client;
            topClientRevenue = revenue;
        }
    }
    
    // Format date range for display
    const formatDate = date => {
        return date.toLocaleDateString('en-GB', { 
            day: 'numeric', 
            month: 'short', 
            year: 'numeric' 
        });
    };
    
    // Return report data
    return {
        taxYear,
        dateRange: {
            start: formatDate(taxYearStart),
            end: formatDate(taxYearEnd)
        },
        invoiceCount: taxYearInvoices.length,
        totals: {
            subtotal,
            vat: vatTotal,
            total
        },
        clients: {
            count: uniqueClients.size,
            top: topClient,
            topRevenue: topClientRevenue
        },
        monthly: Object.values(monthlyData).sort((a, b) => {
            // Sort by date
            const dateA = new Date(a.name);
            const dateB = new Date(b.name);
            return dateA - dateB;
        })
    };
}

function updateTaxYearReportUI(report) {
    // Update summary
    document.getElementById('reportTaxYearLabel').textContent = `Tax Year: ${report.taxYear}`;
    document.getElementById('reportDateRange').textContent = `${report.dateRange.start} - ${report.dateRange.end}`;
    document.getElementById('reportTotalInvoices').textContent = report.invoiceCount;
    
    // Update revenue
    document.getElementById('reportTotalRevenue').textContent = formatCurrency(report.totals.total);
    document.getElementById('reportSubtotal').textContent = formatCurrency(report.totals.subtotal);
    document.getElementById('reportVatCollected').textContent = formatCurrency(report.totals.vat);
    
    // Update client overview
    document.getElementById('reportTopClient').textContent = report.clients.top;
    document.getElementById('reportTopClientRevenue').textContent = formatCurrency(report.clients.topRevenue);
    document.getElementById('reportUniqueClients').textContent = report.clients.count;
    
    // Update monthly breakdown
    const monthlyBreakdown = document.getElementById('monthlyBreakdown');
    monthlyBreakdown.innerHTML = '';
    
    if (report.monthly.length === 0) {
        monthlyBreakdown.innerHTML = `
            <tr>
                <td colspan="5" class="py-4 text-center text-gray-500">No data available for this tax year</td>
            </tr>
        `;
        return;
    }
    
    report.monthly.forEach(month => {
        const row = document.createElement('tr');
        row.classList.add('border-b', 'dark:border-gray-700');
        
        row.innerHTML = `
            <td class="py-2 px-4">${month.name}</td>
            <td class="py-2 px-4 text-right">${month.invoiceCount}</td>
            <td class="py-2 px-4 text-right">${formatCurrency(month.subtotal)}</td>
            <td class="py-2 px-4 text-right">${formatCurrency(month.vat)}</td>
            <td class="py-2 px-4 text-right">${formatCurrency(month.total)}</td>
        `;
        
        monthlyBreakdown.appendChild(row);
    });
}

function renderTaxYearFolders() {
    const taxYears = getAllTaxYears();
    const container = document.getElementById('taxYearFolders');
    container.innerHTML = '';
    
    // Create folder UI
    const foldersDiv = document.createElement('div');
    foldersDiv.className = 'flex flex-wrap gap-2';
    
    taxYears.forEach(taxYear => {
        const folder = document.createElement('div');
        folder.className = 'p-3 bg-gray-100 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center';
        folder.setAttribute('data-tax-year', taxYear);
        
        folder.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
            </svg>
            <span>${taxYear}</span>
        `;
        
        folder.addEventListener('click', function() {
            // Filter invoices by tax year
            document.getElementById('taxYearFilter').value = taxYear;
            filterInvoicesByTaxYear(taxYear);
        });
        
        foldersDiv.appendChild(folder);
    });
    
    container.appendChild(foldersDiv);
    
    // Update tax year dropdown in history tab
    const taxYearFilter = document.getElementById('taxYearFilter');
    taxYearFilter.innerHTML = '<option value="all">All Tax Years</option>';
    
    taxYears.forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        taxYearFilter.appendChild(option);
    });
    
    // Update tax year dropdown in reports tab
    const reportTaxYear = document.getElementById('reportTaxYear');
    reportTaxYear.innerHTML = '';
    
    taxYears.forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        reportTaxYear.appendChild(option);
    });
    
    // Select current tax year
    const currentTaxYear = getTaxYearForDate(new Date());
    if (taxYears.includes(currentTaxYear)) {
        reportTaxYear.value = currentTaxYear;
    }
}

function filterInvoicesByTaxYear(taxYear) {
    if (taxYear === 'all') {
        renderInvoiceHistory();
        return;
    }
    
    // Parse tax year string into start/end years
    const [startYear, endYear] = taxYear.split('/');
    
    // Get tax year settings
    const startMonth = appData.settings.taxYearStartMonth;
    const startDay = appData.settings.taxYearStartDay;
    const endMonth = appData.settings.taxYearEndMonth;
    const endDay = appData.settings.taxYearEndDay;
    
    // Create date range for tax year
    const taxYearStart = new Date(`${startYear}-${startMonth.toString().padStart(2, '0')}-${startDay.toString().padStart(2, '0')}`);
    const taxYearEnd = new Date(`${endYear}-${endMonth.toString().padStart(2, '0')}-${endDay.toString().padStart(2, '0')}`);
    
    // Filter invoices for this tax year
    const taxYearInvoices = appData.invoices.filter(invoice => {
        const invoiceDate = new Date(invoice.invoiceDate);
        return invoiceDate >= taxYearStart && invoiceDate <= taxYearEnd;
    });
    
    renderFilteredInvoices(taxYearInvoices);
}

// Initialize application
function initApp() {
    // Load data from localStorage
    loadFromLocalStorage();
    
    // Set today's date as default
    const today = new Date();
    const formattedDate = formatDateForInput(today);
    elements.invoiceDate.value = formattedDate;
    
    // Calculate due date based on payment terms
    const dueDate = new Date(today);
    dueDate.setDate(dueDate.getDate() + appData.settings.paymentTerms);
    elements.dueDate.value = formatDateForInput(dueDate);
    
    // Set invoice prefix and number
    elements.invoicePrefix.value = appData.settings.invoicePrefix;
    elements.invoiceNumber.value = appData.settings.nextInvoiceNumber;
    
    // Set VAT rate
    elements.vatRate.value = appData.settings.vatRate;
    
    // Set your company details if available
    if (appData.settings.fromCompany) elements.fromCompany.value = appData.settings.fromCompany;
    if (appData.settings.fromName) elements.fromName.value = appData.settings.fromName;
    if (appData.settings.fromAddress) elements.fromAddress.value = appData.settings.fromAddress;
    if (appData.settings.fromEmail) elements.fromEmail.value = appData.settings.fromEmail;
    if (appData.settings.fromPhone) elements.fromPhone.value = appData.settings.fromPhone;
    
    // Set default logo if available
    if (appData.settings.defaultLogo) {
        displayLogoPreview(appData.settings.defaultLogo, elements.logoPreview);
    }
    
    // Add initial invoice item
    addInvoiceItem();
    
    // Settings form initialization
    elements.defaultInvoicePrefix.value = appData.settings.invoicePrefix;
    elements.defaultVatRate.value = appData.settings.vatRate;
    elements.defaultPaymentTerms.value = appData.settings.paymentTerms;
    elements.defaultFromCompany.value = appData.settings.fromCompany;
    elements.defaultFromName.value = appData.settings.fromName;
    elements.defaultFromAddress.value = appData.settings.fromAddress;
    elements.defaultFromEmail.value = appData.settings.fromEmail;
    elements.defaultFromPhone.value = appData.settings.fromPhone;
    
    // Load default logo if available
    if (appData.settings.defaultLogo) {
        displayLogoPreview(appData.settings.defaultLogo, elements.defaultLogoPreview);
    }
    
    // Initialize tax year day dropdowns
    const taxYearStartDay = document.getElementById('taxYearStartDay');
    const taxYearEndDay = document.getElementById('taxYearEndDay');
    const taxYearStartMonth = document.getElementById('taxYearStartMonth');
    const taxYearEndMonth = document.getElementById('taxYearEndMonth');
    
    // Set initial values from settings
    taxYearStartMonth.value = appData.settings.taxYearStartMonth;
    taxYearEndMonth.value = appData.settings.taxYearEndMonth;
    
    // Populate day dropdowns based on selected months
    populateMonthDays(taxYearStartMonth, taxYearStartDay);
    populateMonthDays(taxYearEndMonth, taxYearEndDay);
    
    // Set stored days
    taxYearStartDay.value = appData.settings.taxYearStartDay;
    taxYearEndDay.value = appData.settings.taxYearEndDay;
    
    // Add event listeners for month changes
    taxYearStartMonth.addEventListener('change', function() {
        populateMonthDays(taxYearStartMonth, taxYearStartDay);
    });
    
    taxYearEndMonth.addEventListener('change', function() {
        populateMonthDays(taxYearEndMonth, taxYearEndDay);
    });
    
    // Initial tax year report
    const reportTaxYear = document.getElementById('reportTaxYear');
    
    document.getElementById('updateTaxYearSettingsBtn').addEventListener('click', function() {
        // Update tax year settings
        appData.settings.taxYearStartMonth = parseInt(taxYearStartMonth.value);
        appData.settings.taxYearStartDay = parseInt(taxYearStartDay.value);
        appData.settings.taxYearEndMonth = parseInt(taxYearEndMonth.value);
        appData.settings.taxYearEndDay = parseInt(taxYearEndDay.value);
        
        // Save to local storage
        saveToLocalStorage();
        
        // Regenerate tax years
        renderTaxYearFolders();
        
        // Update current report
        const selectedTaxYear = reportTaxYear.value;
        if (selectedTaxYear) {
            const report = generateTaxYearReport(selectedTaxYear);
            updateTaxYearReportUI(report);
        }
        
        alert('Tax year settings updated successfully!');
    });
    
    // Tax year format radio buttons
    const ukTaxFormat = document.getElementById('ukTaxFormat');
    const customTaxFormat = document.getElementById('customTaxFormat');
    const customTaxYearSettings = document.getElementById('customTaxYearSettings');
    
    ukTaxFormat.addEventListener('change', function() {
        if (this.checked) {
            customTaxYearSettings.classList.add('hidden');
            
            // Reset to UK tax year
            appData.settings.taxYearStartMonth = 4; // April
            appData.settings.taxYearStartDay = 6; // 6th
            appData.settings.taxYearEndMonth = 4; // April
            appData.settings.taxYearEndDay = 5; // 5th
            
            // Save changes to local storage
            saveToLocalStorage();
            
            // Update UI
            taxYearStartMonth.value = 4;
            taxYearEndMonth.value = 4;
            populateMonthDays(taxYearStartMonth, taxYearStartDay);
            populateMonthDays(taxYearEndMonth, taxYearEndDay);
            taxYearStartDay.value = 6;
            taxYearEndDay.value = 5;
            
            // Regenerate tax years
            renderTaxYearFolders();
            
            // Update current report
            const selectedTaxYear = reportTaxYear.value;
            if (selectedTaxYear) {
                const report = generateTaxYearReport(selectedTaxYear);
                updateTaxYearReportUI(report);
            }
        }
    });
    
    customTaxFormat.addEventListener('change', function() {
        if (this.checked) {
            customTaxYearSettings.classList.remove('hidden');
        }
    });
    
    // Tax year dropdown change event
    reportTaxYear.addEventListener('change', function() {
        const selectedTaxYear = this.value;
        if (selectedTaxYear) {
            const report = generateTaxYearReport(selectedTaxYear);
            updateTaxYearReportUI(report);
        }
    });
    
    // Tax year filter change event
    document.getElementById('taxYearFilter').addEventListener('change', function() {
        filterInvoicesByTaxYear(this.value);
    });
    
    // Export tax report button
    document.getElementById('exportTaxReportBtn').addEventListener('click', function() {
        const selectedTaxYear = reportTaxYear.value;
        if (selectedTaxYear) {
            const report = generateTaxYearReport(selectedTaxYear);
            
            // Format data for export
            const exportData = {
                taxYear: report.taxYear,
                dateRange: report.dateRange,
                summary: {
                    invoiceCount: report.invoiceCount,
                    subtotal: report.totals.subtotal,
                    vat: report.totals.vat,
                    total: report.totals.total
                },
                clientInfo: {
                    uniqueClients: report.clients.count,
                    topClient: report.clients.top,
                    topClientRevenue: report.clients.topRevenue
                },
                monthlyBreakdown: report.monthly
            };
            
            const dataStr = JSON.stringify(exportData, null, 2);
            const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
            
            const exportFileName = `tax_report_${report.taxYear.replace('/', '-')}.json`;
            
            const linkElement = document.createElement('a');
            linkElement.setAttribute('href', dataUri);
            linkElement.setAttribute('download', exportFileName);
            linkElement.click();
        }
    });
    
    // Initialize tax year folders
    renderTaxYearFolders();
    
    // Update invoice preview
    updateInvoicePreview();
    
    // Generate initial tax report
    if (reportTaxYear.value) {
        const report = generateTaxYearReport(reportTaxYear.value);
        updateTaxYearReportUI(report);
    }
}

// Tab navigation
elements.tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const target = tab.getAttribute('data-tab');
        
        // Update tab styles
        elements.tabs.forEach(t => {
            t.classList.remove('active', 'border-primary', 'text-primary');
            t.classList.add('border-transparent', 'hover:border-gray-300', 'hover:text-gray-600');
        });
        
        tab.classList.add('active', 'border-primary', 'text-primary');
        tab.classList.remove('border-transparent', 'hover:border-gray-300', 'hover:text-gray-600');
        
        // Show selected tab panel
        elements.tabPanels.forEach(panel => {
            panel.classList.add('hidden');
        });
        
        document.getElementById(target).classList.remove('hidden');
        
        // Load data for specific tabs
        if (target === 'history') {
            renderInvoiceHistory();
        } else if (target === 'address') {
            renderContacts();
        } else if (target === 'reports') {
            // Refresh tax year report when tab is activated
            const reportTaxYear = document.getElementById('reportTaxYear');
            if (reportTaxYear.value) {
                const report = generateTaxYearReport(reportTaxYear.value);
                updateTaxYearReportUI(report);
            }
        }
    });
});

// Set active tab styling initially
document.querySelector('[data-tab="create"].active').classList.add('border-primary', 'text-primary');
document.querySelector('[data-tab="create"].active').classList.remove('border-transparent', 'hover:border-gray-300', 'hover:text-gray-600');

// Helper functions
function formatDateForInput(date) {
    return date.toISOString().split('T')[0];
}

function formatCurrency(amount) {
    return '£' + parseFloat(amount).toFixed(2);
}

function formatDateForDisplay(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

// Logo upload handling
elements.logoUpload.addEventListener('change', function(e) {
    handleLogoUpload(e.target, elements.logoPreview);
});

elements.defaultLogoUpload.addEventListener('change', function(e) {
    handleLogoUpload(e.target, elements.defaultLogoPreview);
    if (e.target.files && e.target.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            appData.settings.defaultLogo = e.target.result;
            saveToLocalStorage();
        };
        reader.readAsDataURL(e.target.files[0]);
    }
});

function handleLogoUpload(inputElement, previewElement) {
    if (inputElement.files && inputElement.files[0]) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            displayLogoPreview(e.target.result, previewElement);
        };
        
        reader.readAsDataURL(inputElement.files[0]);
    }
}

function displayLogoPreview(src, previewElement) {
    previewElement.innerHTML = '';
    const img = document.createElement('img');
    img.src = src;
    img.classList.add('h-full', 'w-full', 'object-contain');
    previewElement.appendChild(img);
}

// Invoice items management
elements.addItemBtn.addEventListener('click', addInvoiceItem);

function addInvoiceItem(description = '', quantity = 1, price = 0, originalText = '') {
    const rowId = 'item_' + Date.now();
    const row = document.createElement('tr');
    row.id = rowId;
    row.classList.add('border-b', 'dark:border-gray-700');
    
    row.innerHTML = `
        <td class="p-2">
            <input type="text" class="w-full text-base border-gray-300 dark:bg-gray-700 dark:border-gray-600 rounded item-description" 
                   value="${description}" data-original="${originalText}">
        </td>
        <td class="p-2">
            <input type="number" min="1" class="w-full text-base border-gray-300 dark:bg-gray-700 dark:border-gray-600 rounded item-quantity" 
                   value="${quantity}">
        </td>
        <td class="p-2">
            <input type="number" min="0" step="0.01" class="w-full text-base border-gray-300 dark:bg-gray-700 dark:border-gray-600 rounded item-price" 
                   value="${price}">
        </td>
        <td class="p-2 item-total">${formatCurrency(quantity * price)}</td>
        <td class="p-2">
            <button type="button" class="text-red-500 hover:text-red-700 remove-item-btn">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
            </button>
        </td>
    `;
    
    elements.invoiceItems.appendChild(row);
    
    // Add event listeners to the new row
    const descInput = row.querySelector('.item-description');
    const quantityInput = row.querySelector('.item-quantity');
    const priceInput = row.querySelector('.item-price');
    const removeBtn = row.querySelector('.remove-item-btn');
    
    // Auto-clear on first input and translation handling
    let firstInput = true;
    
    descInput.addEventListener('focus', function() {
        if (firstInput && !originalText && this.value === '') {
            // We're capturing the focus event so we don't clear any existing text
            firstInput = false; // Mark as handled for future inputs
        }
    });
    
    descInput.addEventListener('input', function() {
        if (firstInput && this.value.trim() !== '') {
            // Clear the field on first input
            this.value = '';
            firstInput = false; // Mark as handled for future inputs
        }
    });
    
    descInput.addEventListener('change', async function() {
        const itemText = this.value.trim();
        if (itemText) {
            await translateInvoiceItem(rowId, itemText);
        }
    });
    
    // Calculate item total when quantity or price changes
    [quantityInput, priceInput].forEach(input => {
        input.addEventListener('input', function() {
            updateItemTotal(row);
            updateTotals();
            updateInvoicePreview();
        });
    });
    
    // Remove item button
    removeBtn.addEventListener('click', function() {
        row.remove();
        updateTotals();
        updateInvoicePreview();
    });
    
    // Update totals
    updateTotals();
    updateInvoicePreview();
    
    // If description provided, trigger translation
    if (description && !originalText) {
        setTimeout(() => translateInvoiceItem(rowId, description), 100);
    }
    
    return row;
}

function updateItemTotal(row) {
    const quantity = parseFloat(row.querySelector('.item-quantity').value) || 0;
    const price = parseFloat(row.querySelector('.item-price').value) || 0;
    const total = quantity * price;
    
    row.querySelector('.item-total').textContent = formatCurrency(total);
}

function updateTotals() {
    let subtotalValue = 0;
    
    // Calculate subtotal
    elements.invoiceItems.querySelectorAll('tr').forEach(row => {
        const total = row.querySelector('.item-total')?.textContent;
        if (total) {
            subtotalValue += parseFloat(total.replace('£', '')) || 0;
        }
    });
    
    // Calculate VAT
    const vatRate = parseFloat(elements.vatRate.value) || 0;
    const vatValue = subtotalValue * (vatRate / 100);
    
    // Calculate total
    const totalValue = subtotalValue + vatValue;
    
    // Update display
    elements.subtotal.textContent = formatCurrency(subtotalValue);
    elements.vat.textContent = formatCurrency(vatValue);
    elements.total.textContent = formatCurrency(totalValue);
}

// VAT rate change handling
elements.vatRate.addEventListener('input', function() {
    updateTotals();
    updateInvoicePreview();
});

// Translation functionality
async function translateInvoiceItem(rowId, text) {
    const row = document.getElementById(rowId);
    if (!row) return;
    
    const descInput = row.querySelector('.item-description');
    const sourceLang = elements.primaryLanguage.value;
    const targetLang = sourceLang === 'en' ? 'pl' : 'en';
    
    // Show loading indicator
    elements.loadingIndicator.classList.remove('hidden');
    elements.loadingText.textContent = 'Translating...';
    
    try {
        // Use MyMemory Translation API (free tier - 5000 chars/day)
        const apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLang}`;
        
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        if (data && data.responseStatus === 200 && data.responseData) {
            const translatedText = data.responseData.translatedText;
            const rowToUpdate = document.getElementById(rowId);
            
            if (rowToUpdate) {
                const input = rowToUpdate.querySelector('.item-description');
                // Store original text as data attribute and update with translation
                input.dataset.original = text;
                input.value = translatedText;
                
                // Add hover class if not already present
                if (!input.classList.contains('invoice-item-hover')) {
                    input.classList.add('invoice-item-hover');
                }
            }
            
            // Update preview
            updateInvoicePreview();
        } else {
            console.error("Translation error:", data);
            alert(`Translation failed: ${data.responseDetails || 'Unknown error'}`);
        }
        
        // Hide loading indicator
        elements.loadingIndicator.classList.add('hidden');
        
    } catch (err) {
        console.error("Translation error:", err);
        alert("Translation failed. Please try again later.");
        elements.loadingIndicator.classList.add('hidden');
    }
}

// Invoice preview functionality
function updateInvoicePreview() {
    // Collect invoice data
    const invoiceData = {
        invoiceNumber: elements.invoicePrefix.value + elements.invoiceNumber.value,
        invoiceDate: elements.invoiceDate.value ? formatDateForDisplay(elements.invoiceDate.value) : '',
        dueDate: elements.dueDate.value ? formatDateForDisplay(elements.dueDate.value) : '',
        
        fromCompany: elements.fromCompany.value,
        fromName: elements.fromName.value,
        fromAddress: elements.fromAddress.value,
        fromEmail: elements.fromEmail.value,
        fromPhone: elements.fromPhone.value,
        
        toCompany: elements.toCompany.value,
        toName: elements.toName.value,
        toAddress: elements.toAddress.value,
        toEmail: elements.toEmail.value,
        toPhone: elements.toPhone.value,
        
        items: [],
        notes: elements.notes.value,
        
        subtotal: elements.subtotal.textContent,
        vatRate: elements.vatRate.value,
        vat: elements.vat.textContent,
        total: elements.total.textContent,
        
        logo: elements.logoPreview.querySelector('img')?.src
    };
    
    // Get tax year
    let taxYear = '';
    if (elements.invoiceDate.value) {
        taxYear = getTaxYearForDate(elements.invoiceDate.value);
    }
    
    // Collect items
    elements.invoiceItems.querySelectorAll('tr').forEach(row => {
        const description = row.querySelector('.item-description')?.value || '';
        const originalText = row.querySelector('.item-description')?.dataset.original || '';
        const quantity = row.querySelector('.item-quantity')?.value || '';
        const price = row.querySelector('.item-price')?.value || '';
        const total = row.querySelector('.item-total')?.textContent || '';
        
        if (description) {
            invoiceData.items.push({
                description,
                originalText,
                quantity,
                price: formatCurrency(price),
                total
            });
        }
    });
    
    // Generate preview HTML
    let previewHtml = `
        <div class="bg-white p-6 rounded-lg shadow">
            <div class="flex justify-between items-start mb-8">
                <div>
                    <h1 class="text-2xl font-bold">INVOICE</h1>
                    <p class="text-gray-700">${invoiceData.invoiceNumber}</p>
                    <p class="text-gray-700 text-sm">Tax Year: ${taxYear}</p>
                </div>
    `;
    
    // Add logo if available
    if (invoiceData.logo) {
        previewHtml += `
            <div class="w-1/4">
                <img src="${invoiceData.logo}" alt="Company Logo" class="max-h-16 object-contain ml-auto">
            </div>
        `;
    }
    
    previewHtml += `
            </div>
            
            <div class="grid grid-cols-2 gap-6 mb-8">
                <div>
                    <h2 class="text-sm font-semibold text-gray-600 mb-2">From:</h2>
                    <p class="font-bold">${invoiceData.fromCompany}</p>
                    <p>${invoiceData.fromName}</p>
                    <p class="whitespace-pre-line text-sm">${invoiceData.fromAddress}</p>
                    <p class="text-sm">${invoiceData.fromEmail}</p>
                    <p class="text-sm">${invoiceData.fromPhone}</p>
                </div>
                
                <div>
                    <h2 class="text-sm font-semibold text-gray-600 mb-2">Bill To:</h2>
                    <p class="font-bold">${invoiceData.toCompany}</p>
                    <p>${invoiceData.toName}</p>
                    <p class="whitespace-pre-line text-sm">${invoiceData.toAddress}</p>
                    <p class="text-sm">${invoiceData.toEmail}</p>
                    <p class="text-sm">${invoiceData.toPhone}</p>
                </div>
            </div>
            
            <div class="grid grid-cols-2 gap-6 mb-8">
                <div>
                    <h2 class="text-sm font-semibold text-gray-600 mb-2">Invoice Details:</h2>
                    <div class="grid grid-cols-2 gap-1 text-sm">
                        <p class="text-gray-600">Invoice Number:</p>
                        <p>${invoiceData.invoiceNumber}</p>
                        <p class="text-gray-600">Invoice Date:</p>
                        <p>${invoiceData.invoiceDate}</p>
                        <p class="text-gray-600">Due Date:</p>
                        <p>${invoiceData.dueDate}</p>
                    </div>
                </div>
                <div></div>
            </div>
            
            <table class="w-full mb-8">
                <thead>
                    <tr class="border-b border-gray-300">
                        <th class="py-2 text-left">Description</th>
                        <th class="py-2 text-right">Qty</th>
                        <th class="py-2 text-right">Price</th>
                        <th class="py-2 text-right">Total</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    // Add invoice items
    invoiceData.items.forEach(item => {
        const tooltipAttr = item.originalText ? `data-original="${item.originalText}"` : '';
        const tooltipClass = item.originalText ? 'invoice-item-hover' : '';
        
        previewHtml += `
            <tr class="border-b border-gray-200">
                <td class="py-2 ${tooltipClass}" ${tooltipAttr}>${item.description}</td>
                <td class="py-2 text-right">${item.quantity}</td>
                <td class="py-2 text-right">${item.price}</td>
                <td class="py-2 text-right">${item.total}</td>
            </tr>
        `;
    });
    
    previewHtml += `
                </tbody>
            </table>
            
            <div class="flex justify-end mb-8">
                <div class="w-1/3">
                    <div class="flex justify-between py-1">
                        <span>Subtotal:</span>
                        <span>${invoiceData.subtotal}</span>
                    </div>
                    <div class="flex justify-between py-1">
                        <span>VAT (${invoiceData.vatRate}%):</span>
                        <span>${invoiceData.vat}</span>
                    </div>
                    <div class="flex justify-between py-1 font-bold border-t border-gray-300 mt-2 pt-2">
                        <span>Total:</span>
                        <span>${invoiceData.total}</span>
                    </div>
                </div>
            </div>
    `;
    
    // Add notes if available
    if (invoiceData.notes) {
        previewHtml += `
            <div class="mb-4">
                <h2 class="text-sm font-semibold text-gray-600 mb-2">Notes:</h2>
                <p class="text-sm whitespace-pre-line">${invoiceData.notes}</p>
            </div>
        `;
    }
    
    previewHtml += `
        </div>
    `;
    
    elements.invoicePreview.innerHTML = previewHtml;
}

// Save invoice functionality
elements.saveInvoiceBtn.addEventListener('click', function() {
    saveCurrentInvoice();
});

function saveCurrentInvoice() {
    // Collect invoice data
    const invoiceData = {
        id: appData.currentInvoice ? appData.currentInvoice.id : Date.now(),
        invoicePrefix: elements.invoicePrefix.value,
        invoiceNumber: elements.invoiceNumber.value,
        invoiceDate: elements.invoiceDate.value,
        dueDate: elements.dueDate.value,
        primaryLanguage: elements.primaryLanguage.value,
        
        logo: elements.logoPreview.querySelector('img')?.src,
        
        fromCompany: elements.fromCompany.value,
        fromName: elements.fromName.value,
        fromAddress: elements.fromAddress.value,
        fromEmail: elements.fromEmail.value,
        fromPhone: elements.fromPhone.value,
        
        toCompany: elements.toCompany.value,
        toName: elements.toName.value,
        toAddress: elements.toAddress.value,
        toEmail: elements.toEmail.value,
        toPhone: elements.toPhone.value,
        
        items: [],
        notes: elements.notes.value,
        vatRate: elements.vatRate.value,
        
        createdAt: appData.currentInvoice ? appData.currentInvoice.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        
        // Add paid status - default to false for new invoices, keep existing status for edited ones
        paid: appData.currentInvoice ? appData.currentInvoice.paid || false : false,
        
        // Add tax year
        taxYear: getTaxYearForDate(elements.invoiceDate.value)
    };
    
    // Collect items
    elements.invoiceItems.querySelectorAll('tr').forEach(row => {
        const description = row.querySelector('.item-description')?.value || '';
        const originalText = row.querySelector('.item-description')?.dataset.original || '';
        const quantity = parseFloat(row.querySelector('.item-quantity')?.value) || 0;
        const price = parseFloat(row.querySelector('.item-price')?.value) || 0;
        
        if (description) {
            invoiceData.items.push({
                description,
                originalText,
                quantity,
                price
            });
        }
    });
    
    // Calculate totals
    const subtotal = invoiceData.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    const vat = subtotal * (invoiceData.vatRate / 100);
    const total = subtotal + vat;
    
    invoiceData.subtotal = subtotal;
    invoiceData.vat = vat;
    invoiceData.total = total;
    
    // Save or update invoice
    const existingIndex = appData.invoices.findIndex(inv => inv.id === invoiceData.id);
    
    if (existingIndex >= 0) {
        // Update existing invoice
        appData.invoices[existingIndex] = invoiceData;
    } else {
        // Add new invoice
        appData.invoices.push(invoiceData);
        
        // Update next invoice number
        if (!appData.currentInvoice) {
            appData.settings.nextInvoiceNumber++;
        }
    }
    
    // Save to local storage
    saveToLocalStorage();
    
    // Reset current invoice
    appData.currentInvoice = null;
    
    // Show success message
    alert('Invoice saved successfully!');
    
    // Update tax year folders
    renderTaxYearFolders();
    
    // Reset form for new invoice
    resetInvoiceForm();
}

// Print invoice functionality
elements.printInvoiceBtn.addEventListener('click', function() {
    window.print();
});

// Reset invoice form
function resetInvoiceForm() {
    // Reset form to create a new invoice
    elements.invoiceNumber.value = appData.settings.nextInvoiceNumber;
    
    // Set today's date
    const today = new Date();
    elements.invoiceDate.value = formatDateForInput(today);
    
    // Calculate due date
    const dueDate = new Date(today);
    dueDate.setDate(dueDate.getDate() + appData.settings.paymentTerms);
    elements.dueDate.value = formatDateForInput(dueDate);
    
    // Clear items
    elements.invoiceItems.innerHTML = '';
    addInvoiceItem();
    
    // Clear notes
    elements.notes.value = '';
    
    // Use company details from settings
    elements.fromCompany.value = appData.settings.fromCompany || '';
    elements.fromName.value = appData.settings.fromName || '';
    elements.fromAddress.value = appData.settings.fromAddress || '';
    elements.fromEmail.value = appData.settings.fromEmail || '';
    elements.fromPhone.value = appData.settings.fromPhone || '';
    
    // Set default logo if available
    if (appData.settings.defaultLogo) {
        displayLogoPreview(appData.settings.defaultLogo, elements.logoPreview);
    } else {
        elements.logoPreview.innerHTML = '<div class="text-sm text-gray-500">No logo</div>';
    }
    
    // Update preview
    updateInvoicePreview();
}

// Load invoice data into form
function loadInvoiceIntoForm(invoice) {
    appData.currentInvoice = invoice;
    
    // Basic invoice details
    elements.invoicePrefix.value = invoice.invoicePrefix || '';
    elements.invoiceNumber.value = invoice.invoiceNumber || '';
    elements.invoiceDate.value = invoice.invoiceDate || '';
    elements.dueDate.value = invoice.dueDate || '';
    elements.primaryLanguage.value = invoice.primaryLanguage || 'en';
    
    // Logo
    if (invoice.logo) {
        displayLogoPreview(invoice.logo, elements.logoPreview);
    } else {
        elements.logoPreview.innerHTML = '<div class="text-sm text-gray-500">No logo</div>';
    }
    
    // Your details
    elements.fromCompany.value = invoice.fromCompany || '';
    elements.fromName.value = invoice.fromName || '';
    elements.fromAddress.value = invoice.fromAddress || '';
    elements.fromEmail.value = invoice.fromEmail || '';
    elements.fromPhone.value = invoice.fromPhone || '';
    
    // Client details
    elements.toCompany.value = invoice.toCompany || '';
    elements.toName.value = invoice.toName || '';
    elements.toAddress.value = invoice.toAddress || '';
    elements.toEmail.value = invoice.toEmail || '';
    elements.toPhone.value = invoice.toPhone || '';
    
    // Clear existing items
    elements.invoiceItems.innerHTML = '';
    
    // Add invoice items
    if (invoice.items && invoice.items.length > 0) {
        invoice.items.forEach(item => {
            addInvoiceItem(item.description, item.quantity, item.price, item.originalText);
        });
    } else {
        addInvoiceItem();
    }
    
    // Notes and VAT
    elements.notes.value = invoice.notes || '';
    elements.vatRate.value = invoice.vatRate || 20;
    
    // Update preview
    updateTotals();
    updateInvoicePreview();
    
    // Switch to create tab
    document.querySelector('[data-tab="create"]').click();
}

// Invoice history functions
function renderInvoiceHistory() {
    if (appData.invoices.length === 0) {
        elements.invoiceHistoryList.innerHTML = `
            <tr>
                <td colspan="7" class="py-4 text-center text-gray-500">No invoices found</td>
            </tr>
        `;
        return;
    }
    
    // Sort invoices by date (newest first)
    const sortedInvoices = [...appData.invoices].sort((a, b) => {
        return new Date(b.updatedAt) - new Date(a.updatedAt);
    });
    
    let html = '';
    
    sortedInvoices.forEach(invoice => {
        const paidClass = invoice.paid ? 'paid-invoice' : '';
        
        html += `
            <tr class="border-b dark:border-gray-700 ${paidClass}">
                <td class="py-3 px-4">${invoice.invoicePrefix}${invoice.invoiceNumber}</td>
                <td class="py-3 px-4">${formatDateForDisplay(invoice.invoiceDate)}</td>
                <td class="py-3 px-4">${getTaxYearForDate(invoice.invoiceDate)}</td>
                <td class="py-3 px-4">${invoice.toCompany || invoice.toName}</td>
                <td class="py-3 px-4">${formatCurrency(invoice.total)}</td>
                <td class="py-3 px-4">
                    <label class="inline-flex items-center cursor-pointer">
                        <input type="checkbox" class="form-checkbox h-5 w-5 text-primary rounded border-gray-300 dark:border-gray-600 focus:ring-primary dark:focus:ring-primary dark:bg-gray-700 invoice-paid-checkbox" 
                               data-id="${invoice.id}" ${invoice.paid ? 'checked' : ''}>
                    </label>
                </td>
                <td class="py-3 px-4">
                    <div class="flex space-x-2">
                        <button class="edit-invoice-btn text-blue-500 hover:text-blue-700" data-id="${invoice.id}">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                        </button>
                        <button class="delete-invoice-btn text-red-500 hover:text-red-700" data-id="${invoice.id}">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });
    
    elements.invoiceHistoryList.innerHTML = html;
    
    // Add event listeners to buttons and checkboxes
    elements.invoiceHistoryList.querySelectorAll('.edit-invoice-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const invoiceId = parseInt(this.getAttribute('data-id'));
            const invoice = appData.invoices.find(inv => inv.id === invoiceId);
            
            if (invoice) {
                loadInvoiceIntoForm(invoice);
            }
        });
    });
    
    elements.invoiceHistoryList.querySelectorAll('.delete-invoice-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const invoiceId = parseInt(this.getAttribute('data-id'));
            const invoice = appData.invoices.find(inv => inv.id === invoiceId);
            
            if (invoice) {
                showDeleteConfirmation('invoice', invoice);
            }
        });
    });
    
    // Add event listeners to paid checkboxes
    elements.invoiceHistoryList.querySelectorAll('.invoice-paid-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const invoiceId = parseInt(this.getAttribute('data-id'));
            const invoiceIndex = appData.invoices.findIndex(inv => inv.id === invoiceId);
            
            if (invoiceIndex !== -1) {
                // Update paid status
                appData.invoices[invoiceIndex].paid = this.checked;
                
                // Save to local storage
                saveToLocalStorage();
                
                // Apply or remove paid class to the row
                const row = this.closest('tr');
                if (this.checked) {
                    row.classList.add('paid-invoice');
                } else {
                    row.classList.remove('paid-invoice');
                }
            }
        });
    });
}

// Export/Import functionality
elements.exportAllInvoicesBtn.addEventListener('click', function() {
    exportAllInvoices();
});

elements.importInvoicesInput.addEventListener('change', function(e) {
    if (e.target.files && e.target.files[0]) {
        importInvoices(e.target.files[0]);
    }
});

function exportAllInvoices() {
    const dataToExport = {
        settings: appData.settings,
        invoices: appData.invoices,
        contacts: appData.contacts
    };
    
    const dataStr = JSON.stringify(dataToExport, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
    const exportFileName = 'invoice_data_' + new Date().toISOString().split('T')[0] + '.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileName);
    linkElement.click();
}

function importInvoices(file) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            const importedData = JSON.parse(e.target.result);
            
            if (importedData.settings) {
                appData.settings = importedData.settings;
            }
            
            if (importedData.invoices && Array.isArray(importedData.invoices)) {
                appData.invoices = importedData.invoices;
            }
            
            if (importedData.contacts && Array.isArray(importedData.contacts)) {
                appData.contacts = importedData.contacts;
            }
            
            // Save to local storage
            saveToLocalStorage();
            
            // Update UI
            renderInvoiceHistory();
            renderContacts();
            renderTaxYearFolders();
            
            // Update settings form
            elements.defaultInvoicePrefix.value = appData.settings.invoicePrefix;
            elements.defaultVatRate.value = appData.settings.vatRate;
            elements.defaultPaymentTerms.value = appData.settings.paymentTerms;
            elements.defaultFromCompany.value = appData.settings.fromCompany;
            elements.defaultFromName.value = appData.settings.fromName;
            elements.defaultFromAddress.value = appData.settings.fromAddress;
            elements.defaultFromEmail.value = appData.settings.fromEmail;
            elements.defaultFromPhone.value = appData.settings.fromPhone;
            
            // Update logo preview if available
            if (appData.settings.defaultLogo) {
                displayLogoPreview(appData.settings.defaultLogo, elements.defaultLogoPreview);
            }
            
            alert('Data imported successfully!');
        } catch (error) {
            console.error('Import error:', error);
            alert('Error importing data. Please check the file format.');
        }
    };
    
    reader.readAsText(file);
}

// Address book functionality
elements.addContactBtn.addEventListener('click', function() {
    openContactForm();
});

function renderContacts() {
    if (appData.contacts.length === 0) {
        elements.contactsList.innerHTML = `
            <tr>
                <td colspan="5" class="py-4 text-center text-gray-500">No contacts found</td>
            </tr>
        `;
        return;
    }
    
    // Sort contacts alphabetically by company name
    const sortedContacts = [...appData.contacts].sort((a, b) => {
        return (a.company || '').localeCompare(b.company || '');
    });
    
    let html = '';
    
    sortedContacts.forEach(contact => {
        html += `
            <tr class="border-b dark:border-gray-700">
                <td class="py-3 px-4">${contact.company || ''}</td>
                <td class="py-3 px-4">${contact.name || ''}</td>
                <td class="py-3 px-4">${contact.email || ''}</td>
                <td class="py-3 px-4">${contact.phone || ''}</td>
                <td class="py-3 px-4">
                    <div class="flex space-x-2">
                        <button class="edit-contact-btn text-blue-500 hover:text-blue-700" data-id="${contact.id}">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                        </button>
                        <button class="delete-contact-btn text-red-500 hover:text-red-700" data-id="${contact.id}">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                            </svg>
                        </button>
                        <button class="use-contact-btn text-green-500 hover:text-green-700" data-id="${contact.id}">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });
    
    elements.contactsList.innerHTML = html;
    
    // Add event listeners to buttons
    elements.contactsList.querySelectorAll('.edit-contact-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const contactId = parseInt(this.getAttribute('data-id'));
            const contact = appData.contacts.find(c => c.id === contactId);
            
            if (contact) {
                openContactForm(contact);
            }
        });
    });
    
    elements.contactsList.querySelectorAll('.delete-contact-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const contactId = parseInt(this.getAttribute('data-id'));
            const contact = appData.contacts.find(c => c.id === contactId);
            
            if (contact) {
                showDeleteConfirmation('contact', contact);
            }
        });
    });
    
    elements.contactsList.querySelectorAll('.use-contact-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const contactId = parseInt(this.getAttribute('data-id'));
            const contact = appData.contacts.find(c => c.id === contactId);
            
            if (contact) {
                useContactInInvoice(contact);
            }
        });
    });
}

function openContactForm(contact = null) {
    appData.currentContact = contact;
    
    // Set form title
    elements.contactFormTitle.textContent = contact ? 'Edit Contact' : 'Add Contact';
    
    // Reset form
    elements.contactForm.reset();
    
    // Fill form if editing
    if (contact) {
        elements.contactId.value = contact.id;
        elements.contactCompany.value = contact.company || '';
        elements.contactName.value = contact.name || '';
        elements.contactAddress.value = contact.address || '';
        elements.contactEmail.value = contact.email || '';
        elements.contactPhone.value = contact.phone || '';
    } else {
        elements.contactId.value = '';
    }
    
    // Show modal
    elements.contactFormModal.classList.remove('hidden');
}

elements.contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    saveContact();
});

function saveContact() {
    const contactData = {
        id: elements.contactId.value ? parseInt(elements.contactId.value) : Date.now(),
        company: elements.contactCompany.value,
        name: elements.contactName.value,
        address: elements.contactAddress.value,
        email: elements.contactEmail.value,
        phone: elements.contactPhone.value
    };
    
    // Save or update contact
    const existingIndex = appData.contacts.findIndex(c => c.id === contactData.id);
    
    if (existingIndex >= 0) {
        // Update existing contact
        appData.contacts[existingIndex] = contactData;
    } else {
        // Add new contact
        appData.contacts.push(contactData);
    }
    
    // Save to local storage
    saveToLocalStorage();
    
    // Reset current contact
    appData.currentContact = null;
    
    // Close modal
    elements.contactFormModal.classList.add('hidden');
    
    // Update contacts list
    renderContacts();
    
    // Update client selection modal
    renderClientSelectionList();
}

function useContactInInvoice(contact) {
    // Fill client details in invoice form
    elements.toCompany.value = contact.company || '';
    elements.toName.value = contact.name || '';
    elements.toAddress.value = contact.address || '';
    elements.toEmail.value = contact.email || '';
    elements.toPhone.value = contact.phone || '';
    
    // Switch to create tab
    document.querySelector('[data-tab="create"]').click();
    
    // Update preview
    updateInvoicePreview();
}

// Client selection modal
elements.selectClientBtn.addEventListener('click', function() {
    openClientSelectionModal();
});

function openClientSelectionModal() {
    // Render clients list
    renderClientSelectionList();
    
    // Show modal
    elements.clientModal.classList.remove('hidden');
}

function renderClientSelectionList() {
    if (appData.contacts.length === 0) {
        elements.clientModalList.innerHTML = `
            <tr>
                <td colspan="4" class="py-4 text-center text-gray-500">No clients found</td>
            </tr>
        `;
        return;
    }
    
    // Sort contacts alphabetically by company name
    const sortedContacts = [...appData.contacts].sort((a, b) => {
        return (a.company || '').localeCompare(b.company || '');
    });
    
    let html = '';
    
    sortedContacts.forEach(contact => {
        html += `
            <tr class="border-b dark:border-gray-700">
                <td class="py-3 px-4">${contact.company || ''}</td>
                <td class="py-3 px-4">${contact.name || ''}</td>
                <td class="py-3 px-4">${contact.email || ''}</td>
                <td class="py-3 px-4 text-right">
                    <button class="select-client-btn px-3 py-1 bg-primary hover:bg-primary-dark text-white rounded" data-id="${contact.id}">
                        Select
                    </button>
                </td>
            </tr>
        `;
    });
    
    elements.clientModalList.innerHTML = html;
    
    // Add event listeners to buttons
    elements.clientModalList.querySelectorAll('.select-client-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const contactId = parseInt(this.getAttribute('data-id'));
            const contact = appData.contacts.find(c => c.id === contactId);
            
            if (contact) {
                useContactInInvoice(contact);
                closeClientSelectionModal();
            }
        });
    });
}

function closeClientSelectionModal() {
    elements.clientModal.classList.add('hidden');
}

// Settings functionality
elements.saveSettingsBtn.addEventListener('click', function() {
    saveSettings();
});

function saveSettings() {
    appData.settings.invoicePrefix = elements.defaultInvoicePrefix.value;
    appData.settings.vatRate = parseFloat(elements.defaultVatRate.value) || 20;
    appData.settings.paymentTerms = parseInt(elements.defaultPaymentTerms.value) || 30;
    appData.settings.fromCompany = elements.defaultFromCompany.value;
    appData.settings.fromName = elements.defaultFromName.value;
    appData.settings.fromAddress = elements.defaultFromAddress.value;
    appData.settings.fromEmail = elements.defaultFromEmail.value;
    appData.settings.fromPhone = elements.defaultFromPhone.value;
    
    // Save to local storage
    saveToLocalStorage();
    
    // Update current form with new settings
    elements.invoicePrefix.value = appData.settings.invoicePrefix;
    elements.vatRate.value = appData.settings.vatRate;
    
    // Update company details in the invoice form
    elements.fromCompany.value = appData.settings.fromCompany;
    elements.fromName.value = appData.settings.fromName;
    elements.fromAddress.value = appData.settings.fromAddress;
    elements.fromEmail.value = appData.settings.fromEmail;
    elements.fromPhone.value = appData.settings.fromPhone;
    
    // Update logo from settings to current invoice form
    if (appData.settings.defaultLogo) {
        displayLogoPreview(appData.settings.defaultLogo, elements.logoPreview);
    }
    
    // Recalculate due date based on new payment terms
    if (elements.invoiceDate.value) {
        const invoiceDate = new Date(elements.invoiceDate.value);
        const dueDate = new Date(invoiceDate);
        dueDate.setDate(dueDate.getDate() + appData.settings.paymentTerms);
        elements.dueDate.value = formatDateForInput(dueDate);
    }
    
    // Update totals and preview
    updateTotals();
    updateInvoicePreview();
    
    alert('Settings saved successfully!');
}

// Delete confirmation modal
function showDeleteConfirmation(type, item) {
    const itemType = type.charAt(0).toUpperCase() + type.slice(1);
    const itemName = type === 'invoice' ? 
        `${item.invoicePrefix}${item.invoiceNumber}` : 
        (item.company || item.name);
    
    elements.deleteConfirmTitle.textContent = `Delete ${itemType}`;
    elements.deleteConfirmText.textContent = `Are you sure you want to delete ${itemType} "${itemName}"? This action cannot be undone.`;
    
    // Store item to delete
    elements.confirmDeleteBtn.setAttribute('data-type', type);
    elements.confirmDeleteBtn.setAttribute('data-id', item.id);
    
    // Show modal
    elements.deleteConfirmModal.classList.remove('hidden');
}

elements.confirmDeleteBtn.addEventListener('click', function() {
    const type = this.getAttribute('data-type');
    const id = parseInt(this.getAttribute('data-id'));
    
    deleteItem(type, id);
    closeDeleteConfirmModal();
});

function deleteItem(type, id) {
    if (type === 'invoice') {
        // Delete invoice
        appData.invoices = appData.invoices.filter(inv => inv.id !== id);
        renderInvoiceHistory();
        renderTaxYearFolders();
    } else if (type === 'contact') {
        // Delete contact
        appData.contacts = appData.contacts.filter(contact => contact.id !== id);
        renderContacts();
        renderClientSelectionList();
    }
    
    // Save changes to local storage
    saveToLocalStorage();
}

function closeDeleteConfirmModal() {
    elements.deleteConfirmModal.classList.add('hidden');
}

// Modal close buttons
elements.closeClientModalBtn.addEventListener('click', closeClientSelectionModal);
elements.closeContactModalBtn.addEventListener('click', function() {
    elements.contactFormModal.classList.add('hidden');
});
elements.cancelContactBtn.addEventListener('click', function() {
    elements.contactFormModal.classList.add('hidden');
});
elements.cancelDeleteBtn.addEventListener('click', closeDeleteConfirmModal);

// Search functionality
elements.invoiceSearchInput.addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    
    if (!searchTerm) {
        renderInvoiceHistory();
        return;
    }
    
    const filteredInvoices = appData.invoices.filter(invoice => {
        const invoiceNumber = invoice.invoicePrefix + invoice.invoiceNumber;
        const clientName = invoice.toCompany || invoice.toName || '';
        
        return (
            invoiceNumber.toLowerCase().includes(searchTerm) ||
            clientName.toLowerCase().includes(searchTerm) ||
            formatDateForDisplay(invoice.invoiceDate).includes(searchTerm)
        );
    });
    
    renderFilteredInvoices(filteredInvoices);
});

elements.contactSearchInput.addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    
    if (!searchTerm) {
        renderContacts();
        return;
    }
    
    const filteredContacts = appData.contacts.filter(contact => {
        return (
            (contact.company || '').toLowerCase().includes(searchTerm) ||
            (contact.name || '').toLowerCase().includes(searchTerm) ||
            (contact.email || '').toLowerCase().includes(searchTerm) ||
            (contact.phone || '').toLowerCase().includes(searchTerm)
        );
    });
    
    renderFilteredContacts(filteredContacts);
});

elements.clientSearchInput.addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    
    if (!searchTerm) {
        renderClientSelectionList();
        return;
    }
    
    const filteredContacts = appData.contacts.filter(contact => {
        return (
            (contact.company || '').toLowerCase().includes(searchTerm) ||
            (contact.name || '').toLowerCase().includes(searchTerm) ||
            (contact.email || '').toLowerCase().includes(searchTerm)
        );
    });
    
    renderFilteredClientList(filteredContacts);
});

function renderFilteredInvoices(invoices) {
    if (invoices.length === 0) {
        elements.invoiceHistoryList.innerHTML = `
            <tr>
                <td colspan="7" class="py-4 text-center text-gray-500">No matching invoices found</td>
            </tr>
        `;
        return;
    }
    
    // Sort invoices by date (newest first)
    const sortedInvoices = [...invoices].sort((a, b) => {
        return new Date(b.updatedAt) - new Date(a.updatedAt);
    });
    
    let html = '';
    
    sortedInvoices.forEach(invoice => {
        const paidClass = invoice.paid ? 'paid-invoice' : '';
        
        html += `
            <tr class="border-b dark:border-gray-700 ${paidClass}">
                <td class="py-3 px-4">${invoice.invoicePrefix}${invoice.invoiceNumber}</td>
                <td class="py-3 px-4">${formatDateForDisplay(invoice.invoiceDate)}</td>
                <td class="py-3 px-4">${getTaxYearForDate(invoice.invoiceDate)}</td>
                <td class="py-3 px-4">${invoice.toCompany || invoice.toName}</td>
                <td class="py-3 px-4">${formatCurrency(invoice.total)}</td>
                <td class="py-3 px-4">
                    <label class="inline-flex items-center cursor-pointer">
                        <input type="checkbox" class="form-checkbox h-5 w-5 text-primary rounded border-gray-300 dark:border-gray-600 focus:ring-primary dark:focus:ring-primary dark:bg-gray-700 invoice-paid-checkbox" 
                               data-id="${invoice.id}" ${invoice.paid ? 'checked' : ''}>
                    </label>
                </td>
                <td class="py-3 px-4">
                    <div class="flex space-x-2">
                        <button class="edit-invoice-btn text-blue-500 hover:text-blue-700" data-id="${invoice.id}">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                        </button>
                        <button class="delete-invoice-btn text-red-500 hover:text-red-700" data-id="${invoice.id}">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });
    
    elements.invoiceHistoryList.innerHTML = html;
    
    // Add event listeners to buttons
    elements.invoiceHistoryList.querySelectorAll('.edit-invoice-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const invoiceId = parseInt(this.getAttribute('data-id'));
            const invoice = appData.invoices.find(inv => inv.id === invoiceId);
            
            if (invoice) {
                loadInvoiceIntoForm(invoice);
            }
        });
    });
    
    elements.invoiceHistoryList.querySelectorAll('.delete-invoice-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const invoiceId = parseInt(this.getAttribute('data-id'));
            const invoice = appData.invoices.find(inv => inv.id === invoiceId);
            
            if (invoice) {
                showDeleteConfirmation('invoice', invoice);
            }
        });
    });
    
    // Add event listeners to paid checkboxes
    elements.invoiceHistoryList.querySelectorAll('.invoice-paid-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const invoiceId = parseInt(this.getAttribute('data-id'));
            const invoiceIndex = appData.invoices.findIndex(inv => inv.id === invoiceId);
            
            if (invoiceIndex !== -1) {
                // Update paid status
                appData.invoices[invoiceIndex].paid = this.checked;
                
                // Save to local storage
                saveToLocalStorage();
                
                // Apply or remove paid class to the row
                const row = this.closest('tr');
                if (this.checked) {
                    row.classList.add('paid-invoice');
                } else {
                    row.classList.remove('paid-invoice');
                }
            }
        });
    });
}

function renderFilteredContacts(contacts) {
    if (contacts.length === 0) {
        elements.contactsList.innerHTML = `
            <tr>
                <td colspan="5" class="py-4 text-center text-gray-500">No matching contacts found</td>
            </tr>
        `;
        return;
    }
    
    // Sort contacts alphabetically by company name
    const sortedContacts = [...contacts].sort((a, b) => {
        return (a.company || '').localeCompare(b.company || '');
    });
    
    let html = '';
    
    sortedContacts.forEach(contact => {
        html += `
            <tr class="border-b dark:border-gray-700">
                <td class="py-3 px-4">${contact.company || ''}</td>
                <td class="py-3 px-4">${contact.name || ''}</td>
                <td class="py-3 px-4">${contact.email || ''}</td>
                <td class="py-3 px-4">${contact.phone || ''}</td>
                <td class="py-3 px-4">
                    <div class="flex space-x-2">
                        <button class="edit-contact-btn text-blue-500 hover:text-blue-700" data-id="${contact.id}">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                        </button>
                        <button class="delete-contact-btn text-red-500 hover:text-red-700" data-id="${contact.id}">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                            </svg>
                        </button>
                        <button class="use-contact-btn text-green-500 hover:text-green-700" data-id="${contact.id}">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });
    
    elements.contactsList.innerHTML = html;
    
    // Add event listeners to buttons
    elements.contactsList.querySelectorAll('.edit-contact-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const contactId = parseInt(this.getAttribute('data-id'));
            const contact = appData.contacts.find(c => c.id === contactId);
            
            if (contact) {
                openContactForm(contact);
            }
        });
    });
    
    elements.contactsList.querySelectorAll('.delete-contact-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const contactId = parseInt(this.getAttribute('data-id'));
            const contact = appData.contacts.find(c => c.id === contactId);
            
            if (contact) {
                showDeleteConfirmation('contact', contact);
            }
        });
    });
    
    elements.contactsList.querySelectorAll('.use-contact-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const contactId = parseInt(this.getAttribute('data-id'));
            const contact = appData.contacts.find(c => c.id === contactId);
            
            if (contact) {
                useContactInInvoice(contact);
            }
        });
    });
}

function renderFilteredClientList(contacts) {
    if (contacts.length === 0) {
        elements.clientModalList.innerHTML = `
            <tr>
                <td colspan="4" class="py-4 text-center text-gray-500">No matching clients found</td>
            </tr>
        `;
        return;
    }
    
    // Sort contacts alphabetically by company name
    const sortedContacts = [...contacts].sort((a, b) => {
        return (a.company || '').localeCompare(b.company || '');
    });
    
    let html = '';
    
    sortedContacts.forEach(contact => {
        html += `
            <tr class="border-b dark:border-gray-700">
                <td class="py-3 px-4">${contact.company || ''}</td>
                <td class="py-3 px-4">${contact.name || ''}</td>
                <td class="py-3 px-4">${contact.email || ''}</td>
                <td class="py-3 px-4 text-right">
                    <button class="select-client-btn px-3 py-1 bg-primary hover:bg-primary-dark text-white rounded" data-id="${contact.id}">
                        Select
                    </button>
                </td>
            </tr>
        `;
    });
    
    elements.clientModalList.innerHTML = html;
    
    // Add event listeners to buttons
    elements.clientModalList.querySelectorAll('.select-client-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const contactId = parseInt(this.getAttribute('data-id'));
            const contact = appData.contacts.find(c => c.id === contactId);
            
            if (contact) {
                useContactInInvoice(contact);
                closeClientSelectionModal();
            }
        });
    });
}

// Initialize application
initApp();
