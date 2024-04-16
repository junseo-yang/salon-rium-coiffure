/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "lh3.googleusercontent.com",
                pathname: "**"
            },
            {
                protocol: "https",
                hostname: "vercel.com",
                pathname: "**"
            },
            {
                protocol: "https",
                hostname: "img.hair.ailabapi.com",
                pathname: "**"
            },
            {
                protocol: "https",
                hostname: "img2.hairstyle.ailabapi.com",
                pathname: "**"
            }
        ]
    }
};

export default nextConfig;
