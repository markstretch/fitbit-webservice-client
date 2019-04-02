import * as messaging from "messaging";
import { peerSocket } from "messaging";
import { HeartRateSensor } from "heart-rate";

hrm.onreading = function() {
  if (display.on) {
    console.log("heart rate: " + hrm.heartRate);
  }
  if (peerSocket.readyState === peerSocket.OPEN) {
    if (hrm.heartRate > 60) {
      messaging.peerSocket.send(hrm.heartRate);
    }
  }
}

hrm.start();

//Send message directly to companion to be picked up in the onmessage event
function sendMessage() {
  if (peerSocket.readyState === peerSocket.OPEN) {
    if (hrm.heartRate > 60) {
      messaging.peerSocket.send(hrm.heartRate);
    }
  }
}

messaging.peerSocket.onerror = function(err) {
  console.log("ERROR: " + err);
}
