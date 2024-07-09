const { ipfsService } = require('../services');

async function main() {

    const cert = {
        holder: '0x1234567890',
        pdf: 'QmX8Q7aZ7n1cYbQmZ2Fy4m7z7n1cYbQmZ2Fy4m7z',
        info: {
            name: 'John Doe',
            identity_number: '1234567890',
            institution: 'HCMUT',
            type: 'Bachelor',
            score: '3.5',
            expireDate: '2025-12-31',
            note: 'Good student',
        }
    }

    const hashInfo = 'dabfbc6efbb58f335d14fb39a478ca9182e48c7c6fb63561cf79b2d0cb610ac0';

    const ipfsHash = await ipfsService.uploadJSONToIPFS(cert, hashInfo);

    console.log("Certificate issued successfully with IPFS hash:", ipfsHash);
}

main();