// Function to save table data to local storage
// This is defined in the global scope because it causes bugs when placed elsewhere
function saveTableData() {
  console.log("Saving table data");
  const tableContent = document.getElementById('media-table-body').innerHTML;
  localStorage.setItem('gamerGrid', tableContent);
  console.log("Data saved to localStorage:", localStorage.getItem('gamerGrid'));
}

document.addEventListener('DOMContentLoaded', function() {
  (function(window, document) {
      // This contains code that should be taken care of right away
      window.onload = initialize;
      function initialize (){
        console.log('Initializing...');
          // Functions that are called immediately (get elements) go in initialize
          
          // This represents the amount of rows we want JavaScript to add in immediately
          // Since we have 1 row defined in HTML and want 10 rows by default, we want 9
          const desiredRowsCount = 9;
          if (!saveTableData.triggered) {
              for (let i = 0; i < desiredRowsCount; i++) {
                  addRow();
              }
          }

          // Add event listener to save table data whenever a cell's content changes
          // This was commented out to accommodate the manual save button, but the comment remains in case auto saving is ever implemented
          // document.getElementById('media-table-body').addEventListener('input', saveTableData);

          // Get the Score buttons
          const myScoreSelButtons = document.getElementsByClassName("score-dropdown-class"); // there are 11 of these

          // Load the table data
          loadTableData();

          // Below is my solution to a former issue of local storage not being compatible with dropdowns
          // Get all elements with the class "dropdown-item"
          const dropdownItems = document.querySelectorAll('.dropdown-item');

          // This ensures event listeners are added after loadTableData is called
          dropdownItems.forEach(item => {
              // Add event listener to each dropdown item
              item.addEventListener('click', function(event) {
                  // Find the closest row to the clicked dropdown item
                  console.log("Updating dropdown value");
                  let row = event.target.closest('tr');
                  if (row) {
                      // Find the dropdown button within the row
                      let button = row.querySelector('.dropdown-toggle');
                      if (button) {
                          // Update the button's text
                          button.innerText = event.target.innerText;
                          // Save the dropdown values
                          // This was commented out to accommodate the manual save button
                          // saveTableData();
                      }
                  }
              });
          });
      }
  })(window, document);

  function addEventListeners() {
    const tableBody = document.getElementById('media-table-body');

    // Event listener for input events on editable cells
    tableBody.addEventListener('input', function(event) {
        if (event.target.getAttribute('contenteditable') === 'true') {
            if (event.target.innerText.trim().length > 9) {
                fetchGameCover(event.target.innerText.trim(), event.target);
            }
        }
    })};

  // Function to load table data from local storage
  function loadTableData() {
      console.log("Loading table data");
      const tableContent = localStorage.getItem('gamerGrid');
      if (tableContent) {
          // Set the innerHTML of media-table-body to the loaded table content
          document.getElementById('media-table-body').innerHTML = tableContent;
          const allTableRows = document.querySelectorAll('tr')


          allTableRows[i].children[0]
        }
  }

  // IMPORTANT NOTE
  // This function may not seem important, but buttons such as the Add Row button break when it is removed
  // Please do not delete this function
  // Function to save row count
  function saveGridCount(count) {
      localStorage.setItem('gridCount', count);
  }

  // Call loadTableData when the page loads
  document.addEventListener('DOMContentLoaded', loadTableData);

  // Get the Add Row button
  let addRowButton = document.getElementById("add-row");
  let gridCount = document.getElementById('media-table-body').getElementsByTagName('tr').length;
  saveGridCount(gridCount);

  // Add event listener to the Add Row button
  addRowButton.addEventListener('click', manualAddRow);
  // Add event listener to the Add Row button (mobile)
  // addRowButton.addEventListener('touchstart', manualAddRow);

  // Get the Clear button
  let clearButton = document.getElementById("clear");

  // Add event listener to the Clear button
  clearButton.addEventListener('click', clearTable);
  // Add event listener to the Clear button (mobile)
  // clearButton.addEventListener('touchstart', clearTable);

  // Get the Save Table button
  let saveButton = document.getElementById("save");

  // Add event listener to the Save Table button
  saveButton.addEventListener('click', saveTableData);
  // Add event listener to the Save Table button (table)
  // saveButton.addEventListener('touchstart', saveTableData);

  // Get the Export button
  let exportButton = document.getElementById("export");

  // Add event listener to the Export button
  exportButton.addEventListener('click', exportTableToCSV);

  // Initialize event listeners for delete buttons
  initializeDeleteButtons();

  function initializeDeleteButtons() {
      // Event listener for Delete buttons using event delegation
      document.getElementById('media-table-body').addEventListener('click', function(event) {
          if (event.target.classList.contains('delete')) {
              deleteSpecificRow(event);
          }
      });
  }

});

