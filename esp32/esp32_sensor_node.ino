/*
  =============================================================================
  Thalir IoT — ESP32 Environmental Telemetry Node
  =============================================================================
  Board: ESP32 Dev Module / NodeMCU 32S
  Sensors:
    - Temperature & Humidity: DHT22 (or DHT11) on GPIO 4
    - Soil Moisture: Capacitive Soil Moisture Sensor v1.2 on Analog Pin VP / GPIO 36 (ADC1_CH0)
    - Light Level: LDR / Analog Light Sensor on Analog Pin VN / GPIO 39 (ADC1_CH3) or BH1750 (I2C)
  Target Backend API Endpoint:
    HTTP POST http://<YOUR_SERVER_IP>:8000/api/v1/sensors/data
  =============================================================================
*/

#include <WiFi.h>
#include <HTTPClient.h>
#include <DHT.h>
#include <ArduinoJson.h>

// --- Wi-Fi Configuration ---
const char* WIFI_SSID     = "YOUR_WIFI_SSID";
const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";

// --- Thalir FastAPI Backend URL ---
// Change to your laptop / server local IP (e.g., http://192.168.1.100:8000)
const char* BACKEND_URL = "http://192.168.1.100:8000/api/v1/sensors/data";

// --- Pin Definitions & Sensor Types ---
#define DHTPIN 4          // GPIO 4 connected to DHT22 Data pin
#define DHTTYPE DHT22     // Change to DHT11 if using DHT11 sensor
DHT dht(DHTPIN, DHTTYPE);

#define SOIL_MOISTURE_PIN 36 // GPIO 36 (ADC1_CH0 / VP pin)
#define LIGHT_SENSOR_PIN  39 // GPIO 39 (ADC1_CH3 / VN pin)
#define LED_STATUS_PIN    2  // Built-in LED for transmission status indicator

// --- Transmission Settings ---
const unsigned long TELEMETRY_INTERVAL_MS = 5000; // Send telemetry every 5 seconds
unsigned long lastSendTime = 0;

// Moisture Sensor Calibration (Tune for your specific sensor & dry/wet soil)
const int DRY_SOIL_ADC  = 3200; // ADC reading in dry air
const int WET_SOIL_ADC  = 1300; // ADC reading immersed in water

void setup() {
  Serial.begin(115200);
  delay(1000);
  
  pinMode(LED_STATUS_PIN, OUTPUT);
  digitalWrite(LED_STATUS_PIN, LOW);

  Serial.println("\n[Thalir IoT] Starting ESP32 Environmental Telemetry Node...");

  // Initialize DHT Sensor
  dht.begin();

  // Connect to Wi-Fi
  connectToWiFi();
}

void loop() {
  // Ensure Wi-Fi connection is maintained
  if (WiFi.status() != WL_CONNECTED) {
    connectToWiFi();
  }

  // Periodic Telemetry Transmission
  if (millis() - lastSendTime >= TELEMETRY_INTERVAL_MS) {
    lastSendTime = millis();
    sendTelemetryData();
  }
}

void connectToWiFi() {
  Serial.print("[Wi-Fi] Connecting to ");
  Serial.println(WIFI_SSID);
  
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    digitalWrite(LED_STATUS_PIN, !digitalRead(LED_STATUS_PIN)); // Flash LED during connection
    attempts++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    digitalWrite(LED_STATUS_PIN, HIGH);
    Serial.println("\n[Wi-Fi] Connected successfully!");
    Serial.print("[Wi-Fi] IP Address: ");
    Serial.println(WiFi.localIP());
  } else {
    digitalWrite(LED_STATUS_PIN, LOW);
    Serial.println("\n[Wi-Fi] Connection failed. Will retry next loop cycle...");
  }
}

void sendTelemetryData() {
  // Read Sensors
  float temperature = dht.readTemperature();
  float humidity    = dht.readHumidity();

  // Read Soil Moisture & map to percentage 0-100%
  int rawSoil = analogRead(SOIL_MOISTURE_PIN);
  float soilMoisture = map(rawSoil, DRY_SOIL_ADC, WET_SOIL_ADC, 0, 100);
  soilMoisture = constrain(soilMoisture, 0.0, 100.0);

  // Read Light Intensity & map to approximate Lux
  int rawLight = analogRead(LIGHT_SENSOR_PIN);
  float lightLux = map(rawLight, 0, 4095, 0, 1500);
  lightLux = constrain(lightLux, 0.0, 1500.0);

  // Handle sensor reading failures gracefully
  if (isnan(temperature) || isnan(humidity)) {
    Serial.println("[!] Failed to read from DHT sensor! Check wiring.");
    return;
  }

  Serial.printf("[Sensors] Temp: %.1f°C | Hum: %.1f%% | Soil: %.1f%% | Light: %.1f lx\n",
                temperature, humidity, soilMoisture, lightLux);

  // Construct JSON Payload
  StaticJsonDocument<200> doc;
  doc["temperature"]   = round(temperature * 10) / 10.0;
  doc["humidity"]      = round(humidity * 10) / 10.0;
  doc["soil_moisture"] = round(soilMoisture * 10) / 10.0;
  doc["light_lux"]      = round(lightLux * 10) / 10.0;

  String jsonPayload;
  serializeJson(doc, jsonPayload);

  // Send HTTP POST Request
  HTTPClient http;
  http.begin(BACKEND_URL);
  http.addHeader("Content-Type", "application/json");

  int httpResponseCode = http.POST(jsonPayload);

  if (httpResponseCode == 201 || httpResponseCode == 200) {
    Serial.printf("[HTTP] Telemetry POST successful! Response code: %d\n", httpResponseCode);
    // Quick double blink LED to signal success
    digitalWrite(LED_STATUS_PIN, LOW);
    delay(100);
    digitalWrite(LED_STATUS_PIN, HIGH);
  } else {
    Serial.printf("[HTTP] Error sending POST packet. Error code: %d\n", httpResponseCode);
  }

  http.end();
}
