exports.attributes = () => {
  return `array`;
};
exports.controllers = () => {
  return `array?controllers=true`;
};
exports.spaceUsage = () => {
  return `array?space=true`
};
exports.historicalSpaceUsage = (hours = 1) => {
  return `array?space=true&historical=${hours}h`;
};
exports.performance = () => {
  return `array?action=monitor`;
};
exports.historicalPerformance = (hours = 1) => {
  return `array?action=monitor&historical=${hours}h`;
};
exports.connections = () => {
  return `array/connection`;
};
exports.lockStatus = () => {
  return `array/console_lock`;
};
exports.phonehomeStatus = () => {
  return `array/phonehome`;
};
exports.remoteAssistStatus = () => {
  return `array/remoteassist`;
};


