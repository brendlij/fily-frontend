// A simple script to test API connectivity
const fetch = require("node-fetch");

async function testApiConnection() {
  console.log("Testing API connectivity...");

  // Test endpoints to check
  const endpoints = [
    "/api/auth/login",
    "http://localhost:8080/api/auth/login",
    "/api/files",
    "http://localhost:8080/api/files",
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`\nTesting endpoint: ${endpoint}`);
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: "test", password: "test" }),
      });

      console.log(`Status code: ${response.status}`);
      const text = await response.text();
      console.log(
        `Response body: ${text.substring(0, 200)}${
          text.length > 200 ? "..." : ""
        }`
      );
    } catch (error) {
      console.error(`Error connecting to ${endpoint}:`, error.message);
    }
  }
}

testApiConnection().catch(console.error);
