# Thalir — ESP32 Microcontroller Integration Guide

This guide details how to hardware-wire, configure, and flash an **ESP32 Microcontroller Board** to transmit live microclimate environmental telemetry (Temperature, Humidity, Soil Moisture, Light) to the **Thalir AI & IoT Smart Agriculture Platform**.

---

## 1. Hardware Bill of Materials (BOM)

| Component | Specification / Model | Pin / Signal | Connection to ESP32 |
| --------- | --------------------- | ------------ | ------------------- |
| **Microcontroller** | ESP32 DevKit v1 / NodeMCU-32S | - | USB Micro-B / Type-C |
| **Temp & Humidity** | DHT22 (AM2302) or DHT11 | Data | **GPIO 4** (with 10k pullup resistor) |
| **Soil Moisture** | Capacitive Soil Moisture v1.2 | Analog Out (AOUT) | **GPIO 36 (VP / ADC1_CH0)** |
| **Light Sensor** | LDR / Analog Light Module or BH1750 | Analog Out (AO) | **GPIO 39 (VN / ADC1_CH3)** |
| **Power Supply** | 5V USB / 3.3V Regulator | VCC & GND | 3.3V / VIN & GND |

---

## 2. Wiring Diagram & Pin Chart

```
ESP32 Pinout Connections:

         +-----------------------+
         |      ESP32 DEVKIT     |
         |                       |
 3V3 --->| 3.3V              GND |<--- Common Ground (GND)
         |                       |
 GPIO 4->| D4 (DHT22 Data)   VP  |<--- Capacitive Soil Moisture AOUT (GPIO 36)
         |                   VN  |<--- LDR Light Sensor AOUT (GPIO 39)
         +-----------------------+
```

---

## 3. Arduino IDE Setup Instructions

### Step 1: Install ESP32 Board Support
1. Open **Arduino IDE**.
2. Go to **File -> Preferences**.
3. Add the following URL to **Additional Boards Manager URLs**:
   `https://dl.espressif.com/dl/package_esp32_index.json`
4. Go to **Tools -> Board -> Boards Manager**, search for `esp32`, and click **Install**.

### Step 2: Install Required Libraries
Go to **Sketch -> Include Library -> Manage Libraries**, and install:
1. **DHT sensor library** (by Adafruit)
2. **Adafruit Unified Sensor** (by Adafruit)
3. **ArduinoJson** (by Benoit Blanchon — v6.x or v7.x)

---

## 4. Configuration & Flashing

1. Open `esp32_sensor_node.ino` in Arduino IDE.
2. Edit lines 17-22 with your Wi-Fi credentials and server backend URL:
   ```cpp
   const char* WIFI_SSID     = "Your_WiFi_Network";
   const char* WIFI_PASSWORD = "Your_WiFi_Password";
   const char* BACKEND_URL   = "http://192.168.1.100:8000/api/v1/sensors/data";
   ```
   > **Tip**: Replace `192.168.1.100` with the local IP address of the machine running the Thalir FastAPI backend.

3. Select your board under **Tools -> Board -> ESP32 Arduino -> ESP32 Dev Module**.
4. Select the COM Port under **Tools -> Port**.
5. Click **Upload** (Arrow icon).

---

## 5. Verifying Telemetry Transmission

1. Open **Serial Monitor** at **115200 baud**.
2. You will see Wi-Fi connection progress:
   ```text
   [Thalir IoT] Starting ESP32 Environmental Telemetry Node...
   [Wi-Fi] Connecting to Your_WiFi_Network...
   [Wi-Fi] Connected successfully!
   [Wi-Fi] IP Address: 192.168.1.145
   [Sensors] Temp: 29.4°C | Hum: 64.2% | Soil: 48.0% | Light: 840.0 lx
   [HTTP] Telemetry POST successful! Response code: 201
   ```
3. Open the **Thalir Web App** at `http://localhost:5173`.
4. Go to **Live Sensors**: your physical ESP32 data readings will display in real time!
