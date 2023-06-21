const { SuperfaceClient } = require("@superfaceai/one-sdk");
require("dotenv").config();

const sdk = new SuperfaceClient();

const getLocation = async (ipAddress) => {
    try {
        const profile = await sdk.getProfile("address/ip-geolocation@1.0.1");

        const result = await profile.getUseCase("IpGeolocation").perform(
            {
                ipAddress: ipAddress,
            },
            {
                provider: "ipdata",
                security: {
                    apikey: {
                        apikey: process.env.IPDATA_API_KEY,
                    },
                },
            }
        );
        const data = result.unwrap();
        return data;
    } catch (error) {
        throw Error(error);
    }
};

module.exports = getLocation;
