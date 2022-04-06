// This function decodes Bre's Dragino LHT65 sensor payload data
// Source for Decoder sub-function: //http://www.dragino.com/downloads/downloads/LHT65/UserManual/LHT65_Temperature_Humi//dity_Sensor_UserManual_v1.3.pdf
function Decoder(bytes, port) {
  // Decode an uplink message from a buffer
  // (array) of bytes to an object of fields.
  var value = (bytes[0] << 8 | bytes[1]) & 0x3FFF;
  var batV = value / 1000; //Battery,units:V

  value = bytes[2] << 8 | bytes[3];
  if (bytes[2] & 0x80) {
    value |= 0xFFFF0000;
    }
  var temp_SHT = (value / 100).toFixed(2); //SHT20,temperature,units:°C

  value = bytes[4] << 8 | bytes[5];
  var hum_SHT = (value / 10).toFixed(1); //SHT20,Humidity,units:%

  value = bytes[7] << 8 | bytes[8];
  if (bytes[7] & 0x80) {
    value |= 0xFFFF0000;
    }
  
  var temp_ds = (value / 100).toFixed(2); //DS18B20,temperature,units:°C

  var decodedPayload = {
      "BatV": batV,
      "TempC_DS": temp_ds,
      "TempC_SHT": temp_SHT,
      "Hum_SHT": hum_SHT
    };
  // END TODO

  return Serialize(decodedPayload)
}

// This function maps values to respective entry fields in Google Form Sheet
// Generated: do not touch unless your Google Form fields have changed
var field_mapping = {
  "BatV": "entry.35237966",
  "Hum_SHT": "entry.10984992",
  "TempC_DS": "entry.1368947862",
  "TempC_SHT": "entry.1624375976"
  };
// End Generated

// This function serializes the decoded payload into a string
function Serialize(payload) {
  var str = [];
  for (var key in payload) {
    if (payload.hasOwnProperty(key)) {
      var name = encodeURIComponent(field_mapping[key]);
      var value = encodeURIComponent(payload[key]);
      str.push(name + "=" + value);
    }
  }
  return str.join("&");
}
// DO NOT REMOVE: Google Form Function