function manualAddRow() {
  addRow();
  // This was removed when manual saving was added
  // saveTableData();
}

// This defines what happens when we add a row (this happens 9 times when page loads, and occurs whenever Add Row button is clicked)
function addRow() {
  // Get the table body element in which you want to add row
  let table = document.getElementById("media-table-body");
  // Create row element
  let row = document.createElement("tr");
  // Create cells
  let c1 = document.createElement("td");
  let c2 = document.createElement("td");
  let c3 = document.createElement("td");
  let c4 = document.createElement("td");
  let c5 = document.createElement("td");
  let deleteCell = document.createElement("td");

  // Insert data to cells
  c1.innerText = " ";
  c3.innerText = " ";
  c4.innerText = " ";
  c5.innerText = " ";

  // Make appropriate cells editable
  c1.setAttribute("contenteditable", "true");
  c3.setAttribute("contenteditable", "true");
  c4.setAttribute("contenteditable", "true");
  c5.setAttribute("contenteditable", "true");

  c1.addEventListener('input', function() {
    // Added to rate limit API and avoid too many fetches
    if (c1.innerText.trim().length > 9) {
        fetchGameCover(c1.innerText.trim(), c1);
    }
});

  // Create a new dropdown menu for the score
  let dropdown = document.createElement("div");
  dropdown.setAttribute("class", "dropdown");

  // Create the score button
  let button = document.createElement("button");
  button.innerText = "💭";
  button.setAttribute("class", "btn btn-secondary dropdown-toggle");
  button.setAttribute("type", "button");
  button.setAttribute("id", "dropdownMenuButton1");
  button.setAttribute("data-toggle", "dropdown");
  button.setAttribute("aria-haspopup", "true");
  button.setAttribute("aria-expanded", "false");

  // Create the dropdown menu
  let dropdownMenu = document.createElement("div");
  dropdownMenu.setAttribute("class", "dropdown-menu");

  // Define star emojis
  const stars = ["⭐", "⭐⭐", "⭐⭐⭐", "⭐⭐⭐⭐", "⭐⭐⭐⭐⭐"];

  // Create dropdown items for star ratings
  for (let i = 0; i < stars.length; i++) {
      let dropdownItem = document.createElement("button");
      dropdownItem.setAttribute("class", "dropdown-item");
      dropdownItem.setAttribute("type", "button");
      dropdownItem.setAttribute("value", i + 1); // Set value from 1 to 5
      dropdownItem.innerText = stars[i]; // Set star emoji as inner text
      dropdownMenu.appendChild(dropdownItem);
      // Add event listener to capture the selected value
      dropdownItem.addEventListener('click', function() {
          button.innerText = this.innerText; // Update button text with selected value
          // Save the selected value to a variable or perform other actions as needed
          console.log("Selected value:", this.value);
      });
  }

  // Append the dropdown menu to the dropdown
  dropdown.appendChild(dropdownMenu);

  // Append the button to the dropdown
  dropdown.appendChild(button);

  // Append the dropdown to the second cell
  c2.appendChild(dropdown);

  // Create delete button with trash icon
  let deleteButton = document.createElement("button");
  deleteButton.classList.add("delete");

  // Create and set properties for the trash icon image
  let deleteImg = document.createElement("img");
  deleteImg.src = "images/trash.png";
  deleteImg.alt = "Delete";
  deleteImg.classList.add("delete");

// Append trash icon image to delete button
deleteButton.appendChild(deleteImg);

// Append delete button to delete cell
deleteCell.appendChild(deleteButton);

  // Append cells to row
  row.appendChild(c1);
  row.appendChild(c2);
  row.appendChild(c3);
  row.appendChild(c4);
  row.appendChild(c5);
  row.appendChild(deleteCell);

  // Append row to table body
  table.appendChild(row);
}


