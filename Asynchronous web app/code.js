// Waits for the DOM content to be fully loaded before executing the fetchData function
document.addEventListener("DOMContentLoaded", fetchData);

// To asynchronously fetch data from 'data.json' and display the items
async function fetchData() {
    try {
        // To fetch data from 'data.json'
        const response = await fetch('data.json');
        // To extract JSON data from the response
        const data = await response.json();
        // To display items using the fetched data
        displayItems(data);
    } catch (error) {
        // To handle errors if fetching data fails
        console.error("Error fetching data:", error);
    }
}

// Displays items from the fetched data
function displayItems(data) {
    // Gets the container where items will be displayed
    const itemsContainer = document.getElementById('items-container');
    // Creates a common category container
    const categoryContainer = document.createElement('div');
    categoryContainer.classList.add('category');
    categoryContainer.textContent = "Items"; 
    itemsContainer.appendChild(categoryContainer);

    // Loops through 'fruits' and 'vegetables' categories to display items
    ['fruits', 'vegetables'].forEach(category => {
        // Shuffles the order of items randomly
        const shuffledItems = mixItems(data[category]);
        shuffledItems.forEach(item => {
            // Creates an item element
            const itemElement = document.createElement('div');
            itemElement.textContent = item.name; // Sets item name as text content
            itemElement.classList.add('item'); // Adds 'item' class to the element
            itemElement.setAttribute('draggable', 'true'); // Enables dragging for the item
            itemElement.dataset.id = item.id; // Sets item ID as a dataset attribute
            itemElement.dataset.category = category; // Sets item category as a dataset attribute
            categoryContainer.appendChild(itemElement); // Appends item to the category container
        });
    });

    // Setup drag-and-drop functionality
    setupDragAndDrop();
}

// Shuffles the order of items randomly
function mixItems(items) {
    return items.sort(() => Math.random() - 0.5);
}

// Setup drag-and-drop functionality for items and drop zones
function setupDragAndDrop() {
    // Gets all items with the 'item' class
    const items = document.querySelectorAll('.item');
    // Adds event listener for drag start to each item
    items.forEach(item => {
        item.addEventListener('dragstart', dragStartHandler);
    });

    // Gets all drop zones with the 'dropzone' class
    const dropzones = document.querySelectorAll('.dropzone');
    // Adds event listeners for drag over and drop to each drop zone
    dropzones.forEach(dropzone => {
        dropzone.addEventListener('dragover', dragOverHandler);
        dropzone.addEventListener('drop', dropHandler);
    });
}

// Event handler for drag start
function dragStartHandler(event) {
    console.log('Drag start:', event.target.dataset.id, event.target.dataset.category);
    // Sets data to be transferred during drag-and-drop
    event.dataTransfer.setData('text/plain', event.target.dataset.id);
    event.dataTransfer.setData('category', event.target.dataset.category);
}

// Event handler for drag over
function dragOverHandler(event) {
    console.log('Drag over:', event.target.id);
    event.preventDefault(); // Prevents default behavior for drag over
}

// Event handler for drop
function dropHandler(event) {
    console.log('Drop:', event.target.id);
    event.preventDefault(); // Prevents default behavior for drop
    // Gets data transferred during drag-and-drop
    const id = event.dataTransfer.getData('text/plain');
    const category = event.dataTransfer.getData('category');
    const dropzoneCategory = event.target.id.split('-')[0]; // Gets drop zone category

    console.log('Dragged category:', category, 'Drop zone category:', dropzoneCategory);

    // Checks if the dragged item's category matches the drop zone's category
    if (category === dropzoneCategory) {
        console.log('Drop allowed');
        // Appends the dragged item to the drop zone
        event.target.appendChild(document.querySelector(`[data-id="${id}"]`));
    } else {
        console.log('Drop not allowed');
    }
}