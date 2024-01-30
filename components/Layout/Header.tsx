/* eslint-disable react/self-closing-comp */
import { NavBar } from "./NavBar/NavBar";

function Header() {
    return (
        <>
            <header className="h-header absolute z-40 w-full bg-white md:fixed">
                <div className="max-w-full-content h-header relative mx-auto flex items-center justify-center gap-8">
                    <a
                        href="/"
                        target="_self"
                        className="ml-3 flex min-w-[300px] flex-col items-center justify-between"
                    >
                        <div className="font-lulo mb-3">
                            Salon Rium Coiffure
                        </div>
                    </a>
                    <div className="flex-grow pb-5 pr-5">
                        <NavBar />
                    </div>
                </div>
            </header>
            <div className="h-header"></div>
        </>
    );
}

export default Header;
