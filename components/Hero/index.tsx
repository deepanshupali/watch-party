import Link from "next/link";

const Hero = () => {
  return (
    <>
      <section
        id="home"
        className="relative flex justify-center items-center overflow-hidden bg-gradient-to-r from-gray-800 to-gray-900 pb-16 pt-[120px] dark:bg-gray-800 md:pb-[120px] md:pt-[150px] xl:pb-[160px] xl:pt-[180px] 2xl:pb-[200px] 2xl:pt-[210px]"
      >
        <div className="container mx-auto max-w-3xl text-center flex flex-col gap-8">
          <h1 className="mb-5 text-4xl font-bold leading-tight text-white sm:text-3xl sm:leading-tight md:text-5xl md:leading-tight">
            WATCH YOUTUBE TOGETHER
          </h1>
          <p className="mb-12 text-lg text-white leading-relaxed">
            Gather your friends (virtually) for an epic YouTube Watch Party!
            choose the video, and get ready to share laughs, comments, and
            reactions in real-time. It's like watching YouTube together on the
            couch, even if you're miles apart. A lively chat window sits beside
            the video, allowing you to share reactions creating a virtual
            hangout space alongside your favorite content.
          </p>
          <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
            <Link
              href="/login"
              className="inline-block rounded-lg px-8 py-4 text-base font-semibold bg-white  text-black hover:bg-purple-600 duration-300 ease-in-out"
            >
              Get Started
            </Link>
          </div>
        </div>
        <div className="absolute right-0 top-0 z-[-1] opacity-30 lg:opacity-100">
          <svg
            width="450"
            height="556"
            viewBox="0 0 450 556"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* SVG code remains unchanged */}
          </svg>
        </div>
        <div className="absolute bottom-0 left-0 z-[-1] opacity-30 lg:opacity-100">
          <svg
            width="364"
            height="201"
            viewBox="0 0 364 201"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* SVG code remains unchanged */}
          </svg>
        </div>
      </section>
    </>
  );
};

export default Hero;
