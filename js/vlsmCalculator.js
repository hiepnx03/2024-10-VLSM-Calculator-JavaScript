// Function to dynamically create inputs for each LAN's host count
document.getElementById('lanCount').addEventListener('input', function () {
  const lanInputs = document.getElementById('lanInputs');
  lanInputs.innerHTML = ''; // Clear previous inputs
  const count = parseInt(this.value, 10);
  for (let i = 1; i <= count; i++) {
    const label = document.createElement('label');
    label.textContent = `Number of Hosts for LAN ${i}:`;
    const input = document.createElement('input');
    input.type = 'number';
    input.id = `lan${i}`;
    input.placeholder = `Enter number of hosts for LAN ${i}`;
    input.addEventListener('input', calculateVLSM); // Automatically calculate when input changes
    lanInputs.appendChild(label);
    lanInputs.appendChild(input);
  }
  calculateVLSM(); // Trigger calculation when number of LANs changes
});

// IP to Integer conversion
function ipToInt(ipAddress) {
  const octets = ipAddress.split('.');
  return (parseInt(octets[0]) << 24) |
    (parseInt(octets[1]) << 16) |
    (parseInt(octets[2]) << 8) |
    parseInt(octets[3]);
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

// Calculate the Broadcast Address
function getBroadcastAddress(networkAddress, subnetMask) {
  const broadcast = networkAddress | (~subnetMask >>> 0);
  return intToIp(broadcast);
}

// Convert Subnet Mask from Bits to Decimal
function convertToSubnetMask(subnetBits) {
  const mask = (0xFFFFFFFF << (32 - subnetBits)) >>> 0;
  return intToIp(mask);
}

// Sort LANs based on the number of hosts (Descending)
function sortLans(hosts, lanIndices) {
  for (let i = 0; i < hosts.length - 1; i++) {
    for (let j = i + 1; j < hosts.length; j++) {
      if (hosts[i] < hosts[j]) {
        let tempHost = hosts[i];
        hosts[i] = hosts[j];
        hosts[j] = tempHost;

        let tempIndex = lanIndices[i];
        lanIndices[i] = lanIndices[j];
        lanIndices[j] = tempIndex;
      }
    }
  }
}

// Global variable to keep track of the row index
let rowIndex = 1;

// Calculate Subnet for each LAN
function calculateSubnet(networkAddress, hostCount, lanName, initialSubnetBits) {
  let m = Math.ceil(Math.log2(hostCount + 2));
  let subnetBits = 32 - m;
  if (subnetBits < initialSubnetBits) subnetBits = initialSubnetBits;

  const baseIP = ipToInt(networkAddress);
  const subnetMask = convertToSubnetMask(subnetBits);
  const subnetMaskInt = ipToInt(subnetMask);
  const broadcastAddress = getBroadcastAddress(baseIP, subnetMaskInt);
  const stepSize = 1 << (32 - subnetBits);

  const firstHostAddress = intToIp(baseIP + 1);
  const broadcastInt = ipToInt(broadcastAddress);
  const lastHostAddress = intToIp(broadcastInt - 1);

  // const result = `
  //               <b>------ ${lanName} ------</b><br>
  //               Number of Hosts: ${hostCount}<br>
  //               m: (2^m-2 >= ${hostCount}) => ${m}<br>
  //               Subnet Bits: 32 - m = 32 - ${m} = ${subnetBits} =>/${subnetBits}<br>
  //               Step: 2^m = 2^${m}  ${stepSize}<br>
  //               Network Address: ${networkAddress}/${subnetBits}<br>
  //               Subnet Mask: ${subnetMask}<br>
  //               First Host: ${firstHostAddress}<br>
  //               Last Host: ${lastHostAddress}<br>
  //               Broadcast Address: ${broadcastAddress}<br><br>
  //           `;

  const result = `
                <b>------ ${lanName} ------</b><br>
                ${lanName}  Number of Hosts: ${hostCount}<br>
                ${lanName}  m: (2<sup>m</sup>-2 >= ${hostCount}) => ${m}<br>
                ${lanName}  Subnet Bits: 32 - m = 32 - ${m} = ${subnetBits} => /${subnetBits}<br>
                ${lanName}  Step: 2<sup>m</sup> = 2<sup>${m}</sup> = ${stepSize}<br>
                ${lanName}  Network Address: ${networkAddress}/${subnetBits}<br>
                ${lanName}  Subnet Mask: ${subnetMask}<br>
                ${lanName}  First Host: ${firstHostAddress}<br>
                ${lanName}  Last Host: ${lastHostAddress}<br>
                ${lanName}  Broadcast Address: ${broadcastAddress}<br><br>
            `;


  document.getElementById('result').innerHTML += result;
  // Call the function to display subnet information in the table
  displaySubnetInTable(lanName, `${networkAddress}/${subnetBits}`, subnetMask, broadcastAddress,stepSize);

  const nextNetwork = baseIP + stepSize;
  return intToIp(nextNetwork);
}

// Function to display subnet information in a table
function displaySubnetInTable(lanName, networkAddress, subnetMask, broadcastAddress,stepSize) {
  const resultTableBody = document.getElementById('resultTableBody');
  const row = document.createElement('tr');
  row.innerHTML = `
    <td>${rowIndex}</td>
    <td>${lanName}</td>
    <td>${networkAddress}</td>
    <td>${subnetMask}</td>
    <td>${stepSize}</td>
    <td>${broadcastAddress}</td>
  `;
  resultTableBody.appendChild(row);
  rowIndex++; // Increment the index for the next row
}

// Divide Subnets among LANs
function divideSubnets(networkAddress, hosts, lanIndices, initialSubnetBits) {
  for (let i = 0; i < hosts.length; i++) {
    const lanName = "LAN" + lanIndices[i];
    networkAddress = calculateSubnet(networkAddress, hosts[i], lanName, initialSubnetBits);
  }
}

// Main VLSM Calculation
function calculateVLSM() {
  const ipWithCidr = document.getElementById('networkAddress').value;
  const [networkAddress, cidr] = ipWithCidr.split('/');
  const initialSubnetBits = parseInt(cidr, 10);
  const lanCount = parseInt(document.getElementById('lanCount').value, 10);

  const hosts = [];
  const lanIndices = [];

  for (let i = 1; i <= lanCount; i++) {
    hosts.push(parseInt(document.getElementById(`lan${i}`).value, 10));
    lanIndices.push(i);
  }

  // Clear the result area and table before new calculation
  document.getElementById('result').innerHTML = '';
  const resultTableBody = document.getElementById('resultTableBody');
  resultTableBody.innerHTML = ''; // Clear previous table data
  rowIndex = 1; // Reset the row index

  // Sort LANs by number of hosts
  sortLans(hosts, lanIndices);

  // Divide subnets and calculate
  divideSubnets(networkAddress, hosts, lanIndices, initialSubnetBits);
}

// Automatically trigger calculation when network address changes
document.getElementById('networkAddress').addEventListener('input', calculateVLSM);
