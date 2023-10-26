import boto3
from collections import namedtuple
import json
import random
import time
from typing import Dict

FLEET_NAME = "Test001"
ROBOT_NAMES = [
    "TestUnit001",
    "TestUnit002",
]
MqttMessage = namedtuple('MqttMessage', ['topic', 'payload'])


class Robot:
    def __init__(self, name: str):
        self._name = name
        self._battery_health = random.random()
        self._battery = random.randint(30, 90)
        self._charging = False

    def build_message(self) -> Dict:
        if self._charging:
            self._battery = max(100, self._battery + 40)
            if self._battery == 100:
                self._charging = False
        else:
            self._battery -= int(8 * (1.1 - self._battery_health))
            if self._battery < 10:
                self._charging = True
        print(self._name, self._battery, self._battery_health)

        return MqttMessage(
            topic=f"robots/{FLEET_NAME}/{self._name}/battery",
            payload=json.dumps({
                "battery": self._battery,
                "timeInSeconds": int(time.time()),
                "offsetInNanos": 0,
            })
        )


def main():
    client = boto3.client('iot-data')
    robots = [Robot(name) for name in ROBOT_NAMES]

    while True:
        for robot in robots:
            entry = robot.build_message()
            client.publish(topic=entry.topic, payload=entry.payload)
        print(f"Tick complete. Posted {len(robots)} statuses.")
        time.sleep(1)


if __name__ == "__main__":
    main()
