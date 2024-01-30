import "./page.css";

export default function Home() {
    return (
        <div>
            <div className="relative min-h-screen w-full text-center">
                <video autoPlay muted loop className="video-background">
                    <source
                        src="https://video.wixstatic.com/video/11062b_9de2dbff3dda403b944bb98c41cb5764/1080p/mp4/file.mp4"
                        type="video/mp4"
                    />
                </video>
                <div className="px-3 text-center">
                    <div className="pt-16 font-sans font-bold uppercase tracking-widest">
                        Ambition is the first step towards
                    </div>
                    <div className="font-lulo pt-4 text-4xl sm:text-6xl md:text-8xl">
                        Success
                    </div>
                    <div className="pt-6 text-xl tracking-wider">
                        Now Available for Online Coaching
                    </div>
                    <div className="pt-7">
                        <a className="btn-main" href="/book-now">
                            Book Now
                        </a>
                    </div>
                </div>
            </div>

            <div className="mt-[-175px]">
                <div className="relative h-full w-full bg-white">
                    <div className="max-w-full-content mx-auto h-full">
                        <div className="py-2 pl-5 pr-5 sm:w-2/4 sm:pr-0 sm:pr-24">
                            <div className="header-line my-8"></div>
                            <h2 className="title mb-7 mt-10 max-w-xs tracking-tighter">
                                About salon
                            </h2>
                            <p className="flex-1 text-sm leading-7">
                                My name is Allan Johnson and I am a personal
                                coach. My goal is to assist people identify and
                                overcome obstacles in their lives and to
                                maximize their potential. Through my coaching, I
                                help people set goals, build the confidence and
                                skills they need to achieve success and develop
                                a positive mindset and a sense of self-worth.
                            </p>
                            <div className="mb-20 mt-11">
                                <a href="/about-me" className="btn-main">
                                    Read More
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="h-full w-full sm:absolute sm:left-2/4 sm:top-0 sm:w-2/4">
                        <div className="h-full min-h-[320px] w-full bg-[url('/about-me.jpeg')] bg-cover"></div>
                    </div>
                </div>
            </div>
            <div className="parallax-background">
                {/* {services?.length ? (
                    <div
                        className="max-w-full-content mx-auto bg-transparent p-5"
                        data-testid={testIds.HOME_PAGE.SERVICES_SECTION}
                    >
                        <div className="header-line my-8"></div>
                        <h2 className="title mb-7 mt-10 max-w-xs tracking-tighter">
                            How I Can Help You
                        </h2>

                        <>
                            <ServiceListPreview services={services} />
                            <div className="my-8 flex justify-center">
                                <a className="btn-main" href="/book-now">
                                    More Services
                                </a>
                            </div>
                        </>
                    </div>
                ) : null} */}
            </div>
        </div>
    );
}
