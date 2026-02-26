import serial
import requests

ser = serial.Serial('COM3', 115200)  # Change to your COM port

while True:
    try:
        line = ser.readline().decode().strip()
        print("Arduino:", line)

        if "Flow Rate:" in line:
            flow = float(line.split(":")[1].replace("L/min", "").strip())

            data = {
                "flow_rate": flow,
                "ir_status": 1
            }

            requests.post(
                "http://127.0.0.1:5000/api/sensor-data",
                json=data
            )

    except Exception as e:
        print("Error:", e)