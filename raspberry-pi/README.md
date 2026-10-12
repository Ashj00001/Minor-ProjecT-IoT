# Thalir — Raspberry Pi Hardware Integration Guide

This directory contains the production-ready Python hardware scripts to connect physical sensors and camera modules on a Raspberry Pi to the **Thalir AI & IoT Smart Agriculture Platform**.

---

## 1. Hardware Bill of Materials (BOM)

| Component | Part / Spec | Interface | Connection |
| --------- | ----------- | --------- | ---------- |
| Single Board Computer | Raspberry Pi 4 Model B (2GB/4GB) | - | - |
| Temperature & Humidity | DHT22 (AM2302) | GPIO Digital | GPIO 4 (Pin 7) |
| Soil Moisture Sensor | Capacitive Soil Moisture Sensor v1.2 | Analog (via ADS1115 ADC) | ADS1115 Channel A0 |
| Light Intensity Sensor | BH1750 Ambient Light Sensor | I2C | SDA (Pin 3), SCL (Pin 5) |
| Camera Module | RPi Camera Module v2 / USB HD Webcam | CSI Ribbon / USB | CSI Port / USB |

---

## 2. GPIO Wiring Chart

```
Raspberry Pi 4 Pinout Reference:

   3.3V (Pin 1)  [x]  [x]  5V (Pin 2)  -------------> Power to ADS1115 / Sensors
  GPIO 2 (SDA)   [x]  [x]  5V (Pin 4)
  GPIO 3 (SCL)   [x]  [x]  GND (Pin 6) -------------> Common Ground
  GPIO 4 (DHT)   [x]  [x]  GPIO 14 (TX)
           GND   [x]  [x]  GPIO 15 (RX)
```

---

## 3. Installation & Dependencies

Run the following commands on the Raspberry Pi terminal:

```bash
# Update system & install system dependencies
sudo apt-get update
sudo apt-get install -y python3-pip python3-opencv i2c-tools

# Enable I2C interface
sudo raspi-config nonint do_i2c 0

# Install Python hardware libraries
pip3 install requests Adafruit_DHT smbus2 adafruit-circuitpython-ads1x15 opencv-python
```

---

## 4. Running the Nodes

### A. Transmit IoT Telemetry to Backend
```bash
python3 sensor_node.py --backend http://<SERVER_IP>:8000 --interval 5
```

### B. Capture Leaf Photos & Run AI Disease Diagnosis
```bash
python3 camera_node.py --backend http://<SERVER_IP>:8000 --crop Tomato --interval 600
```

---

## 5. Systemd Service Deployment (Automated Boot)

Create `/etc/systemd/system/thalir-sensor.service`:

```ini
[Unit]
Description=Thalir RPi IoT Sensor Transmission Service
After=network.target

[Service]
ExecStart=/usr/bin/python3 /home/pi/Thalir/raspberry-pi/sensor_node.py --backend http://192.168.1.100:8000
WorkingDirectory=/home/pi/Thalir/raspberry-pi
StandardOutput=inherit
StandardError=inherit
Restart=always
User=pi

[Install]
WantedBy=multi-user.target
```

Enable and start service:
```bash
sudo systemctl enable thalir-sensor.service
sudo systemctl start thalir-sensor.service
```
