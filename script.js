// Function to save table data to local storage
function saveTableData() {
    console.log("Saving table data");
    const tableContent = document.getElementById('media-table-body').innerHTML;
    localStorage.setItem('gamerGrid', tableContent);
    console.log("Data saved to localStorage:", localStorage.getItem('gamerGrid'));
}

document.addEventListener('DOMContentLoaded', function() {
    (function(window, document) {
        window.onload = initialize;
        function initialize() {
            console.log('Initializing...');
            const desiredRowsCount = 10;
            if (!saveTableData.triggered) {
                for (let i = 0; i < desiredRowsCount; i++) {
                    addRow();
                }
            }

            loadTableData();

            const dropdownItems = document.querySelectorAll('.dropdown-item');
            dropdownItems.forEach(item => {
                item.addEventListener('click', function(event) {
                    console.log("Updating dropdown value");
                    let row = event.target.closest('tr');
                    if (row) {
                        let button = row.querySelector('.dropdown-toggle');
                        if (button) {
                            button.innerText = event.target.innerText;
                        }
                    }
                });
            });
        }
    })(window, document);

    function loadTableData() {
        console.log("Loading table data");
        const tableContent = localStorage.getItem('gamerGrid');
        if (tableContent) {
            document.getElementById('media-table-body').innerHTML = tableContent;
            const rows = document.querySelectorAll('#media-table-body tr');
            rows.forEach(row => {
                attachRowEventListeners(row);
            });
        }
    }

    function saveRowCount(count) {
        localStorage.setItem('rowCount', count);
    }

    document.addEventListener('DOMContentLoaded', loadTableData);

    let addRowButton = document.getElementById("add-row");
    let rowCount = document.getElementById('media-table-body').getElementsByTagName('tr').length;
    saveRowCount(rowCount);

    addRowButton.addEventListener('click', manualAddRow);

    let clearButton = document.getElementById("clear");
    clearButton.addEventListener('click', clearTable);

    let saveButton = document.getElementById("save");
    saveButton.addEventListener('click', saveTableData);

    let exportButton = document.getElementById("export");
    exportButton.addEventListener('click', exportTableToCSV);

    initializeDeleteButtons();

    function initializeDeleteButtons() {
        document.getElementById('media-table-body').addEventListener('click', function(event) {
            if (event.target.classList.contains('delete')) {
                deleteSpecificRow(event);
            }
        });
    }

    function manualAddRow() {
        addRow();
    }

    function addRow() {
        let table = document.getElementById("media-table-body");
        let row = document.createElement("tr");
        let c1 = document.createElement("td");
        let c2 = document.createElement("td");
        let c3 = document.createElement("td");
        let c4 = document.createElement("td");
        let deleteCell = document.createElement("td");

        c1.innerText = " ";
        c3.innerText = " ";
        c4.innerText = " ";

        c1.setAttribute("contenteditable", "true");
        c3.setAttribute("contenteditable", "true");
        c4.setAttribute("contenteditable", "true");

        let debounceTimeout;
        c1.addEventListener('input', function() {
            clearTimeout(debounceTimeout);
            debounceTimeout = setTimeout(() => {
                if (c1.innerText.trim().length > 4) {
                    fetchGameCover(c1.innerText.trim(), c1);
                }
            }, 2000);
        });

        let dropdown = document.createElement("div");
        dropdown.setAttribute("class", "dropdown");

        let button = document.createElement("button");
        button.innerText = "💭";
        button.setAttribute("class", "btn btn-secondary dropdown-toggle");
        button.setAttribute("type", "button");
        button.setAttribute("id", "dropdownMenuButton1");
        button.setAttribute("data-toggle", "dropdown");
        button.setAttribute("aria-haspopup", "true");
        button.setAttribute("aria-expanded", "false");

        let dropdownMenu = document.createElement("div");
        dropdownMenu.setAttribute("class", "dropdown-menu");

        const stars = ["⭐", "⭐⭐", "⭐⭐⭐", "⭐⭐⭐⭐", "⭐⭐⭐⭐⭐"];

        for (let i = 0; i < stars.length; i++) {
            let dropdownItem = document.createElement("button");
            dropdownItem.setAttribute("class", "dropdown-item");
            dropdownItem.setAttribute("type", "button");
            dropdownItem.setAttribute("value", i + 1);
            dropdownItem.innerText = stars[i];
            dropdownMenu.appendChild(dropdownItem);
            dropdownItem.addEventListener('click', function() {
                button.innerText = this.innerText;
                console.log("Selected value:", this.value);
            });
        }

        dropdown.appendChild(dropdownMenu);
        dropdown.appendChild(button);
        c2.appendChild(dropdown);

        let deleteButton = document.createElement("button");
        deleteButton.classList.add("delete");

        let deleteImg = document.createElement("img");
        deleteImg.src = "images/trash.png";
        deleteImg.alt = "Delete";
        deleteImg.classList.add("delete");

        deleteButton.appendChild(deleteImg);
        deleteCell.appendChild(deleteButton);

        row.appendChild(c1);
        row.appendChild(c2);
        row.appendChild(c3);
        row.appendChild(c4);
        row.appendChild(deleteCell);

        table.appendChild(row);
        attachRowEventListeners(row);
    }

    function clearTable() {
        let tableBody = document.getElementById("media-table-body");
        for (let i = 0; i < tableBody.rows.length; i++) {
            let row = tableBody.rows[i];
            for (let j = 0; j < row.cells.length; j++) {
                let cell = row.cells[j];
                if (!cell.querySelector('.dropdown-toggle') && !cell.querySelector('.delete')) {
                    cell.innerText = "";
                    let images = cell.querySelectorAll('img');
                    images.forEach(img => img.remove());
                } else if (cell.querySelector('.dropdown-toggle')) {
                    let button = cell.querySelector('.dropdown-toggle');
                    button.innerText = "💭";
                }
            }
        }
    }

    function deleteRow() {
        console.log('deleteRow');
        let table = document.getElementById("media-table-body");
        table.deleteRow(-1);
    }

    function deleteSpecificRow(event) {
        let row = event.target.closest('tr');
        if (row) {
            row.remove();
        }
    }

    function exportTableToCSV() {
        let table = document.getElementById("media-table");
        let csvContent = "data:text/csv;charset=utf-8,";
        let headers = [];
        for (let i = 0; i < table.rows[0].cells.length; i++) {
            headers.push(table.rows[0].cells[i].innerText.trim());
        }
        csvContent += headers.join(",") + "\r\n";
    
        for (let i = 1; i < table.rows.length; i++) {
            let rowData = [];
            for (let j = 0; j < table.rows[i].cells.length; j++) {
                let cell = table.rows[i].cells[j];
                let cellData = cell.innerText.trim().replace(/,/g, "");
                // Check for hidden text (game title)
                let hiddenText = cell.querySelector('span');
                if (hiddenText) {
                    cellData = hiddenText.innerText;  // Use the hidden text if it exists
                }
                // Convert visual stars to a numeric value
                if (cellData.includes('⭐')) {
                    cellData = (cellData.match(/⭐/g) || []).length;  // Count the stars
                }
                rowData.push(cellData);
            }
            csvContent += rowData.join(",") + "\r\n";
        }
    
        let encodedUri = encodeURI(csvContent);
        let link = document.createElement("a");
        link.style.position = 'absolute';
        link.style.left = '-9999px'; // Position link off-screen
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "media_masterlist.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link); // Remove the link immediately after clicking
    }
    

    // Not sure that this is all needed now, I might be better off leaving it out of the code
    // const accessToken = '90q372sybn6f3g05qh9u1xt0dvzvmd';
    // const clientId = 'ca83ro33podq33xry2t7ems5x7bpw7';
    // const apiKey = 'jr8s00jj5a';

    async function fetchGameCover(gameTitle, coverCell) {
        console.log(`Fetching cover for game: ${gameTitle}`);
        const gamesUrl = `https://danielledonnelly-crimsonmastodon.web.val.run/?game=${gameTitle}}`;

        try {
            const response = await fetch(gamesUrl);
            if (!response.ok) {
                console.error(`API request failed: ${response.status} ${response.statusText}`);
                coverCell.innerHTML = "Error fetching cover";
                return;
            }
            const games = await response.json();
            console.log('API response:', games);

            if (games.length > 0 && games[0].cover) {
                const coverUrl = games[0].cover.url.replace('t_thumb', 't_cover_big');
                console.log('Cover URL:', coverUrl);
                displayGameCover(coverUrl, coverCell);
            } else {
                console.log("No cover found for:", gameTitle);
                coverCell.innerHTML = "No cover found";
            }
        } catch (error) {
            console.error('Fetch error:', error);
            coverCell.innerHTML = "Error fetching cover";
        }
    }

    function displayGameCover(coverUrl, coverCell) {
        const gameTitle = coverCell.innerText.trim();  // Save the current game title before clearing the cell
        coverCell.innerHTML = '';  // Clear the cell
    
        // Create a hidden span to hold the game title text
        const titleSpan = document.createElement('span');
        titleSpan.style.display = 'none';  // Hide the span
        titleSpan.innerText = gameTitle;
        coverCell.appendChild(titleSpan);
    
        // Add the image
        const img = document.createElement('img');
        img.src = `https:${coverUrl}`;
        img.classList.add('cover');
        coverCell.appendChild(img);
        console.log('Cover displayed:', img.src);
    }
    

    function attachRowEventListeners(row) {
        const c1 = row.cells[0];
        if (c1) {
            let debounceTimeout;
            c1.addEventListener('input', function() {
                clearTimeout(debounceTimeout);
                debounceTimeout = setTimeout(() => {
                    if (c1.innerText.trim().length > 4) {
                        fetchGameCover(c1.innerText.trim(), c1);
                    }
                }, 1500);
            });
        }
        const dropdownItems = row.querySelectorAll('.dropdown-item');
        dropdownItems.forEach(item => {
            item.addEventListener('click', function(event) {
                let button = row.querySelector('.dropdown-toggle');
                if (button) {
                    button.innerText = event.target.innerText;
                }
            });
        });
    }
});
