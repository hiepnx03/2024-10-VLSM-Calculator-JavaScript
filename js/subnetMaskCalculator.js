// Convert Subnet Mask from Bits to Decimal
function convertToSubnetMask(subnetBits) {
  const mask = (0xFFFFFFFF << (32 - subnetBits)) >>> 0;
  return intToIp(mask);
}

// Integer to IP conversion
function intToIp(ip) {
  return [
    (ip >> 24) & 0xFF,
    (ip >> 16) & 0xFF,
    (ip >> 8) & 0xFF,
    ip & 0xFF
  ].join('.');
}

// Function to calculate and display subnet mask based on subnet bits
function calculateSubnetMask() {
  const subnetBits = parseInt(document.getElementById('subnetBits').value, 10);
  if (isNaN(subnetBits) || subnetBits < 0 || subnetBits > 32) {
    document.getElementById('subnetMaskResult').innerHTML = 'Invalid subnet bits. Please enter a value between 0 and 32.';
    return;
  }
  const subnetMask = convertToSubnetMask(subnetBits);
  document.getElementById('subnetMaskResult').innerHTML = `Subnet Mask: ${subnetMask}`;
}
