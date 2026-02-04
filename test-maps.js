
const getGoogleMapsUrl = (embedCode, address) => {
    if (embedCode) {
        let cleanUrl = embedCode;
        // Extract src from iframe tag if present
        const srcMatch = embedCode.match(/src="([^"]+)"/);
        if (srcMatch) {
            cleanUrl = srcMatch[1];
        }

        console.log('Clean URL:', cleanUrl);

        // 1. CID Match
        const cidMatch = cleanUrl.match(/!1s0x[0-9a-fA-F]+:0x([0-9a-fA-F]+)/);
        if (cidMatch) {
            console.log('CID Match Found:', cidMatch[1]);
            try {
                const cidDecimal = BigInt(`0x${cidMatch[1]}`).toString();
                console.log('Decimal CID:', cidDecimal);
                return `https://www.google.com/maps?cid=${cidDecimal}`;
            } catch (e) {
                console.log('BigInt error:', e);
            }
        } else {
            console.log('No CID Match');
        }
    }
    return '';
};

// Test Cases
const test1 = '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3784.869273663674!2d79.11659779999999!3d18.4497495!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bccd9aee3845bbf%3A0x3368291079549320!2sAxis%20Bank%20ATM!5e0!3m2!1sen!2sin!4v1738743120000!5m2!1sen!2sin" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>';

console.log('Result 1:', getGoogleMapsUrl(test1));
