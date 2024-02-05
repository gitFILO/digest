/** @type {import('next').NextConfig} */

const nextConfig = {
    reactStrictMode: false,
    
    async headers() {
            
        return [
            {
                // matching all API routes
                source: "/api/:path*",
                headers: [
                    { key: "Access-Control-Allow-Credentials", value: "true" },
                    // { key: "Access-Control-Allow-Origin", value: "https://www.youtube.com" }, // replace this your actual origin https://www.youtube.com
                    { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT,OPTIONS" },
                    { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
                ]
            }
        ]
    }
};

export default nextConfig;
