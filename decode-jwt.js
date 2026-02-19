const jwt = process.argv[2];

if (!jwt) {
  console.log('Usage: node decode-jwt.js <JWT_TOKEN>');
  process.exit(1);
}

try {
  const parts = jwt.split('.');
  
  if (parts.length !== 3) {
    console.error('Invalid JWT format');
    process.exit(1);
  }

  const header = JSON.parse(Buffer.from(parts[0], 'base64').toString());
  const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());

  console.log('Header:', JSON.stringify(header, null, 2));
  console.log('\nPayload:', JSON.stringify(payload, null, 2));

  if (payload.exp) {
    const expiryDate = new Date(payload.exp * 1000);
    const isExpired = Date.now() > payload.exp * 1000;
    console.log('\nExpires:', expiryDate.toLocaleString());
    console.log('Status:', isExpired ? 'EXPIRED' : 'VALID');
  }

  if (payload.iat) {
    const issuedDate = new Date(payload.iat * 1000);
    console.log('Issued:', issuedDate.toLocaleString());
  }
} catch (error) {
  console.error('Error decoding JWT:', error.message);
  process.exit(1);
}
