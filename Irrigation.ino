#define IR_PIN 27           // IR sensor output pin
#define RELAY_PIN 26        // Relay control pin (active LOW)
#define FLOW_SENSOR_PIN 25  // Flow sensor output pin
#define LED_PIN 13          // LED pin (you can use any GPIO pin)

volatile int flowPulseCount = 0;
float flowRate = 0.0;
unsigned long lastMeasureTime = 0;

void IRAM_ATTR flowPulseISR() {
  flowPulseCount++;  // Count each pulse from flow sensor
}

void setup() {
  Serial.begin(115200);

  pinMode(IR_PIN, INPUT);
  pinMode(RELAY_PIN, OUTPUT);
  pinMode(FLOW_SENSOR_PIN, INPUT_PULLUP);
  pinMode(LED_PIN, OUTPUT);

  digitalWrite(RELAY_PIN, HIGH);  // Solenoid OFF initially
  digitalWrite(LED_PIN, LOW);     // LED OFF initially

  attachInterrupt(digitalPinToInterrupt(FLOW_SENSOR_PIN), flowPulseISR, RISING);

  Serial.println("Smart Tap System with Leakage Detection + LED Alert Started...");
}

void loop() {
  int irValue = digitalRead(IR_PIN);

  // === Hand Detection and Solenoid Control ===
  if (irValue == LOW) {
    Serial.println("Hand Detected → Solenoid ON");
    digitalWrite(RELAY_PIN, LOW);  // Turn ON solenoid
  } else {
    Serial.println("No Hand → Solenoid OFF");
    digitalWrite(RELAY_PIN, HIGH); // Turn OFF solenoid
  }

  // === Flow Measurement every 1 second ===
  if (millis() - lastMeasureTime >= 1000) {
    detachInterrupt(digitalPinToInterrupt(FLOW_SENSOR_PIN));

    // Calculate flow rate (for YF-S201: 7.5 pulses/sec = 1 L/min)
    flowRate = (flowPulseCount / 7.5);  // in L/min

    Serial.print("Flow Rate: ");
    Serial.print(flowRate);
    Serial.println(" L/min");

    // === Leakage / Normal Logic ===
    if (irValue == HIGH) {  // Only check when no hand detected
      if (flowRate > 0.1) {
        Serial.println("⚠️ LEAKAGE DETECTED!");
        digitalWrite(LED_PIN, HIGH);  // Turn ON LED for leakage
      } else {
        Serial.println("✅ NORMAL");
        digitalWrite(LED_PIN, LOW);   // Turn OFF LED when normal
      }
    } else {
      digitalWrite(LED_PIN, LOW);     // LED off when hand is detected
    }

    // Reset for next measurement
    flowPulseCount = 0;
    lastMeasureTime = millis();

    attachInterrupt(digitalPinToInterrupt(FLOW_SENSOR_PIN), flowPulseISR, RISING);
  }

  delay(200);
}