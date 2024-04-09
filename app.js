document.addEventListener("DOMContentLoaded", function () {
    // Fetch the JSON data
    fetch('./input.json')
        .then(response => response.json())
        .then(data => {
            // Assigning input to the input variable
            const input = data;

            // Function to calculate distance between two points
            function calculateDistance(point1, point2) {
                const dx = point1.x - point2.x;
                const dy = point1.y - point2.y;
                return Math.sqrt(dx ** 2 + dy ** 2);
            }

            // Function to find the closest warehouse to a given customer
            function findClosestWarehouse(customer, warehouses) {
                let minDistance = Infinity;
                let closestWarehouse = null;

                for (const warehouse of warehouses) {
                    const distance = calculateDistance(customer.coordinates, warehouse);
                    if (distance < minDistance) {
                        minDistance = distance;
                        closestWarehouse = warehouse;
                    }
                }

                return closestWarehouse;
            }

            // Function to calculate delivery time for all orders
            function calculateDeliveryTime(input) {
                const { warehouses, customers, orders } = input;
                const droneSpeed = 1; // Assuming constant speed

                let totalTime = 0;
                let dronesUsed = 0;

                for (const order of orders) {
                    const customer = customers.find(c => c.id === order.customerId);
                    const closestWarehouse = findClosestWarehouse(customer, warehouses);
                    const distanceToWarehouse = calculateDistance(closestWarehouse, customer.coordinates);
                    const deliveryTime = distanceToWarehouse / droneSpeed; // in minutes
                    totalTime += deliveryTime;
                    dronesUsed++;
                }

                // Calculate average delivery time
                const averageDeliveryTime = totalTime / dronesUsed;

                return { totalTime, dronesUsed, averageDeliveryTime };
            }

            // Function to calculate total charging time for all drones
            function calculateChargingTime(input) {
                const { typesOfDrones } = input;
                let totalChargingTime = 0;

                // Calculate total charging time for all drones
                typesOfDrones.forEach(drone => {
                    const capacity = parseFloat(drone.capacity);
                    const consumption = parseFloat(drone.consumption);
                    const chargingTime = Math.ceil(capacity / consumption) * 20; // Charging time per drone
                    totalChargingTime += chargingTime;
                });

                return totalChargingTime;
            }

            // Function to add a new order to the input data
            function addOrder(order) {
                input.orders.push(order);
            }

            const customerIdButton = document.getElementById("customerIdButton");
            customerIdButton.addEventListener("click", function () {
                const customerIdInput = document.getElementById("customerId");
                const customId = Number(customerIdInput.value);
                const newOrder = { customerId: customId };
                addOrder(newOrder);
                customerIdInput.value = "";
            });

            // Function to simulate real-time program output
            async function simulateRealTimeProgramOutput(input, millisecondsPerProgramMinute) {
                return new Promise(resolve => {
                    let currentTime = 0;
                    let currentOrderIndex = 0;

                    const interval = setInterval(async () => {
                        if (currentTime % millisecondsPerProgramMinute === 0) {
                            const currentOrder = input.orders[currentOrderIndex];
                            const outputElement = document.getElementById("output");
                            outputElement.innerHTML += `Current time: ${currentTime} ms - Delivering order: ${JSON.stringify(currentOrder)} <br>`;
                            currentOrderIndex++;
                            if (currentOrderIndex >= input.orders.length) {
                                clearInterval(interval);
                                resolve();
                            }
                        }
                        currentTime += millisecondsPerProgramMinute;
                    }, millisecondsPerProgramMinute);
                });
            }

            // Handle click event for the calculateDeliveryTimeButton button
            const calculateDeliveryTimeButton = document.getElementById("calculateDeliveryTimeButton");

            calculateDeliveryTimeButton.addEventListener("click", async function () {
                // Calculate total time and average delivery time
                const { totalTime, dronesUsed, averageDeliveryTime } = calculateDeliveryTime(input);

                // Calculate total charging time for all drones
                const totalChargingTime = calculateChargingTime(input);

                // Display output in div
                const outputElement = document.getElementById("output");
                outputElement.innerHTML += `Total Time: ${parseInt(totalTime)} minutes <br>Drones Used: ${dronesUsed} <br>Average Delivery Time: ${parseInt(averageDeliveryTime)} minutes per order <br>Total charging time for all drones: ${totalChargingTime} minutes <br>`;

                // Simulate real-time program output
                await simulateRealTimeProgramOutput(input, 1000); // Milliseconds per program minute
            });

            document.getElementById("logo").addEventListener("click", function () {
                location.reload();
            });

            document.getElementById("title").addEventListener("click", function () {
                location.reload();
            });
            document.getElementById("clearButton").addEventListener("click", function () {
                location.reload();
            });

            window.onload = function () {
                const title = document.getElementById("title");
                title.classList.add("animated");
            };
        })

        .catch(error => {
            console.error('Error fetching JSON:', error);
        });
});