// This defines what happens when we click the clear button.
function clearTable() {
  // Get all elements with class "score-dropdown-class"
  let buttons = document.querySelectorAll('.dropdown-toggle');

  // Iterate through each button
  buttons.forEach(button => {
      // Set the inner text of each button to "Score"
      button.innerText = "💭";
  });

  // Get the table body element
  let tableBody = document.getElementById("media-table-body");

  // Iterate through each row
  for (let i = 0; i < tableBody.rows.length; i++) {
      let row = tableBody.rows[i];

      // Iterate through each cell in the row
      for (let j = 0; j < row.cells.length; j++) {
          let cell = row.cells[j];

          // If it's not the second column or final column, clear the inner text
          if (j !== 1 && j !== row.cells.length - 1) {
              cell.innerText = "";
          }
      }
  }

  // This was commented out to accommodate the manual save button
  // saveTableData()

}

// Function to delete the last row
function deleteRow() {
  console.log('deleteRow');
  // Get the table body element
  let table = document.getElementById("media-table-body");

  // I originally had this set so that you couldn't delete all rows, but I prefer not restricting this
  table.deleteRow(-1);
  // This was commented out to accommodate the manual save button
  // saveTableData()
}


function deleteSpecificRow(event) {
  let row = event.target.closest('tr'); // Find the closest parent row
  if (row) {
    row.remove();
  }
}



function exportTableToCSV() {
  // Get the table element
  let table = document.getElementById("media-table");

  // Initialize the CSV content with headers
  let csvContent = "data:text/csv;charset=utf-8,";
  let headers = [];
  for (let i = 0; i < table.rows[0].cells.length; i++) {
      headers.push(table.rows[0].cells[i].innerText.trim());
  }
  csvContent += headers.join(",") + "\r\n";

  // Iterate over rows and cells to get the table data
  for (let i = 1; i < table.rows.length; i++) {
      let rowData = [];
      for (let j = 0; j < table.rows[i].cells.length; j++) {
          // Get the inner text of each cell and remove any commas
          let cellData = table.rows[i].cells[j].innerText.trim().replace(/,/g, "");

          // If it's the score column, convert stars to numbers
          if (j === 1) {
              cellData = cellData ? cellData.split("⭐").length - 1 : ""; // If no stars, leave cell blank
          }

          if (j === 0 && cellData === "Score") {
              cellData = "";
          }

          rowData.push(cellData);
      }
      // Concatenate row data with commas and add to CSV content
      csvContent += rowData.join(",") + "\r\n";
  }

  // Create a virtual anchor element to trigger the download
  let encodedUri = encodeURI(csvContent);
  let link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "media_masterlist.csv");
  document.body.appendChild(link); // Required for Firefox
  link.click();
}
const accessToken = '8u95975qufhpvw0tsxemj4zuzrrzfl';
const clientId = 'ca83ro33podq33xry2t7ems5x7bpw7';
const apiKey = 'r2HfUxxTtx17jyqGFQkvr4nTpwunmy602Op28jBl';

async function fetchGameCover(gameTitle, coverCell) {
  console.log(`Fetching cover for game: ${gameTitle}`);

  const gamesUrl = "https://z4lzvq8m7i.execute-api.us-west-2.amazonaws.com/production/v4/games";

  const response = await fetch(gamesUrl, {
      method: 'POST',
      headers: {
          'Client-ID': clientId,
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
          'x-api-key': apiKey // Corrected to use apiKey variable
      },
      body: `fields id, name, cover.url; search "${gameTitle}";`
  });

  if (!response.ok) {
      console.error(`API request failed: ${response.status} ${response.statusText}`);
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
      coverCell.innerHTML = "No cover found"; // Inform the user no cover was found
  }
}


function displayGameCover(coverUrl, coverCell) {
  coverCell.innerHTML = ''; // Clear previous cover if any
  const img = document.createElement('img');
  img.src = `https:${coverUrl}`;
  img.classList.add('cover');
  coverCell.appendChild(img);
  console.log('Cover displayed:', img.src);
}
