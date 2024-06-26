import Balancer from "react-wrap-balancer";

export default function AccessDenied() {
    return (
        <h1
            className="animate-fade-up bg-clip-text text-center font-display text-4xl font-bold tracking-[-0.02em] drop-shadow-sm md:text-7xl md:leading-[5rem]"
            style={{
                animationDelay: "0.15s",
                animationFillMode: "forwards"
            }}
        >
            <p>
                <Balancer>Access Denied</Balancer>
            </p>
        </h1>
    );
}
